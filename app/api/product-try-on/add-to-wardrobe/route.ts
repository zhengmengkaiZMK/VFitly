import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/db/prisma";
import { FREE_WARDROBE_LIMIT, isPaidPlan } from "@/lib/billing/credits";
import { saveProductTryOnRemoteImage } from "@/lib/product-try-on/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ProductWardrobeInput = {
  imageUrl?: string;
  name?: string;
  category?: string;
  color?: string;
  label?: string;
  tags?: string[];
};

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();

    const body = await request.json();
    const productUrl = typeof body.productUrl === "string" ? body.productUrl : null;
    const items = parseItems(body.items || body.garments || body.images);

    if (items.length === 0) {
      return NextResponse.json({ error: "Please provide at least one product image to save." }, { status: 400 });
    }

    const imageUrls = [...new Set(items.map((item) => item.imageUrl).filter((url): url is string => Boolean(url)))];
    const existingItems = imageUrls.length
      ? await prisma.wardrobeItem.findMany({
          where: {
            userId: user.id,
            isDeleted: false,
            sourceImageUrl: { in: imageUrls },
          },
          select: { sourceImageUrl: true },
        })
      : [];
    const existingSourceUrls = new Set(existingItems.map((item) => item.sourceImageUrl).filter((url): url is string => Boolean(url)));
    const newItemCount = items.filter((item) => item.imageUrl && !existingSourceUrls.has(item.imageUrl)).length;
    const existingCount = await prisma.wardrobeItem.count({ where: { userId: user.id, isDeleted: false } });
    if (!isPaidPlan(user.membershipType) && existingCount + newItemCount > FREE_WARDROBE_LIMIT) {
      return NextResponse.json(
        { error: `Free plan wardrobe limit reached. You can save up to ${FREE_WARDROBE_LIMIT} items.` },
        { status: 403 },
      );
    }

    const results = [];

    for (const item of items) {
      try {
        if (!item.imageUrl) throw new Error("Missing product image URL.");

        const existing = await prisma.wardrobeItem.findFirst({
          where: {
            userId: user.id,
            isDeleted: false,
            sourceImageUrl: item.imageUrl,
          },
        });

        if (existing) {
          results.push({ imageUrl: item.imageUrl, status: "skipped", reason: "Already saved", item: existing });
          continue;
        }

        const saved = await saveProductTryOnRemoteImage(item.imageUrl, `wardrobe/${user.id}/product-url`);
        const wardrobeItem = await prisma.wardrobeItem.create({
          data: {
            userId: user.id,
            name: item.name || item.label || "Product garment",
            category: item.category || "Other",
            color: item.color || null,
            tags: Array.isArray(item.tags) ? item.tags : [],
            imageUrl: saved.url,
            imageAssetKey: saved.key,
            sourceImageUrl: item.imageUrl,
            sourceType: "product_url",
            sourceProductUrl: productUrl,
            storageKey: saved.key,
            fileSize: saved.size,
            mimeType: saved.mimeType,
          },
        });

        await prisma.user.update({
          where: { id: user.id },
          data: { imageStorageUsedBytes: { increment: BigInt(saved.size) } },
        });

        results.push({ imageUrl: item.imageUrl, status: "saved", item: wardrobeItem });
      } catch (error) {
        results.push({
          imageUrl: item.imageUrl || "",
          status: "failed",
          error: error instanceof Error ? error.message : "Failed to save product image.",
        });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save product images to wardrobe." },
      { status: error instanceof Error && error.name === "UnauthorizedError" ? 401 : 400 },
    );
  }
}

function parseItems(value: unknown): ProductWardrobeInput[] {
  const rawItems = typeof value === "string" ? safeJsonParse(value) : value;
  if (!Array.isArray(rawItems)) return [];

  return rawItems
    .map((item) => {
      if (typeof item === "string") return { imageUrl: item };
      if (!item || typeof item !== "object") return {};
      const record = item as Record<string, unknown>;
      return {
        imageUrl: typeof record.imageUrl === "string" ? record.imageUrl : typeof record.url === "string" ? record.url : undefined,
        name: typeof record.name === "string" ? record.name : undefined,
        category: typeof record.category === "string" ? record.category : undefined,
        color: typeof record.color === "string" ? record.color : undefined,
        label: typeof record.label === "string" ? record.label : undefined,
        tags: Array.isArray(record.tags) ? record.tags.filter((tag): tag is string => typeof tag === "string") : undefined,
      };
    })
    .filter((item) => item.imageUrl);
}

function safeJsonParse(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}
