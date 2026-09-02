import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/current-user";
import { localPathFromAssetUrl, saveBufferAsset } from "@/lib/storage/assets";
import { downloadVideoAsset, generateWalkVideoFromImage } from "@/lib/video/walk-video";
import { countUsageThisMonth, countUsageTotal, isPaidPlan, monthlyWalkVideoLimitForPlan } from "@/lib/billing/credits";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  let jobId = "";

  try {
    const user = await requireUser();
    const body = await request.json().catch(() => ({}));
    jobId = typeof body.jobId === "string" ? body.jobId : "";

    if (!jobId) {
      return NextResponse.json({ error: "Missing try-on job id." }, { status: 400 });
    }

    const videoLimit = monthlyWalkVideoLimitForPlan(user.membershipType);
    const usedVideos = isPaidPlan(user.membershipType)
      ? await countUsageThisMonth(user.id, "walk-video")
      : await countUsageTotal(user.id, "walk-video");

    if (usedVideos >= videoLimit) {
      const error = isPaidPlan(user.membershipType)
        ? `Your plan includes ${videoLimit} 360° try-on videos per month. Please upgrade to continue.`
        : "Free accounts include 1 free 360° try-on video per account. Please upgrade to continue.";
      return NextResponse.json({ error }, { status: 403 });
    }

    const job = await prisma.tryOnJob.findFirst({
      where: {
        id: jobId,
        userId: user.id,
      },
    });

    if (!job || !job.resultImageUrl) {
      return NextResponse.json({ error: "Final try-on result was not found." }, { status: 404 });
    }

    await prisma.tryOnJob.update({
      where: { id: job.id },
      data: {
        metadata: {
          ...metadataToRecord(job.metadata),
          walkVideoStatus: "PROCESSING",
        },
      },
    });

    const imagePath = await localPathFromAssetUrl(job.resultImageUrl);
    const generatedVideo = await generateWalkVideoFromImage(imagePath, job.resultImageUrl);
    let finalVideoUrl = generatedVideo.url || "";
    let finalVideoAssetKey: string | null = null;

    if (generatedVideo.buffer) {
      const storedVideo = await saveBufferAsset(
        generatedVideo.buffer,
        `try-on/${user.id}/walk-videos`,
        generatedVideo.extension,
        generatedVideo.mimeType,
      );
      finalVideoUrl = storedVideo.url;
      finalVideoAssetKey = storedVideo.key;
    } else if (generatedVideo.url) {
      try {
        const downloadedVideo = await downloadVideoAsset(generatedVideo.url);
        const storedVideo = await saveBufferAsset(
          downloadedVideo.buffer,
          `try-on/${user.id}/walk-videos`,
          downloadedVideo.extension,
          downloadedVideo.mimeType,
        );
        finalVideoUrl = storedVideo.url;
        finalVideoAssetKey = storedVideo.key;
      } catch (downloadError) {
        console.warn("Unable to download generated walk video, using provider URL instead.", downloadError);
      }
    }

    if (!finalVideoUrl) {
      throw new Error("The video task succeeded, but no playable video URL was returned.");
    }

    const walkVideoModel = process.env.WALK_VIDEO_MODEL || "grok-imagine-1.5";

    await prisma.tryOnJob.update({
      where: { id: job.id },
      data: {
        metadata: {
          ...metadataToRecord(job.metadata),
          walkVideoStatus: "COMPLETED",
          walkVideoUrl: finalVideoUrl,
          walkVideoAssetKey: finalVideoAssetKey,
          walkVideoModel,
        },
      },
    });

    await prisma.usageRecord.create({
      data: {
        userId: user.id,
        type: "walk-video",
        cost: 1,
        metadata: { jobId: job.id, model: walkVideoModel },
      },
    });

    return NextResponse.json({ videoUrl: finalVideoUrl, model: walkVideoModel });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Walk video generation failed.";

    if (jobId) {
      const existingJob = await prisma.tryOnJob.findUnique({ where: { id: jobId }, select: { metadata: true } }).catch(() => null);
      await prisma.tryOnJob.update({
        where: { id: jobId },
        data: {
          metadata: {
            ...metadataToRecord(existingJob?.metadata),
            walkVideoStatus: "FAILED",
            walkVideoError: message,
          },
        },
      }).catch(() => undefined);
    }

    return NextResponse.json(
      { error: message },
      { status: 400 },
    );
  }
}

function metadataToRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? { ...(value as Record<string, unknown>) } : {};
}
