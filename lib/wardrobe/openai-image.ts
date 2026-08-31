import { readFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

export type GeneratedTryOnImage = {
  buffer: Buffer;
  extension: string;
};

export async function generateTryOnImage(options: {
  personImagePath: string;
  garmentImagePath: string;
  garmentImagePaths?: string[];
  prompt?: string;
  size?: string;
}): Promise<GeneratedTryOnImage> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      return createLocalTryOnPreview(options.personImagePath, options.garmentImagePath, options.size);
    }

    throw new Error("OPENAI_API_KEY is not configured. Uploaded images were saved, but AI try-on generation cannot run.");
  }

  const model = process.env.OPENAI_IMAGE_MODEL || "gpt-image-2";
  const baseUrl = (process.env.OPENAI_API_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const prompt = [
    "Create a realistic virtual try-on image.",
    "Keep the person's face, body shape, pose, skin tone, and background as consistent as possible.",
    "Replace or dress the person with the provided garment image naturally, preserving fabric details, color, fit, and lighting.",
    options.prompt || "",
  ]
    .filter(Boolean)
    .join("\n");

  const form = new FormData();
  form.set("model", model);
  form.set("prompt", prompt);
  form.set("size", options.size || process.env.OPENAI_IMAGE_SIZE || "1024x1024");
  form.set("quality", process.env.OPENAI_IMAGE_QUALITY || "high");
  form.set("output_format", "png");
  form.append("image[]", await fileFromPath(options.personImagePath, "image-1.png"));
  const garmentPaths = options.garmentImagePaths?.length ? options.garmentImagePaths : [options.garmentImagePath];
  for (const [index, garmentPath] of garmentPaths.entries()) {
    form.append("image[]", await fileFromPath(garmentPath, `garment-${index + 1}.png`));
  }

  const response = await fetch(`${baseUrl}/images/edits`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: form,
  });

  const responseText = await response.text();
  const data = parseJsonResponse(responseText);

  if (!response.ok) {
    throw new Error(data?.error?.message || `OpenAI image request failed (${response.status})${responseText.trim().startsWith("<") ? ": non-JSON HTML response from API endpoint" : ""}`);
  }

  const b64 = data?.data?.[0]?.b64_json;
  const url = data?.data?.[0]?.url;

  if (b64) {
    return { buffer: Buffer.from(b64, "base64"), extension: ".png" };
  }

  if (url) {
    const imageResponse = await fetch(url);
    if (!imageResponse.ok) {
      throw new Error("Failed to download the generated image.");
    }
    return { buffer: Buffer.from(await imageResponse.arrayBuffer()), extension: ".png" };
  }

  throw new Error("The AI try-on API did not return an image.");
}

async function fileFromPath(filePath: string, fileName?: string) {
  const buffer = await readFile(filePath);
  const pngBuffer = await sharp(buffer).png().toBuffer();
  const uploadName = fileName || path.basename(filePath).replace(/\.[^.]+$/, ".png");

  return new File([new Uint8Array(pngBuffer)], uploadName, { type: "image/png" });
}

function parseJsonResponse(text: string) {
  try {
    return JSON.parse(text || "{}");
  } catch {
    return {};
  }
}

async function createLocalTryOnPreview(personImagePath: string, garmentImagePath: string, size = "1024x1536"): Promise<GeneratedTryOnImage> {
  const [width, height] = parseImageSize(size);
  const person = await imageDataUri(personImagePath);
  const garment = await imageDataUri(garmentImagePath);
  const now = new Date().toLocaleString("en-US", { hour12: false });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f8fafc"/>
      <stop offset="1" stop-color="#e0e7ff"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="20" flood-color="#0f172a" flood-opacity="0.18"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" rx="32" fill="url(#bg)"/>
  <text x="${width / 2}" y="64" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#111827">Virtual Try-On Preview</text>
  <text x="${width / 2}" y="104" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#64748b">Local preview mode · configure OPENAI_API_KEY for real AI generation</text>
  <rect x="${width * 0.08}" y="${height * 0.14}" width="${width * 0.84}" height="${height * 0.68}" rx="30" fill="#ffffff" filter="url(#shadow)"/>
  <image href="${person}" x="${width * 0.12}" y="${height * 0.18}" width="${width * 0.5}" height="${height * 0.56}" preserveAspectRatio="xMidYMid meet"/>
  <rect x="${width * 0.58}" y="${height * 0.48}" width="${width * 0.24}" height="${height * 0.24}" rx="24" fill="#ffffff" stroke="#c7d2fe" stroke-width="4" filter="url(#shadow)"/>
  <image href="${garment}" x="${width * 0.6}" y="${height * 0.5}" width="${width * 0.2}" height="${height * 0.2}" preserveAspectRatio="xMidYMid meet"/>
  <path d="M ${width * 0.6} ${height * 0.42} C ${width * 0.5} ${height * 0.34}, ${width * 0.42} ${height * 0.36}, ${width * 0.34} ${height * 0.42}" fill="none" stroke="#6366f1" stroke-width="8" stroke-linecap="round" stroke-dasharray="16 18"/>
  <text x="${width * 0.7}" y="${height * 0.79}" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#475569">Garment source</text>
  <rect x="${width * 0.17}" y="${height * 0.84}" width="${width * 0.66}" height="58" rx="29" fill="#111827"/>
  <text x="${width / 2}" y="${height * 0.84 + 37}" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#ffffff">Preview generated at ${escapeXml(now)}</text>
</svg>`;

  return { buffer: Buffer.from(svg), extension: ".svg" };
}

async function imageDataUri(filePath: string) {
  const buffer = await readFile(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const type = ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : ext === ".webp" ? "image/webp" : ext === ".gif" ? "image/gif" : "image/png";
  return `data:${type};base64,${buffer.toString("base64")}`;
}

function parseImageSize(size: string) {
  const [rawWidth, rawHeight] = size.split("x").map((value) => Number.parseInt(value, 10));
  const width = Number.isFinite(rawWidth) ? rawWidth : 1024;
  const height = Number.isFinite(rawHeight) ? rawHeight : 1536;
  return [width, height] as const;
}

function escapeXml(value: string) {
  return value.replace(/[<>&"']/g, (char) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    '"': "&quot;",
    "'": "&apos;",
  })[char] || char);
}
