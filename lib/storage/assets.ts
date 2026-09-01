import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import os from "os";
import path from "path";
import { randomUUID } from "crypto";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const DEFAULT_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const DEFAULT_PUBLIC_BASE_URL = "/api/assets";
const R2_ENDPOINT_SUFFIX = ".r2.cloudflarestorage.com";

export type StoredAsset = {
  key: string;
  url: string;
  path: string;
  size: number;
  mimeType: string;
};

type StorageProvider = "local" | "r2";

let r2Client: S3Client | null = null;

export function getStorageProvider(): StorageProvider {
  return process.env.STORAGE_PROVIDER === "r2" ? "r2" : "local";
}

export function getUploadRoot() {
  return process.env.LOCAL_UPLOAD_DIR || process.env.ASSET_STORAGE_ROOT || DEFAULT_UPLOAD_DIR;
}

export function getPublicBaseUrl() {
  if (getStorageProvider() === "r2") {
    return getR2PublicBaseUrl();
  }

  return (process.env.LOCAL_UPLOAD_PUBLIC_BASE_URL || process.env.ASSET_PUBLIC_BASE_URL || DEFAULT_PUBLIC_BASE_URL).replace(/\/$/, "");
}

export function buildAssetUrl(key: string) {
  return `${getPublicBaseUrl()}/${key.split("/").map(encodeURIComponent).join("/")}`;
}

export function getAssetPath(key: string) {
  const normalizedKey = normalizeKey(key);
  return path.join(getUploadRoot(), normalizedKey);
}

export async function saveFileAsset(file: File, prefix: string): Promise<StoredAsset> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = extensionFromName(file.name, file.type);
  return saveBufferAsset(buffer, prefix, extension, file.type || "application/octet-stream");
}

export async function saveBufferAsset(buffer: Buffer, prefix: string, extension = "png", mimeType = "image/png"): Promise<StoredAsset> {
  const safePrefix = normalizeKey(prefix);
  const key = `${safePrefix}/${Date.now()}-${randomUUID()}.${extension.replace(/^\./, "")}`;
  const filePath = getAssetPath(key);

  if (getStorageProvider() === "r2") {
    await putR2Object(key, buffer, mimeType);
    await writeTempAsset(filePath, buffer);
  } else {
    await writeTempAsset(filePath, buffer);
  }

  return {
    key,
    url: buildAssetUrl(key),
    path: filePath,
    size: buffer.length,
    mimeType,
  };
}

export async function readAsset(key: string) {
  if (getStorageProvider() === "r2") {
    return getR2ObjectBuffer(key);
  }

  return readFile(getAssetPath(key));
}

export async function deleteAsset(key: string | null | undefined) {
  if (!key) return;

  if (getStorageProvider() === "r2") {
    await deleteR2Object(key);
    return;
  }

  try {
    await unlink(getAssetPath(key));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}

export function keyFromAssetUrl(url: string | null | undefined) {
  if (!url) return null;
  const base = getPublicBaseUrl();
  const pathPart = url.startsWith("http") ? new URL(url).pathname : url;
  const basePath = base.startsWith("http") ? new URL(base).pathname : base;

  if (!pathPart.startsWith(`${basePath}/`)) return null;
  return decodeURIComponent(pathPart.slice(basePath.length + 1));
}

export function pathFromAssetUrl(url: string) {
  const key = keyFromAssetUrl(url);
  if (key) return getAssetPath(key);

  const cleanUrl = url.split("?")[0];
  return path.join(process.cwd(), "public", cleanUrl.startsWith("/") ? cleanUrl.slice(1) : cleanUrl);
}

export function shouldCleanupLocalAssetPath(filePath: string | null | undefined) {
  if (!filePath) return false;

  const resolvedPath = path.resolve(filePath);
  const tempAssetRoot = path.join(os.tmpdir(), "vfitly-assets");
  if (resolvedPath.startsWith(`${path.resolve(tempAssetRoot)}${path.sep}`)) return true;

  return getStorageProvider() === "r2" && resolvedPath.startsWith(`${path.resolve(getUploadRoot())}${path.sep}`);
}

export async function deleteLocalAssetFile(filePath: string | null | undefined) {
  if (!filePath || !shouldCleanupLocalAssetPath(filePath)) return;

  try {
    await unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}

export async function localPathFromAssetUrl(url: string) {
  const key = keyFromAssetUrl(url);
  if (key && getStorageProvider() === "r2") {
    const buffer = await readAsset(key);
    const filePath = path.join(os.tmpdir(), "vfitly-assets", key);
    await writeTempAsset(filePath, buffer);
    return filePath;
  }

  if (isHttpUrl(url)) {
    return downloadHttpAssetToTempFile(url);
  }

  return pathFromAssetUrl(url);
}

async function downloadHttpAssetToTempFile(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download remote asset (${response.status}).`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const parsedUrl = new URL(url);
  const extension = path.extname(parsedUrl.pathname) || ".png";
  const filePath = path.join(os.tmpdir(), "vfitly-assets", "remote", `${randomUUID()}${extension}`);
  await writeTempAsset(filePath, buffer);
  return filePath;
}

function isHttpUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

async function writeTempAsset(filePath: string, buffer: Buffer) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, buffer);
}

function getR2Client() {
  if (r2Client) return r2Client;

  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("Cloudflare R2 is enabled, but R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, or R2_SECRET_ACCESS_KEY is missing.");
  }

  r2Client = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT || `https://${accountId}${R2_ENDPOINT_SUFFIX}`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return r2Client;
}

function getR2BucketName() {
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) throw new Error("Cloudflare R2 is enabled, but R2_BUCKET_NAME is missing.");
  return bucket;
}

function getR2PublicBaseUrl() {
  const baseUrl = process.env.R2_PUBLIC_BASE_URL;
  if (!baseUrl) throw new Error("Cloudflare R2 is enabled, but R2_PUBLIC_BASE_URL is missing.");
  return baseUrl.replace(/\/$/, "");
}

async function putR2Object(key: string, buffer: Buffer, mimeType: string) {
  await getR2Client().send(new PutObjectCommand({
    Bucket: getR2BucketName(),
    Key: key,
    Body: buffer,
    ContentType: mimeType,
    CacheControl: "public, max-age=31536000, immutable",
  }));
}

async function getR2ObjectBuffer(key: string) {
  const response = await getR2Client().send(new GetObjectCommand({
    Bucket: getR2BucketName(),
    Key: normalizeKey(key),
  }));

  if (!response.Body) throw new Error("Asset not found.");
  const bytes = await response.Body.transformToByteArray();
  return Buffer.from(bytes);
}

async function deleteR2Object(key: string) {
  await getR2Client().send(new DeleteObjectCommand({
    Bucket: getR2BucketName(),
    Key: normalizeKey(key),
  }));
}

function normalizeKey(value: string) {
  return value
    .split("/")
    .filter(Boolean)
    .map((part) => part.replace(/[^a-zA-Z0-9._-]/g, "-"))
    .join("/");
}

function extensionFromName(name: string, mimeType: string) {
  const ext = path.extname(name).replace(/^\./, "").toLowerCase();
  if (ext) return ext;
  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/webp") return "webp";
  return "png";
}
