import { readFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

export type ProductTryOnImage = {
  buffer: Buffer;
  extension: string;
};

export const productTryOnPrompt = [
  "Create a realistic ecommerce virtual try-on image from the provided person photo and product garment reference.",
  "Preserve the person's identity, face, body shape, pose, skin tone, camera angle, and background as much as possible.",
  "Use only the clothing item from the product image as the garment reference.",
  "If the product image shows a model wearing the garment, mentally extract only the garment: ignore the product model's face, body, pose, hair, hands, legs, shoes, background, and accessories unless they are clearly part of the garment.",
  "Transfer the garment's color, fabric texture, pattern, silhouette, sleeve length, neckline, hem, buttons, pockets, and other design details onto the uploaded person naturally.",
  "Do not copy the product model. Do not change the uploaded person's face. Do not add text, logos, watermarks, extra limbs, distorted hands, or duplicate bodies.",
  "Make the result look like a high-quality fashion product preview with realistic lighting, shadows, folds, and fit.",
].join("\n");

export async function generateProductTryOnImage(options: {
  personImagePath: string;
  garmentImagePath: string;
  size?: string;
  extraPrompt?: string;
}): Promise<ProductTryOnImage> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      return createLocalProductTryOnPreview(options.personImagePath, options.garmentImagePath, options.size);
    }

    throw new Error("OPENAI_API_KEY is not configured. Product try-on generation cannot run.");
  }

  const model = process.env.OPENAI_IMAGE_MODEL || "gpt-image-2";
  const baseUrl = (process.env.OPENAI_API_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const prompt = [productTryOnPrompt, options.extraPrompt ? `Additional user requirements:\n${options.extraPrompt}` : ""].filter(Boolean).join("\n\n");

  const form = new FormData();
  form.set("model", model);
  form.set("prompt", prompt);
  form.set("size", options.size || process.env.OPENAI_IMAGE_SIZE || "1024x1536");
  form.set("quality", process.env.OPENAI_IMAGE_QUALITY || "high");
  form.set("output_format", "png");
  form.append("image[]", await fileFromPath(options.personImagePath, "person.png"));
  form.append("image[]", await fileFromPath(options.garmentImagePath, "product-garment.png"));

  const response = await fetch(`${baseUrl}/images/edits`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });

  const responseText = await response.text();
  const data = parseJsonResponse(responseText);

  if (!response.ok) {
    throw new Error(data?.error?.message || `OpenAI product try-on request failed (${response.status})${responseText.trim().startsWith("<") ? ": non-JSON HTML response from API endpoint" : ""}`);
  }

  const b64 = data?.data?.[0]?.b64_json;
  const url = data?.data?.[0]?.url;

  if (b64) return { buffer: Buffer.from(b64, "base64"), extension: ".png" };

  if (url) {
    const imageResponse = await fetch(url);
    if (!imageResponse.ok) throw new Error("Failed to download the generated product try-on image.");
    return { buffer: Buffer.from(await imageResponse.arrayBuffer()), extension: ".png" };
  }

  throw new Error("The AI product try-on API did not return an image.");
}

async function fileFromPath(filePath: string, fileName: string) {
  const buffer = await readFile(filePath);
  const pngBuffer = await sharp(buffer).png().toBuffer();
  return new File([new Uint8Array(pngBuffer)], fileName, { type: "image/png" });
}

function parseJsonResponse(text: string) {
  try {
    return JSON.parse(text || "{}");
  } catch {
    return {};
  }
}

async function createLocalProductTryOnPreview(personImagePath: string, garmentImagePath: string, size = "1024x1536"): Promise<ProductTryOnImage> {
  const [width, height] = parseImageSize(size);
  const person = await imageDataUri(personImagePath);
  const garment = await imageDataUri(garmentImagePath);
  const now = new Date().toLocaleString("en-US", { hour12: false });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f8fafc"/><stop offset="1" stop-color="#fee2e2"/></linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="18" stdDeviation="20" flood-color="#0f172a" flood-opacity="0.18"/></filter>
  </defs>
  <rect width="100%" height="100%" rx="32" fill="url(#bg)"/>
  <text x="${width / 2}" y="64" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" font-weight="700" fill="#111827">Product Link Try-On Preview</text>
  <text x="${width / 2}" y="104" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#64748b">Local preview mode · configure OPENAI_API_KEY for real AI generation</text>
  <rect x="${width * 0.08}" y="${height * 0.14}" width="${width * 0.84}" height="${height * 0.68}" rx="30" fill="#ffffff" filter="url(#shadow)"/>
  <image href="${person}" x="${width * 0.12}" y="${height * 0.18}" width="${width * 0.5}" height="${height * 0.56}" preserveAspectRatio="xMidYMid meet"/>
  <rect x="${width * 0.58}" y="${height * 0.48}" width="${width * 0.24}" height="${height * 0.24}" rx="24" fill="#ffffff" stroke="#fecaca" stroke-width="4" filter="url(#shadow)"/>
  <image href="${garment}" x="${width * 0.6}" y="${height * 0.5}" width="${width * 0.2}" height="${height * 0.2}" preserveAspectRatio="xMidYMid meet"/>
  <text x="${width * 0.7}" y="${height * 0.78}" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#475569">Extract garment from product image</text>
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
  return [Number.isFinite(rawWidth) ? rawWidth : 1024, Number.isFinite(rawHeight) ? rawHeight : 1536] as const;
}

function escapeXml(value: string) {
  return value.replace(/[<>&"']/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[char] || char);
}
