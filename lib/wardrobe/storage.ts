import { saveBufferAsset, saveFileAsset } from "@/lib/storage/assets";

const MAX_UPLOAD_SIZE = 12 * 1024 * 1024;

export async function saveUpload(file: File, folder: string) {
  if (!file || file.size === 0) {
    throw new Error("Please upload an image.");
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    throw new Error("Images must be under 12MB.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are supported.");
  }

  return saveFileAsset(file, folder);
}

export async function saveGeneratedImage(buffer: Buffer, folder: string, extension = ".png") {
  return saveBufferAsset(buffer, folder, extension, "image/png");
}
