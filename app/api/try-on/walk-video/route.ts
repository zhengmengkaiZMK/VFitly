import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireUserOrGuest, guestAssetPrefix } from "@/lib/auth/guest-session";
import { countGuestWalkVideoUsageToday } from "@/lib/auth/guest-resources";
import { saveBufferAsset } from "@/lib/storage/assets";
import { downloadVideoAsset, pollWalkVideoTaskOnce, startWalkVideoFromImage, type GeneratedWalkVideo, type WalkVideoTask } from "@/lib/video/walk-video";
import { countUsageThisMonth, isPaidPlan, monthlyWalkVideoLimitForPlan } from "@/lib/billing/credits";

export const runtime = "nodejs";
export const maxDuration = 60;

const PROCESSING_RETRY_AFTER_SECONDS = 5;
const JOB_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
  let jobId = "";

  try {
    const { user, guest } = await requireUserOrGuest();
    const body = await request.json().catch(() => ({}));
    jobId = typeof body.jobId === "string" ? body.jobId : "";

    if (!jobId) {
      return NextResponse.json({ error: "Missing try-on job id." }, { status: 400 });
    }

    if (!JOB_ID_PATTERN.test(jobId)) {
      return NextResponse.json({ error: "Invalid try-on job id." }, { status: 400 });
    }

    if (user) {
      if (!isPaidPlan(user.membershipType)) {
        return NextResponse.json(
          { error: "Generating 360° try-on videos requires an active Plus or Ultra plan. Please upgrade to continue." },
          { status: 403 },
        );
      }

      const videoLimit = monthlyWalkVideoLimitForPlan(user.membershipType);
      const usedVideos = await countUsageThisMonth(user.id, "walk-video");

      if (usedVideos >= videoLimit) {
        return NextResponse.json(
          { error: `Your plan includes ${videoLimit} 360° try-on videos per month. Please upgrade to continue.` },
          { status: 403 },
        );
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

    const currentMetadata = metadataToRecord(job.metadata);
    if (currentMetadata.walkVideoStatus === "COMPLETED" && typeof currentMetadata.walkVideoUrl === "string") {
      return NextResponse.json({ videoUrl: currentMetadata.walkVideoUrl, model: currentMetadata.walkVideoModel || process.env.WALK_VIDEO_MODEL || "grok-imagine-1.5" });
    }

    const videoPrefix = user
      ? `try-on/${user.id}/walk-videos`
      : guest
        ? `${guestAssetPrefix(guest.guestId)}/walk-videos`
        : "try-on/anonymous/walk-videos";
    const walkVideoModel = process.env.WALK_VIDEO_MODEL || "grok-imagine-1.5";
    const storedTask = typeof currentMetadata.walkVideoTaskId === "string" && typeof currentMetadata.walkVideoProvider === "string"
      ? { taskId: currentMetadata.walkVideoTaskId, provider: currentMetadata.walkVideoProvider as WalkVideoTask["provider"] }
      : null;

    let generatedVideo: GeneratedWalkVideo | null = null;
    if (storedTask) {
      const polled = await pollWalkVideoTaskOnce(storedTask);
      if (polled.status === "processing") {
        await prisma.tryOnJob.update({
          where: { id: job.id },
          data: { metadata: { ...currentMetadata, walkVideoStatus: "PROCESSING", walkVideoLastCheckedAt: new Date().toISOString() } },
        });
        return NextResponse.json(
          { status: "processing", jobId: job.id, model: walkVideoModel },
          { status: 202, headers: { "Retry-After": String(PROCESSING_RETRY_AFTER_SECONDS) } },
        );
      }
      generatedVideo = polled.video;
    } else {
      const started = await startWalkVideoFromImage(job.resultImageUrl);
      if (started.status === "processing") {
        await prisma.tryOnJob.update({
          where: { id: job.id },
          data: {
            metadata: {
              ...currentMetadata,
              walkVideoStatus: "PROCESSING",
              walkVideoTaskId: started.task.taskId,
              walkVideoProvider: started.task.provider,
              walkVideoModel,
              walkVideoStartedAt: new Date().toISOString(),
            },
          },
        });
        return NextResponse.json(
          { status: "processing", jobId: job.id, model: walkVideoModel },
          { status: 202, headers: { "Retry-After": String(PROCESSING_RETRY_AFTER_SECONDS) } },
        );
      }
      generatedVideo = started.video;
    }

    const storedVideo = await persistGeneratedVideo(generatedVideo, videoPrefix);
    const finalVideoUrl = storedVideo.url;
    const finalVideoAssetKey = storedVideo.assetKey;

    await prisma.tryOnJob.update({
      where: { id: job.id },
      data: {
        metadata: {
          ...currentMetadata,
          walkVideoStatus: "COMPLETED",
          walkVideoUrl: finalVideoUrl,
          walkVideoAssetKey: finalVideoAssetKey,
          walkVideoModel,
          walkVideoTaskId: null,
          walkVideoProvider: null,
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

    if (jobId && JOB_ID_PATTERN.test(jobId)) {
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

async function persistGeneratedVideo(video: GeneratedWalkVideo, prefix: string) {
  if (video.buffer) {
    const stored = await saveBufferAsset(video.buffer, prefix, video.extension, video.mimeType);
    return { url: stored.url, assetKey: stored.key };
  }

  if (video.url) {
    try {
      const downloaded = await downloadVideoAsset(video.url);
      const stored = await saveBufferAsset(downloaded.buffer, prefix, downloaded.extension, downloaded.mimeType);
      return { url: stored.url, assetKey: stored.key };
    } catch (error) {
      console.warn("Unable to download generated walk video, using provider URL instead.", error);
      return { url: video.url, assetKey: null };
    }
  }

  throw new Error("The video task succeeded, but no playable video URL was returned.");
}
