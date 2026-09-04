import { cookies } from "next/headers";

import { UnauthorizedError, getCurrentUser } from "./current-user";
import {
  clearGuestSessionCookie,
  createGuestId,
  GUEST_ID_COOKIE,
  guestAssetPrefix,
  guestExpiresAt,
  GUEST_TTL_DAYS,
  getExistingGuestIdFromCookie,
  type GuestSession,
  isValidGuestId,
  promoteGuestResourcesToUser,
} from "./guest-resources";

export {
  clearGuestSessionCookie,
  createGuestId,
  GUEST_ID_COOKIE,
  guestAssetPrefix,
  guestExpiresAt,
  GUEST_TTL_DAYS,
  getExistingGuestIdFromCookie,
  isValidGuestId,
  promoteGuestResourcesToUser,
};

export type OptionalUserContext = {
  user: Awaited<ReturnType<typeof getCurrentUser>>;
  guest: GuestSession | null;
};

export async function getGuestSession(): Promise<GuestSession> {
  const cookieStore = await cookies();
  const existingGuestId = cookieStore.get(GUEST_ID_COOKIE)?.value;
  const guestId = isValidGuestId(existingGuestId) ? existingGuestId : createGuestId();
  const expiresAt = guestExpiresAt();

  cookieStore.set(GUEST_ID_COOKIE, guestId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });

  return { guestId, expiresAt };
}

export async function getOptionalUserContext(): Promise<OptionalUserContext> {
  const user = await getCurrentUser();

  if (user) {
    return { user, guest: null };
  }

  return {
    user: null,
    guest: await getGuestSession(),
  };
}

export async function requireUserOrGuest() {
  const context = await getOptionalUserContext();

  if (!context.user && !context.guest) {
    throw new UnauthorizedError();
  }

  return context;
}
