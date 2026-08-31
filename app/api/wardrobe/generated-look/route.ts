import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/current-user";
import { FREE_WARDROBE_LIMIT, isPaidPlan } from "@/lib/billing/credits";
import { prisma } from "@/lib/db/prisma";

const GENERATED_LOOKS_CATEGORY = "Generated Looks";

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const body = await request.json().catch(() => ({}));
    const imageUrl = typeof body.imageUrl === "string" ? body.imageUrl.trim() : "";
    const jobId = typeof body.jobId === "string" ? body.jobId : null;
    const name = typeof body.name === "string" && body.name.trim() ? body.name.trim() : "AI try-on result";

    if (!imageUrl) {
      return NextResponse.json({ error: "Please provide a generated try-on image." }, { status: 400 });
    }

    const existingItem = await prisma.wardrobeItem.findFirst({
      where: {
        userId: user.id,
        isDeleted: false,
        sourceImageUrl: imageUrl,
        sourceType: "generated_try_on",
      },
    });

    if (existingItem) {
      return NextResponse.json({ item: existingItem, duplicated: true });
    }

    const existingCount = await prisma.wardrobeItem.count({ where: { userId: user.id, isDeleted: false } });
    if (!isPaidPlan(user.membershipType) && existingCount >= FREE_WARDROBE_LIMIT) {
      return NextResponse.json(
        { error: `Free plan wardrobe limit reached. You can save up to ${FREE_WARDROBE_LIMIT} items.` },
        { status: 403 },
      );
    }

    const job = jobId
      ? await prisma.tryOnJob.findFirst({
          where: {
            id: jobId,
            userId: user.id,
            resultImageUrl: imageUrl,
          },
          select: { resultAssetKey: true, jobType: true },
        })
      : null;

    const item = await prisma.wardrobeItem.create({
      data: {
        userId: user.id,
        name,
        category: GENERATED_LOOKS_CATEGORY,
        tags: ["generated", "try-on", job?.jobType || "try-on-result"],
        imageUrl,
        imageAssetKey: job?.resultAssetKey || null,
        sourceImageUrl: imageUrl,
        sourceType: "generated_try_on",
        storageKey: job?.resultAssetKey || null,
      },
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save generated try-on image." },
      { status: error instanceof Error && error.message.includes("Unauthorized") ? 401 : 400 },
    );
  }
}
