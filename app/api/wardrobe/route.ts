import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/current-user";
import { saveUpload } from "@/lib/wardrobe/storage";
import { FREE_WARDROBE_LIMIT, isPaidPlan } from "@/lib/billing/credits";

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const q = searchParams.get("q")?.trim();
    const page = Math.max(Number(searchParams.get("page") || 1), 1);
    const pageSize = Math.min(Math.max(Number(searchParams.get("pageSize") || 24), 1), 60);

    const where = {
      userId: user.id,
      isDeleted: false,
      ...(category && category !== "All" ? { category } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" as const } },
              { category: { contains: q, mode: "insensitive" as const } },
              { color: { contains: q, mode: "insensitive" as const } },
              { secondaryColor: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.wardrobeItem.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.wardrobeItem.count({ where }),
    ]);

    return NextResponse.json({
      items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
      limits: {
        limit: isPaidPlan(user.membershipType) ? null : FREE_WARDROBE_LIMIT,
        used: total,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unauthorized. Please sign in to manage your wardrobe." },
      { status: 401 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const existingCount = await prisma.wardrobeItem.count({ where: { userId: user.id, isDeleted: false } });

    if (!isPaidPlan(user.membershipType) && existingCount >= FREE_WARDROBE_LIMIT) {
      return NextResponse.json(
        { error: `Free plan wardrobe limit reached. You can save up to ${FREE_WARDROBE_LIMIT} items.` },
        { status: 403 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Please upload a garment image." }, { status: 400 });
    }

    const saved = await saveUpload(file, `wardrobe/${user.id}`);
    const item = await prisma.wardrobeItem.create({
      data: {
        userId: user.id,
        name: String(formData.get("name") || file.name || "Untitled garment"),
        category: String(formData.get("category") || "OTHER"),
        color: nullableString(formData.get("color")),
        secondaryColor: nullableString(formData.get("secondaryColor")),
        tags: parseTags(formData.get("tags")),
        imageUrl: saved.url,
        imageAssetKey: saved.key,
        sourceImageUrl: saved.url,
        sourceType: "upload",
        storageKey: saved.key,
        fileSize: saved.size,
        mimeType: saved.mimeType,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { imageStorageUsedBytes: { increment: BigInt(saved.size) } },
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "衣物上传失败" },
      { status: error instanceof Error && error.name === "UnauthorizedError" ? 401 : 400 },
    );
  }
}

function nullableString(value: FormDataEntryValue | null) {
  const text = value ? String(value).trim() : "";
  return text || null;
}

function parseTags(value: FormDataEntryValue | null) {
  if (!value) return [];

  return String(value)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}
