import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireUserOrGuest, guestAssetPrefix } from "@/lib/auth/guest-session";
import { countGuestWalkVideoUsageToday } from "@/lib/auth/guest-resources";
import { localPathFromAssetUrl, saveBufferAsset } from "@/lib/storage/assets";
import { downloadVideoAsset, generateWalkVideoFromImage } from "@/lib/video/walk-video";
import { countUsageThisMonth, countUsageTotal, isPaidPlan, monthlyWalkVideoLimitForPlan } from "@/lib/billing/credits";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  let jobId = "";

  try {
    const { user, guest } = await requireUserOrGuest();
    const body = await request.json().catch(() => ({}));
    jobId = typeof body.jobId === "string" ? body.jobId : "";

    if (!jobId) {
      return NextResponse.json({ error: "Missing try-on job id." }, { status: 400 });
    }

    if (user) {
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
    } else if (guest) {
      const usedVideos = await countGuestWalkVideoUsageToday(guest.guestId);
      if (usedVideos >= 1) {
        return NextResponse.json({ error: "Guest mode includes 1 free 360° try-on video per day. Please sign in or upgrade to continue." }, { status: 403 });
      }
    }

    const job = await prisma.tryOnJob.findFirst({
      where: {
        id: jobId,
        ...(user
          ? { userId: user.id }
          : {
              userId: null,
              guestId: guest?.guestId,
              isTemporary: true,
              OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
            }),
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

    const videoPrefix = user
      ? `try-on/${user.id}/walk-videos`
      : guest
        ? `${guestAssetPrefix(guest.guestId)}/walk-videos`
        : "try-on/anonymous/walk-videos";

    if (generatedVideo.buffer) {
      const storedVideo = await saveBufferAsset(
        generatedVideo.buffer,
        videoPrefix,
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
          videoPrefix,
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

    if (user) {
      await prisma.usageRecord.create({
        data: {
          userId: user.id,
          type: "walk-video",
          cost: 1,
          metadata: { jobId: job.id, model: walkVideoModel },
        },
      });
    }

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
