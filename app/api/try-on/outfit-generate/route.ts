import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/db/prisma";
import { localPathFromAssetUrl } from "@/lib/storage/assets";
import { generateTryOnImage } from "@/lib/wardrobe/openai-image";
import { saveGeneratedImage, saveUpload } from "@/lib/wardrobe/storage";
import { defaultTryOnPrompt } from "@/lib/wardrobe/constants";
import { TRY_ON_MULTI_COST, ensureSufficientCredits, isPaidPlan, spendCredits } from "@/lib/billing/credits";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let jobId: string | null = null;

  try {
    const user = await requireUser();

    if (!isPaidPlan(user.membershipType)) {
      return NextResponse.json(
        { error: "Outfit generation is available on Plus and Ultra plans." },
        { status: 403 },
      );
    }

    const contentType = request.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const body = isJson ? await request.json().catch(() => ({})) : null;
    const formData = isJson ? null : await request.formData();
    const wardrobeItemIds = isJson ? parseIdsFromUnknown(body?.wardrobeItemIds) : parseIds(formData?.get("wardrobeItemIds") || null);
    const personImage = formData?.get("personImage") || null;
    const personImageUrl = isJson && typeof body?.personImageUrl === "string" ? body.personImageUrl : "";
    const prompt = String((isJson ? body?.stylePrompt || body?.prompt : formData?.get("prompt")) || defaultTryOnPrompt);
    const size = String((isJson ? body?.size : formData?.get("size")) || "1024x1536");

    if (wardrobeItemIds.length < 2) {
      return NextResponse.json({ error: "Please select at least 2 wardrobe items for an outfit." }, { status: 400 });
    }

    if (wardrobeItemIds.length > 4) {
      return NextResponse.json({ error: "Please select no more than 4 wardrobe items for one outfit." }, { status: 400 });
    }

    let personUrl = personImageUrl || user.defaultModelImageUrl || "";
    let personPath = personUrl ? await localPathFromAssetUrl(personUrl) : "";
    let personAssetKey = user.defaultModelAssetKey;

    if (personImage instanceof File) {
      const person = await saveUpload(personImage, `try-on/${user.id}/persons`);
      personUrl = person.url;
      personPath = person.path;
      personAssetKey = person.key;

      if (!user.defaultModelImageUrl) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            defaultModelImageUrl: person.url,
            defaultModelAssetKey: person.key,
            onboardingCompleted: true,
            imageStorageUsedBytes: { increment: BigInt(person.size) },
          },
        });
      }
    }

    if (!personUrl || !personPath) {
      return NextResponse.json(
        { error: "Please upload a full-body photo before generating outfit images.", requiresDefaultModelPhoto: true },
        { status: 428 },
      );
    }

    const items = await prisma.wardrobeItem.findMany({
      where: { id: { in: wardrobeItemIds }, userId: user.id, isDeleted: false },
      orderBy: { createdAt: "desc" },
    });

    if (items.length !== wardrobeItemIds.length) {
      return NextResponse.json({ error: "One or more selected wardrobe items do not exist." }, { status: 404 });
    }

    const categories = items.map((item) => item.category);
    if (new Set(categories).size !== categories.length) {
      return NextResponse.json({ error: "Please select only one item from each wardrobe category." }, { status: 400 });
    }

    await ensureSufficientCredits(user.id, user.membershipType, TRY_ON_MULTI_COST);

    const garmentPaths = await Promise.all(items.map((item) => localPathFromAssetUrl(item.imageUrl)));
    const job = await prisma.tryOnJob.create({
      data: {
        userId: user.id,
        wardrobeItemId: items[0]?.id,
        provider: "openai",
        model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-2",
        jobType: "OUTFIT_IMAGE",
        personImageUrl: personUrl,
        personAssetKey,
        garmentImageUrl: items[0].imageUrl,
        garmentImageUrls: items.map((item) => item.imageUrl),
        garmentAssetKey: items[0].imageAssetKey || items[0].storageKey,
        wardrobeItemIds,
        prompt,
        creditsCost: TRY_ON_MULTI_COST,
        costCredits: TRY_ON_MULTI_COST,
        metadata: { garmentCount: items.length, source: "outfit-generate" },
        status: "PENDING",
      },
    });
    jobId = job.id;

    await prisma.tryOnJob.update({
      where: { id: job.id },
      data: { status: "PROCESSING" },
    });

    const generated = await generateTryOnImage({
      personImagePath: personPath,
      garmentImagePath: garmentPaths[0],
      garmentImagePaths: garmentPaths,
      prompt: `${prompt}\n\nCombine these ${items.length} wardrobe items into one coherent outfit. Preserve the person's identity and make all selected garments appear naturally together.`,
      size,
    });

    const savedResult = await saveGeneratedImage(generated.buffer, `try-on/${user.id}/results`, generated.extension);
    const updatedJob = await prisma.tryOnJob.update({
      where: { id: job.id },
      data: {
        resultImageUrl: savedResult.url,
        resultAssetKey: savedResult.key,
        status: "COMPLETED",
        completedAt: new Date(),
      },
      include: { wardrobeItem: true },
    });

    await spendCredits(user.id, user.membershipType, TRY_ON_MULTI_COST, "Outfit try-on generation", {
      jobId: job.id,
      wardrobeItemIds,
    });

    await prisma.usageRecord.create({
      data: {
        userId: user.id,
        type: "try-on",
        cost: TRY_ON_MULTI_COST,
        metadata: { jobId: job.id, garmentCount: items.length, source: "outfit-generate" },
      },
    });

    return NextResponse.json({ job: updatedJob });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate outfit image.";

    if (jobId) {
      await prisma.tryOnJob.update({ where: { id: jobId }, data: { status: "FAILED", error: message } }).catch(() => undefined);
    }

    const status = error instanceof Error && error.name === "UnauthorizedError"
      ? 401
      : message.includes("Insufficient credits")
        ? 403
        : 400;

    return NextResponse.json(
      { error: message },
      { status },
    );
  }
}

function parseIdsFromUnknown(value: unknown) {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string" && item.length > 0);
  if (typeof value === "string") return parseIds(value);
  return [];
}

function parseIds(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string" && item.length > 0) : [];
  } catch {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
}
