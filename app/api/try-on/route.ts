import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/db/prisma";
import { requireUserOrGuest, guestAssetPrefix } from "@/lib/auth/guest-session";
import { countGuestTryOnUsageToday } from "@/lib/auth/guest-resources";
import { generateTryOnImage } from "@/lib/wardrobe/openai-image";
import { saveGeneratedImage, saveUpload } from "@/lib/wardrobe/storage";
import { defaultTryOnPrompt } from "@/lib/wardrobe/constants";
import { localPathFromAssetUrl, deleteLocalAssetFile } from "@/lib/storage/assets";
import {
  FREE_DAILY_TRY_ON_LIMIT,
  TRY_ON_MULTI_COST,
  TRY_ON_SINGLE_COST,
  countUsageToday,
  ensureSufficientCredits,
  isPaidPlan,
  spendCredits,
} from "@/lib/billing/credits";

export async function GET() {
  try {
    const { user, guest } = await requireUserOrGuest();

    if (!user) {
      const jobs = guest
        ? await prisma.tryOnJob.findMany({
            where: {
              guestId: guest.guestId,
              isTemporary: true,
              OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
            },
            include: { wardrobeItem: true },
            orderBy: { createdAt: "desc" },
            take: 20,
          })
        : [];

      return NextResponse.json({ jobs, guest });
    }

    const [jobs, creditAccount] = await Promise.all([
      prisma.tryOnJob.findMany({
        where: { userId: user.id },
        include: { wardrobeItem: true },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.creditAccount.findUnique({ where: { userId: user.id } }),
    ]);

    return NextResponse.json({
      jobs,
      user: {
        defaultModelImageUrl: user.defaultModelImageUrl,
        membershipType: user.membershipType,
        creditsBalance: creditAccount?.balance ?? 0,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unauthorized. Please sign in to generate try-on images." },
      { status: 401 },
    );
  }
}

export async function POST(request: NextRequest) {
  let jobId: string | null = null;
  const localAssetPaths = new Set<string>();

  try {
    const { user, guest } = await requireUserOrGuest();
    const formData = await request.formData();
    const personImage = formData.get("personImage");
    const prompt = String(formData.get("prompt") || defaultTryOnPrompt);
    const size = String(formData.get("size") || "1024x1536");
    const wardrobeItemId = String(formData.get("wardrobeItemId") || "");
    const wardrobeItemIds = parseIds(formData.get("wardrobeItemIds"));
    const garmentUpload = formData.get("garmentImage");
    const selectedIds = wardrobeItemIds.length > 0 ? wardrobeItemIds : wardrobeItemId ? [wardrobeItemId] : [];

    if (!user && selectedIds.length > 0) {
      return NextResponse.json({ error: "Guest mode only supports uploaded clothing images." }, { status: 400 });
    }

    const paidPlan = user ? isPaidPlan(user.membershipType) : false;
    const creditsCost = selectedIds.length > 1 ? TRY_ON_MULTI_COST : TRY_ON_SINGLE_COST;

    if (user && !paidPlan) {
      const usedToday = await countUsageToday(user.id, "try-on");
      if (usedToday >= FREE_DAILY_TRY_ON_LIMIT) {
        return NextResponse.json({ error: "Free plan includes 2 try-on generations per day. Please upgrade to continue." }, { status: 403 });
      }
    }

    if (!user && guest) {
      const usedToday = await countGuestTryOnUsageToday(guest.guestId);
      if (usedToday >= FREE_DAILY_TRY_ON_LIMIT) {
        return NextResponse.json({ error: "Guest mode includes 2 free try-on generations per day. Please sign in or upgrade to continue." }, { status: 403 });
      }
    }

    let personUrl = user?.defaultModelImageUrl || "";
    let personPath = personUrl ? await localPathFromAssetUrl(personUrl) : "";
    if (personPath) localAssetPaths.add(personPath);
    let personAssetKey = user?.defaultModelAssetKey || null;

    const personPrefix = user ? `try-on/${user.id}/persons` : guest ? `${guestAssetPrefix(guest.guestId)}/persons` : "try-on/anonymous/persons";
    const garmentPrefix = user ? `try-on/${user.id}/garments` : guest ? `${guestAssetPrefix(guest.guestId)}/garments` : "try-on/anonymous/garments";
    const resultPrefix = user ? `try-on/${user.id}/results` : guest ? `${guestAssetPrefix(guest.guestId)}/results` : "try-on/anonymous/results";

    if (personImage instanceof File) {
      const person = await saveUpload(personImage, personPrefix);
      personUrl = person.url;
      personPath = person.path;
      localAssetPaths.add(personPath);
      personAssetKey = person.key;

      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            defaultModelImageUrl: person.url,
            defaultModelAssetKey: person.key,
            onboardingCompleted: true,
          },
        });
      }
    }

    if (!personUrl || !personPath) {
      return NextResponse.json(
        {
          error: "Please upload a full-body photo before generating try-on images.",
          requiresDefaultModelPhoto: true,
        },
        { status: 428 },
      );
    }

    const garments: Array<{ id: string | null; url: string; path: string; assetKey?: string | null }> = [];

    if (selectedIds.length > 0) {
      if (!user) {
        return NextResponse.json({ error: "Guest mode only supports uploaded clothing images." }, { status: 400 });
      }

      const items = await prisma.wardrobeItem.findMany({ where: { id: { in: selectedIds }, userId: user.id, isDeleted: false } });
      if (items.length !== selectedIds.length) {
        return NextResponse.json({ error: "One or more selected wardrobe items do not exist." }, { status: 404 });
      }
      const garmentItems = await Promise.all(items.map(async (item) => {
        const assetPath = await localPathFromAssetUrl(item.imageUrl);
        localAssetPaths.add(assetPath);
        return { id: item.id, url: item.imageUrl, path: assetPath, assetKey: item.imageAssetKey || item.storageKey };
      }));
      garments.push(...garmentItems);
    } else if (garmentUpload instanceof File) {
      const garment = await saveUpload(garmentUpload, garmentPrefix);
      localAssetPaths.add(garment.path);
      garments.push({ id: null, url: garment.url, path: garment.path, assetKey: garment.key });
    } else {
      return NextResponse.json({ error: "Please select or upload at least one clothing image." }, { status: 400 });
    }

    if (user && paidPlan) {
      await ensureSufficientCredits(user.id, user.membershipType, creditsCost);
    }

    const dbJob = await prisma.tryOnJob.create({
      data: {
        userId: user?.id ?? null,
        guestId: guest?.guestId ?? null,
        wardrobeItemId: garments[0]?.id,
        provider: "openai",
        model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-2",
        jobType: garments.length > 1 ? "OUTFIT_IMAGE" : "SINGLE_GARMENT_IMAGE",
        personImageUrl: personUrl,
        personAssetKey,
        garmentImageUrl: garments[0].url,
        garmentImageUrls: garments.map((item) => item.url),
        garmentAssetKey: garments[0]?.assetKey,
        wardrobeItemIds: garments.map((item) => item.id).filter(Boolean),
        prompt,
        creditsCost: user && paidPlan ? creditsCost : 0,
        costCredits: user && paidPlan ? creditsCost : 0,
        metadata: { garmentCount: garments.length, source: selectedIds.length ? "wardrobe" : "upload", mode: user ? "member" : "guest" },
        status: "PENDING",
        isTemporary: !user,
        expiresAt: !user && guest ? guest.expiresAt : null,
      },
    });
    jobId = dbJob.id;

    await prisma.tryOnJob.update({
      where: { id: dbJob.id },
      data: { status: "PROCESSING" },
    });

    const generatedImage = await generateTryOnImage({
      personImagePath: personPath,
      garmentImagePath: garments[0].path,
      garmentImagePaths: garments.map((item) => item.path),
      prompt: garments.length > 1 ? `${prompt}\n\nCombine all selected wardrobe pieces into one coherent outfit. Selected item image URLs: ${garments.map((item) => item.url).join(", ")}` : prompt,
      size,
    });
    const result = await saveGeneratedImage(generatedImage.buffer, resultPrefix, generatedImage.extension);
    localAssetPaths.add(result.path);

    const updatedJob = await prisma.tryOnJob.update({
      where: { id: dbJob.id },
      data: {
        resultImageUrl: result.url,
        resultAssetKey: result.key,
        status: "COMPLETED",
        completedAt: new Date(),
      },
      include: { wardrobeItem: true },
    });

    if (user && paidPlan) {
      await spendCredits(user.id, user.membershipType, creditsCost, "AI try-on generation", {
        jobId: dbJob.id,
        garmentCount: garments.length,
      });
    }

    if (user) {
      await prisma.usageRecord.create({
        data: {
          userId: user.id,
          type: "try-on",
          cost: paidPlan ? creditsCost : 0,
          metadata: { jobId: dbJob.id, garmentCount: garments.length, freeDailyUsage: !paidPlan },
        },
      });
    }

    return NextResponse.json({ job: updatedJob });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI try-on generation failed.";

    if (jobId && !jobId.startsWith("local-")) {
      await prisma.tryOnJob.update({ where: { id: jobId }, data: { status: "FAILED", error: message } }).catch(() => undefined);
    }

    const status = error instanceof Error && error.name === "UnauthorizedError"
      ? 401
      : message.includes("Insufficient credits")
        ? 403
        : 400;

    return NextResponse.json({ error: message, id: randomUUID() }, { status });
  } finally {
    await Promise.allSettled(Array.from(localAssetPaths).map((filePath) => deleteLocalAssetFile(filePath)));
  }
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
