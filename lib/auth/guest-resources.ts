import crypto from "crypto";

import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";

import { prisma } from "@/lib/db/prisma";
import { startOfToday } from "@/lib/billing/credits";

export const GUEST_ID_COOKIE = "vfitly_guest_id";
export const GUEST_TTL_DAYS = 1;

const GUEST_ID_PATTERN = /^[a-zA-Z0-9_-]{16,64}$/;

export type GuestSession = {
  guestId: string;
  expiresAt: Date;
};

export function guestExpiresAt(days = GUEST_TTL_DAYS) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

export function isValidGuestId(value: unknown): value is string {
  return typeof value === "string" && GUEST_ID_PATTERN.test(value);
}

export function createGuestId() {
  return crypto.randomBytes(24).toString("base64url");
}

export function guestAssetPrefix(guestId: string) {
  if (!isValidGuestId(guestId)) {
    throw new Error("Invalid guest id");
  }

  return `guests/${guestId}`;
}

export async function getExistingGuestIdFromCookie() {
  const cookieStore = await cookies();
  const existingGuestId = cookieStore.get(GUEST_ID_COOKIE)?.value;

  return isValidGuestId(existingGuestId) ? existingGuestId : null;
}

export async function clearGuestSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(GUEST_ID_COOKIE);
}

export async function countGuestProductPreviewUsageToday(guestId: string) {
  if (!isValidGuestId(guestId)) return 0;

  return prisma.guestUsageRecord.count({
    where: {
      guestId,
      type: "product-preview",
      createdAt: { gte: startOfToday() },
    },
  });
}

export async function countGuestProductTryOnUsageToday(guestId: string) {
  if (!isValidGuestId(guestId)) return 0;

  return prisma.tryOnJob.count({
    where: {
      guestId,
      userId: null,
      isTemporary: true,
      jobType: "PRODUCT_URL_IMAGE",
      status: "COMPLETED",
      createdAt: { gte: startOfToday() },
    },
  });
}

export async function countGuestTryOnUsageToday(guestId: string) {
  if (!isValidGuestId(guestId)) return 0;

  return prisma.tryOnJob.count({
    where: {
      guestId,
      userId: null,
      isTemporary: true,
      status: "COMPLETED",
      createdAt: { gte: startOfToday() },
    },
  });
}

export async function countGuestWalkVideoUsageToday(guestId: string) {
  if (!isValidGuestId(guestId)) return 0;

  return prisma.tryOnJob.count({
    where: {
      guestId,
      userId: null,
      isTemporary: true,
      createdAt: { gte: startOfToday() },
      metadata: {
        path: ["walkVideoStatus"],
        equals: "COMPLETED",
      } as Prisma.JsonFilter,
    },
  });
}

export async function promoteGuestResourcesToUser(guestId: string, userId: string) {
  if (!isValidGuestId(guestId)) {
    return { wardrobeItems: 0, tryOnJobs: 0 };
  }

  const [wardrobeItems, tryOnJobs] = await prisma.$transaction([
    prisma.wardrobeItem.updateMany({
      where: {
        guestId,
        isTemporary: true,
        userId: null,
      },
      data: {
        userId,
        guestId: null,
        isTemporary: false,
        expiresAt: null,
        cleanupStatus: null,
      },
    }),
    prisma.tryOnJob.updateMany({
      where: {
        guestId,
        isTemporary: true,
        userId: null,
      },
      data: {
        userId,
        guestId: null,
        isTemporary: false,
        expiresAt: null,
        cleanupStatus: null,
      },
    }),
  ]);

  return {
    wardrobeItems: wardrobeItems.count,
    tryOnJobs: tryOnJobs.count,
  };
}
