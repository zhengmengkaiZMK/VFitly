import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { getBlogAdmin } from "@/lib/blog-admin";
import { saveBufferAsset } from "@/lib/storage/assets";

export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const allowedOrigins = [request.nextUrl.origin];
  for (const siteUrl of [process.env.NEXTAUTH_URL, process.env.NEXT_PUBLIC_APP_URL, process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined]) {
    if (siteUrl) {
      try { allowedOrigins.push(new URL(siteUrl).origin); } catch { /* Invalid configuration is not trusted. */ }
    }
  }
  if (!origin || !allowedOrigins.includes(origin)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const admin = await getBlogAdmin();
  if (!admin) return NextResponse.json({ error: "Administrator access required" }, { status: 403 });
  if (Number(request.headers.get("content-length")) > 6 * 1024 * 1024) return NextResponse.json({ error: "Maximum file size: 5 MB" }, { status: 413 });
  try {
    const form = await request.formData(); const file = form.get("file");
    if (!(file instanceof File) || file.size > 5 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) return NextResponse.json({ error: "Upload a JPG, PNG or WebP under 5 MB" }, { status: 400 });
    const buffer = await sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 25000000 }).rotate().resize({ width: 2400, withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
    const asset = await saveBufferAsset(buffer, `blog/${admin.id}`, "webp", "image/webp");
    return NextResponse.json({ url: asset.url });
  } catch { return NextResponse.json({ error: "Image upload failed. Check the image and storage configuration." }, { status: 400 }); }
}
