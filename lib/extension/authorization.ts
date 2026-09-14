import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export const AUTHORIZATION_CODE_TTL_MS = 2 * 60 * 1000;
export const ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000;

export class ExtensionAuthorizationError extends Error {
  constructor() {
    super("Invalid extension authorization");
    this.name = "ExtensionAuthorizationError";
  }
}

export interface AuthorizationRequest {
  clientId: string;
  redirectUri: string;
  state: string;
  codeChallenge: string;
  codeChallengeMethod: "S256";
}

export interface AuthorizationGrant {
  clientId: string;
  redirectUri: string;
  codeHash: string;
  codeChallenge: string;
  expiresAt: Date;
  consumedAt: Date | null;
  user: { isActive: boolean; isBanned: boolean };
}

const fail = (): never => { throw new ExtensionAuthorizationError(); };
const extensionIdPattern = /^[a-p]{32}$/;
const challengePattern = /^[A-Za-z0-9_-]{43}$/;
const verifierPattern = /^[A-Za-z0-9._~-]{43,128}$/;

export function hashSecret(secret: string): string {
  return createHash("sha256").update(secret, "ascii").digest("hex");
}

export function createSecret(): string {
  return randomBytes(32).toString("base64url");
}

export function pkceChallenge(verifier: string): string {
  if (!verifierPattern.test(verifier)) return fail();
  return createHash("sha256").update(verifier, "ascii").digest("base64url");
}

function equalSecret(left: string, right: string): boolean {
  const a = Buffer.from(left, "utf8");
  const b = Buffer.from(right, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

export function validateAuthorizationRequest(
  input: unknown,
  allowedExtensionIds: readonly string[],
): AuthorizationRequest {
  if (!input || typeof input !== "object") return fail();
  const value = input as Record<string, unknown>;
  const { clientId, redirectUri, state, codeChallenge, codeChallengeMethod } = value;
  if (typeof clientId !== "string" || !extensionIdPattern.test(clientId)
    || !allowedExtensionIds.includes(clientId)) return fail();
  if (redirectUri !== `https://${clientId}.chromiumapp.org/vfitly`) return fail();
  if (typeof state !== "string" || !/^[A-Za-z0-9_-]{32,128}$/.test(state)) return fail();
  if (typeof codeChallenge !== "string" || !challengePattern.test(codeChallenge)
    || codeChallengeMethod !== "S256") return fail();
  return { clientId, redirectUri, state, codeChallenge, codeChallengeMethod };
}

export function validateGrantExchange(
  grant: AuthorizationGrant,
  input: { code: string; verifier: string; clientId: string; redirectUri: string },
  now = new Date(),
): void {
  if (!challengePattern.test(input.code)
    || !Number.isFinite(now.getTime())
    || !Number.isFinite(grant.expiresAt.getTime())
    || grant.expiresAt.getTime() <= now.getTime()
    || grant.consumedAt !== null
    || !grant.user.isActive || grant.user.isBanned
    || grant.clientId !== input.clientId || grant.redirectUri !== input.redirectUri
    || !equalSecret(grant.codeHash, hashSecret(input.code))
    || !equalSecret(grant.codeChallenge, pkceChallenge(input.verifier))) return fail();
}

export function requireSameOriginPost(request: Request, trustedOrigin: string): void {
  let origin: URL;
  try { origin = new URL(trustedOrigin); } catch { return fail(); }
  if (origin.origin !== trustedOrigin
    || (origin.protocol !== "https:" && !(origin.protocol === "http:" && origin.hostname === "localhost"))
    || request.method !== "POST"
    || request.headers.get("origin") !== trustedOrigin
    || new URL(request.url).origin !== trustedOrigin
    || request.headers.get("sec-fetch-site") === "cross-site") return fail();
}

export function readBearerToken(header: string | null): string {
  const match = header?.match(/^Bearer ([A-Za-z0-9_-]{43})$/i);
  return match?.[1] ?? fail();
}
