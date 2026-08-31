import path from "path";
import { saveBufferAsset, saveFileAsset } from "@/lib/storage/assets";

const MAX_UPLOAD_SIZE = 12 * 1024 * 1024;
const MAX_REMOTE_IMAGE_SIZE = 16 * 1024 * 1024;

export async function saveProductTryOnUpload(file: File, folder: string) {
  if (!file || file.size === 0) throw new Error("Please upload an image.");
  if (file.size > MAX_UPLOAD_SIZE) throw new Error("Images must be under 12MB.");
  if (!file.type.startsWith("image/")) throw new Error("Only image files are supported.");

  return saveFileAsset(file, folder);
}

export async function saveProductTryOnRemoteImage(imageUrl: string, folder: string) {
  const response = await fetch(imageUrl, {
    headers: {
      Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
    },
  });

  if (!response.ok) throw new Error(`Failed to download product image (${response.status}).`);

  const contentType = response.headers.get("content-type") || "";
  if (contentType && !contentType.startsWith("image/")) throw new Error("The selected product image is not a valid image file.");

  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.byteLength > MAX_REMOTE_IMAGE_SIZE) throw new Error("Product image is too large.");

  const ext = mimeToExt(contentType) || path.extname(new URL(imageUrl).pathname) || ".jpg";
  return saveProductTryOnBuffer(buffer, folder, ext, contentType || "image/jpeg");
}

export async function saveProductTryOnGeneratedImage(buffer: Buffer, folder: string, extension = ".png") {
  return saveProductTryOnBuffer(buffer, folder, extension, "image/png");
}

async function saveProductTryOnBuffer(buffer: Buffer, folder: string, extension: string, mimeType: string) {
  return saveBufferAsset(buffer, folder, extension, mimeType);
}

function mimeToExt(type: string) {
  const cleanType = type.split(";")[0].trim().toLowerCase();
  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/avif": ".avif",
    "image/svg+xml": ".svg",
  };

  return map[cleanType];
}
