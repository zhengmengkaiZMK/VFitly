import { NextRequest, NextResponse } from "next/server";
import { generateProductTryOnImage } from "@/lib/product-try-on/openai-image";
import {
  saveProductTryOnGeneratedImage,
  saveProductTryOnRemoteImage,
  saveProductTryOnUpload,
} from "@/lib/product-try-on/storage";
import { requireUserOrGuest, guestAssetPrefix, guestExpiresAt } from "@/lib/auth/guest-session";
import { countGuestProductTryOnUsageToday } from "@/lib/auth/guest-resources";
import { prisma } from "@/lib/db/prisma";
import { localPathFromAssetUrl } from "@/lib/storage/assets";
import {
  FREE_DAILY_TRY_ON_LIMIT,
  TRY_ON_SINGLE_COST,
  ensureSufficientCredits,
  isPaidPlan,
  spendCredits,
} from "@/lib/billing/credits";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ProductGarmentInput = {
  id?: string;
  imageUrl?: string;
  label?: string;
};

const MAX_BATCH_SIZE = 12;

export async function POST(request: NextRequest) {
  try {
    const { user, guest } = await requireUserOrGuest();
    const formData = await request.formData();
    const personImage = formData.get("personImage");
    const garmentsValue = formData.get("garments");
    const paidPlan = user ? isPaidPlan(user.membershipType) : false;

    if (typeof garmentsValue !== "string") {
      return NextResponse.json({ error: "Please provide product garment images." }, { status: 400 });
    }

    const garments = parseGarments(garmentsValue);
    if (garments.length === 0) {
      return NextResponse.json({ error: "Please keep at least one product garment image." }, { status: 400 });
    }

    if (garments.length > MAX_BATCH_SIZE) {
      return NextResponse.json({ error: `Please select no more than ${MAX_BATCH_SIZE} product garment images at a time.` }, { status: 400 });
    }

    if (user && !paidPlan) {
      return NextResponse.json(
        { error: "Product link try-on generation is available on Plus and Ultra plans. Free users can preview extracted product images before upgrading." },
        { status: 403 },
      );
    }

    if (!user && guest) {
      const usedToday = await countGuestProductTryOnUsageToday(guest.guestId);
      if (usedToday + garments.length > FREE_DAILY_TRY_ON_LIMIT) {
        return NextResponse.json(
          {
            error: "Guest mode includes 2 free Product Try On generations per day. Please sign in to continue.",
            requiresLogin: true,
          },
          { status: 403 },
        );
      }
    }

    const totalCreditsCost = garments.length * TRY_ON_SINGLE_COST;
    if (user) {
      await ensureSufficientCredits(user.id, user.membershipType, totalCreditsCost);
    }

    const assetPrefix = user ? `product-try-on/${user.id}` : `${guestAssetPrefix(guest!.guestId)}/product-try-on`;

    let personUrl = user?.defaultModelImageUrl || "";
    let personPath = personUrl ? await localPathFromAssetUrl(personUrl) || "" : "";
    let personAssetKey = user?.defaultModelAssetKey || null;

    if (personImage instanceof File) {
      const person = await saveProductTryOnUpload(personImage, `${assetPrefix}/persons`);
      personUrl = person.url;
      personPath = person.path;
      personAssetKey = person.key;

      if (user && !user.defaultModelImageUrl) {
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

    const results = [];

    for (const garment of garments) {
      let jobId: string | null = null;

      try {
        if (!garment.imageUrl) throw new Error("Missing product image URL.");

        if (user) {
          await ensureSufficientCredits(user.id, user.membershipType, TRY_ON_SINGLE_COST);
        }

        const savedGarment = await saveProductTryOnRemoteImage(garment.imageUrl, `${assetPrefix}/garments`);
        const job = await prisma.tryOnJob.create({
          data: {
            userId: user?.id || null,
            guestId: user ? null : guest!.guestId,
            isTemporary: !user,
            expiresAt: user ? null : guestExpiresAt(),
            provider: "openai",
            model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-2",
            jobType: "PRODUCT_URL_IMAGE",
            personImageUrl: personUrl,
            personAssetKey,
            garmentImageUrl: savedGarment.url,
            garmentImageUrls: [savedGarment.url],
            garmentAssetKey: savedGarment.key,
            prompt: "Product link virtual try-on",
            creditsCost: user ? TRY_ON_SINGLE_COST : 0,
            costCredits: user ? TRY_ON_SINGLE_COST : 0,
            metadata: { source: "product-link", productImageUrl: garment.imageUrl, label: garment.label || null },
            status: "PENDING",
          },
        });
        jobId = job.id;

        await prisma.tryOnJob.update({
          where: { id: job.id },
          data: { status: "PROCESSING" },
        });

        const generated = await generateProductTryOnImage({
          personImagePath: personPath,
          garmentImagePath: savedGarment.path,
        });
        const savedResult = await saveProductTryOnGeneratedImage(generated.buffer, `${assetPrefix}/results`, generated.extension);
        const updatedJob = await prisma.tryOnJob.update({
          where: { id: job.id },
          data: {
            resultImageUrl: savedResult.url,
            resultAssetKey: savedResult.key,
            status: "COMPLETED",
            completedAt: new Date(),
          },
        });

        if (user) {
          await spendCredits(user.id, user.membershipType, TRY_ON_SINGLE_COST, "Product link try-on generation", {
            jobId: job.id,
            productImageUrl: garment.imageUrl,
          });

          await prisma.usageRecord.create({
            data: {
              userId: user.id,
              type: "try-on",
              cost: TRY_ON_SINGLE_COST,
              metadata: { jobId: job.id, source: "product-link" },
            },
          });
        }

        results.push({
          id: garment.id || updatedJob.id,
          jobId: updatedJob.id,
          label: garment.label || "Product garment",
          garmentUrl: garment.imageUrl,
          resultUrl: savedResult.url,
          status: "success",
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to generate this try-on image.";

        if (jobId) {
          await prisma.tryOnJob.update({ where: { id: jobId }, data: { status: "FAILED", error: message } }).catch(() => undefined);
        }

        results.push({
          id: garment.id || garment.imageUrl || crypto.randomUUID(),
          label: garment.label || "Product garment",
          garmentUrl: garment.imageUrl || "",
          status: "failed",
          error: message,
        });
      }
    }

    return NextResponse.json({ personUrl, results });
  } catch (error) {
    console.error("Product try-on generation failed", error);
    const status = error instanceof Error && error.message.includes("Unauthorized")
      ? 401
      : error instanceof Error && error.message.includes("Insufficient credits")
        ? 403
        : 500;

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate product try-on images." },
      { status },
    );
  }
}

function parseGarments(value: string): ProductGarmentInput[] {
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => ({
        id: typeof item?.id === "string" ? item.id : undefined,
        imageUrl: typeof item?.imageUrl === "string" ? item.imageUrl : undefined,
        label: typeof item?.label === "string" ? item.label : undefined,
      }))
      .filter((item) => item.imageUrl);
  } catch {
    return [];
  }
}
