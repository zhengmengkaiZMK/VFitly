import { NextRequest, NextResponse } from "next/server";
import { getPublicBaseUrl, keyFromAssetUrl, readAsset } from "@/lib/storage/assets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_DOWNLOAD_BYTES = 25 * 1024 * 1024;

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get("url");
  if (!rawUrl) {
    return NextResponse.json({ error: "Missing download URL." }, { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = rawUrl.startsWith("/") ? new URL(rawUrl, request.nextUrl.origin) : new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: "Invalid download URL." }, { status: 400 });
  }

  if (!isAllowedDownloadUrl(parsedUrl, request)) {
    return NextResponse.json({ error: "This file cannot be downloaded." }, { status: 400 });
  }

  try {
    const assetKey = keyFromAssetUrl(parsedUrl.toString()) || keyFromAssetUrl(parsedUrl.pathname);
    const buffer = assetKey ? await readAsset(assetKey) : await fetchRemoteAsset(parsedUrl);
    const filename = filenameFromPath(parsedUrl.pathname);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": contentTypeFromFilename(filename),
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Unable to download this image." }, { status: 404 });
  }
}

function isAllowedDownloadUrl(url: URL, request: NextRequest) {
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;

  const allowedHosts = new Set([request.nextUrl.host, "assets.vfitly.com"]);
  const publicBase = getPublicBaseUrl();
  if (publicBase.startsWith("http")) {
    try {
      allowedHosts.add(new URL(publicBase).host);
    } catch {
      // Ignore invalid public asset base URLs.
    }
  }

  return allowedHosts.has(url.host);
}

async function fetchRemoteAsset(url: URL) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("Asset not found.");

  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length > MAX_DOWNLOAD_BYTES) {
    throw new Error("Asset is too large.");
  }

  return buffer;
}

function filenameFromPath(pathname: string) {
  const name = decodeURIComponent(pathname.split("/").filter(Boolean).pop() || "vfitly-image.png");
  return name.includes(".") ? name.replace(/[^\w.-]/g, "_") : `${name.replace(/[^\w.-]/g, "_")}.png`;
}

function contentTypeFromFilename(filename: string) {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".svg")) return "image/svg+xml";
  if (lower.endsWith(".mp4")) return "video/mp4";
  if (lower.endsWith(".webm")) return "video/webm";
  return "image/png";
}
