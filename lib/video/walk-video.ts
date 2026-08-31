import { readFile } from "fs/promises";
import path from "path";
import { getWalkVideoConfig, walkVideoPrompt } from "./walk-video-config";

export type GeneratedWalkVideo = {
  url?: string;
  buffer?: Buffer;
  extension: string;
  mimeType: string;
  raw: unknown;
};

type VideoApiResponse = Record<string, unknown>;

const TASK_SUBMIT_ENDPOINT = "/v1/task/submit";
const TASK_STATUS_ENDPOINT = "/v1/task";
const TASK_POLL_INTERVAL_MS = 5000;
const TASK_MAX_ATTEMPTS = 36;

export async function generateWalkVideoFromImage(imagePath: string, imageUrl: string): Promise<GeneratedWalkVideo> {
  const config = getWalkVideoConfig();
  const publicImageUrl = buildPublicImageUrl(imageUrl);
  const imageBuffer = await readFile(imagePath);
  const mimeType = mimeTypeFromPath(imagePath);
  const fallbackImageDataUrl = `data:${mimeType};base64,${imageBuffer.toString("base64")}`;
  const resolvedImageUrl = publicImageUrl || fallbackImageDataUrl;

  const response = await fetch(buildTaskSubmitUrl(config.baseUrl), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.model,
      input: {
        prompt: walkVideoPrompt,
        start_frames: [resolvedImageUrl],
        aspect_ratio: "9:16",
        resolution: "720p",
        duration: 5,
        audio: false,
      },
    }),
  });

  const text = await response.text();
  const data = parseJson(text);

  if (!response.ok) {
    throw new Error(extractErrorMessage(data) || text || `${response.status} ${response.statusText}`);
  }

  const immediateVideoUrl = extractVideoUrl(data);
  if (immediateVideoUrl) {
    return { url: immediateVideoUrl, extension: extensionFromUrl(immediateVideoUrl), mimeType: mimeTypeFromUrl(immediateVideoUrl), raw: data };
  }

  const taskId = extractTaskId(data);
  if (!taskId) {
    throw new Error("The video provider response did not include a task id or video URL.");
  }

  return pollWalkVideoTask(config.baseUrl, config.apiKey, taskId);
}

export async function downloadVideoAsset(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Generated video was created, but the video file could not be downloaded.");
  }
  const contentType = response.headers.get("content-type") || mimeTypeFromUrl(url);
  const buffer = Buffer.from(await response.arrayBuffer());
  return {
    buffer,
    extension: extensionFromMimeType(contentType) || extensionFromUrl(url),
    mimeType: contentType,
  };
}

async function pollWalkVideoTask(baseUrl: string, apiKey: string, taskId: string): Promise<GeneratedWalkVideo> {
  let lastPayload: VideoApiResponse = {};

  for (let attempt = 0; attempt < TASK_MAX_ATTEMPTS; attempt += 1) {
    await sleep(TASK_POLL_INTERVAL_MS);

    const response = await fetch(buildTaskStatusUrl(baseUrl, taskId), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    const text = await response.text();
    const data = parseJson(text);
    lastPayload = data;

    if (!response.ok) {
      throw new Error(extractErrorMessage(data) || text || `${response.status} ${response.statusText}`);
    }

    const status = extractTaskStatus(data);
    if (status === "success" || status === "completed" || status === "succeeded") {
      const videoUrl = extractVideoUrl(data);
      if (videoUrl) {
        return { url: videoUrl, extension: extensionFromUrl(videoUrl), mimeType: mimeTypeFromUrl(videoUrl), raw: data };
      }
      const base64Video = extractBase64Video(data);
      if (base64Video) {
        return { buffer: Buffer.from(base64Video, "base64"), extension: "mp4", mimeType: "video/mp4", raw: data };
      }
      throw new Error("The video task succeeded, but no video URL was returned.");
    }

    if (status === "fail" || status === "failed" || status === "error") {
      throw new Error(extractErrorMessage(data) || "Walk video generation failed in provider task.");
    }
  }

  throw new Error(`Walk video generation timed out. Task ID: ${taskId}. Last status: ${extractTaskStatus(lastPayload) || "unknown"}`);
}

function buildTaskSubmitUrl(baseUrl: string) {
  return new URL(TASK_SUBMIT_ENDPOINT, `${baseUrl}/`).toString();
}

function buildTaskStatusUrl(baseUrl: string, taskId: string) {
  return new URL(`${TASK_STATUS_ENDPOINT}/${encodeURIComponent(taskId)}`, `${baseUrl}/`).toString();
}

function parseJson(text: string): VideoApiResponse {
  try {
    return JSON.parse(text) as VideoApiResponse;
  } catch {
    return {};
  }
}

function buildPublicImageUrl(url: string) {
  if (!url) return "";
  if (isPublicHttpUrl(url)) return url;

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "").replace(/\/$/, "");
  if (!isPublicHttpUrl(appUrl)) return "";

  return `${appUrl}${url.startsWith("/") ? url : `/${url}`}`;
}

function isPublicHttpUrl(url: string) {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;
    if (hostname === "localhost" || hostname.endsWith(".localhost")) return false;
    if (hostname === "0.0.0.0" || hostname === "127.0.0.1" || hostname === "::1") return false;
    if (/^127\./.test(hostname)) return false;
    if (/^10\./.test(hostname)) return false;
    if (/^192\.168\./.test(hostname)) return false;
    if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)) return false;
    if (/^169\.254\./.test(hostname)) return false;
    return true;
  } catch {
    return false;
  }
}

function extractTaskId(data: VideoApiResponse): string | null {
  const directKeys = ["taskId", "task_id", "id"];
  for (const key of directKeys) {
    const value = data[key];
    if (typeof value === "string" && value) return value;
  }

  if (data.data && typeof data.data === "object") return extractTaskId(data.data as VideoApiResponse);
  if (data.result && typeof data.result === "object") return extractTaskId(data.result as VideoApiResponse);
  return null;
}

function extractTaskStatus(data: VideoApiResponse): string | null {
  const directKeys = ["status", "state"];
  for (const key of directKeys) {
    const value = data[key];
    if (typeof value === "string" && value) return value.toLowerCase();
  }

  if (data.data && typeof data.data === "object") return extractTaskStatus(data.data as VideoApiResponse);
  if (data.result && typeof data.result === "object") return extractTaskStatus(data.result as VideoApiResponse);
  return null;
}

function extractVideoUrl(data: VideoApiResponse): string | null {
  const directKeys = ["url", "video_url", "videoUrl", "output_url", "outputUrl"];
  for (const key of directKeys) {
    const value = data[key];
    if (typeof value === "string" && value.startsWith("http")) return value;
  }

  const nested = [data.data, data.output, data.outputs, data.result, data.results, data.steps, data.content];
  for (const value of nested) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item && typeof item === "object") {
          const found = extractVideoUrl(item as VideoApiResponse);
          if (found) return found;
        }
        if (typeof item === "string" && item.startsWith("http")) return item;
      }
    } else if (value && typeof value === "object") {
      const found = extractVideoUrl(value as VideoApiResponse);
      if (found) return found;
    } else if (typeof value === "string" && value.startsWith("http")) {
      return value;
    }
  }

  return null;
}

function extractBase64Video(data: VideoApiResponse): string | null {
  const keys = ["b64_json", "base64", "video_base64", "videoBase64"];
  for (const key of keys) {
    const value = data[key];
    if (typeof value === "string" && value.length > 100) return value.replace(/^data:video\/[^;]+;base64,/, "");
  }

  const nested = [data.data, data.output, data.outputs, data.result, data.results, data.steps, data.content];
  for (const value of nested) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item && typeof item === "object") {
          const found = extractBase64Video(item as VideoApiResponse);
          if (found) return found;
        }
      }
    } else if (value && typeof value === "object") {
      const found = extractBase64Video(value as VideoApiResponse);
      if (found) return found;
    }
  }

  return null;
}

function extractErrorMessage(data: VideoApiResponse) {
  const error = data.error;
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error && typeof error.message === "string") return error.message;
  if (typeof data.message === "string") return data.message;
  if (data.data && typeof data.data === "object") return extractErrorMessage(data.data as VideoApiResponse);
  if (data.result && typeof data.result === "object") return extractErrorMessage(data.result as VideoApiResponse);
  return null;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function mimeTypeFromPath(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  return "image/png";
}

function extensionFromUrl(url: string) {
  const pathname = new URL(url).pathname;
  const extension = path.extname(pathname).replace(/^\./, "").toLowerCase();
  return extension || "mp4";
}

function mimeTypeFromUrl(url: string) {
  const extension = extensionFromUrl(url);
  if (extension === "webm") return "video/webm";
  if (extension === "mov") return "video/quicktime";
  return "video/mp4";
}

function extensionFromMimeType(mimeType: string) {
  if (mimeType.includes("webm")) return "webm";
  if (mimeType.includes("quicktime")) return "mov";
  if (mimeType.includes("mp4")) return "mp4";
  return null;
}
