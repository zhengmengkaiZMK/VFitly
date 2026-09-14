import assert from "node:assert/strict";
import { test } from "node:test";
import {
  createSecret, hashSecret, pkceChallenge, readBearerToken,
  requireSameOriginPost, validateAuthorizationRequest, validateGrantExchange,
  type AuthorizationGrant,
} from "./authorization";

const clientId = "a".repeat(32);
const redirectUri = `https://${clientId}.chromiumapp.org/vfitly`;
const verifier = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk";
const codeChallenge = "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM";
const request = { clientId, redirectUri, state: "s".repeat(43), codeChallenge, codeChallengeMethod: "S256" };

test("PKCE matches RFC 7636 and rejects invalid verifier lengths", () => {
  assert.equal(pkceChallenge(verifier), codeChallenge);
  for (const input of ["x".repeat(42), "x".repeat(129), "空".repeat(43)]) {
    assert.throws(() => pkceChallenge(input));
  }
});

test("authorization only allows registered Chrome callbacks and S256", () => {
  assert.deepEqual(validateAuthorizationRequest(request, [clientId]), request);
  assert.throws(() => validateAuthorizationRequest(request, []));
  for (const patch of [
    { redirectUri: `${redirectUri}?next=https://evil.test` },
    { redirectUri: `https://${clientId}.chromiumapp.org.evil.test/vfitly` },
    { redirectUri: redirectUri.replace("https:", "http:") },
    { redirectUri: `${redirectUri}/` },
    { codeChallengeMethod: "plain" }, { state: "short" },
    { codeChallenge: "!".repeat(43) }, { clientId: "z".repeat(32) },
  ]) assert.throws(() => validateAuthorizationRequest({ ...request, ...patch }, [clientId]));
});

test("opaque secrets have sufficient size and only hashes need storage", () => {
  const secret = createSecret();
  assert.match(secret, /^[A-Za-z0-9_-]{43}$/);
  assert.notEqual(secret, createSecret());
  assert.match(hashSecret(secret), /^[a-f0-9]{64}$/);
  assert.equal(readBearerToken(`Bearer ${secret}`), secret);
  for (const header of [null, secret, `Bearer ${secret} extra`, "Bearer short"]) {
    assert.throws(() => readBearerToken(header));
  }
});

test("grant validation rejects expiry, replay, disabled users and binding mismatch", () => {
  const code = createSecret();
  const now = new Date("2026-09-08T00:00:00Z");
  const grant: AuthorizationGrant = {
    clientId, redirectUri, codeHash: hashSecret(code), codeChallenge,
    expiresAt: new Date(now.getTime() + 120000), consumedAt: null,
    user: { isActive: true, isBanned: false },
  };
  const input = { clientId, redirectUri, code, verifier };
  assert.doesNotThrow(() => validateGrantExchange(grant, input, now));
  for (const patch of [
    { expiresAt: now }, { expiresAt: new Date(NaN) }, { consumedAt: now },
    { user: { isActive: false, isBanned: false } },
    { user: { isActive: true, isBanned: true } },
  ]) assert.throws(() => validateGrantExchange({ ...grant, ...patch }, input, now));
  for (const patch of [
    { code: createSecret() }, { verifier: "x".repeat(43) },
    { clientId: "b".repeat(32) }, { redirectUri: "https://evil.test" },
  ]) assert.throws(() => validateGrantExchange(grant, { ...input, ...patch }, now));
});

test("authorization consent requires explicit trusted same-origin POST", () => {
  const origin = "https://vfitly.ai";
  const make = (headers: Record<string, string>, method = "POST") =>
    new Request(`${origin}/api/extension/authorize`, { method, headers });
  assert.doesNotThrow(() => requireSameOriginPost(make({ origin }), origin));
  assert.throws(() => requireSameOriginPost(make({}), origin));
  assert.throws(() => requireSameOriginPost(make({ origin: "https://evil.test" }), origin));
  assert.throws(() => requireSameOriginPost(make({ origin }, "GET"), origin));
  assert.throws(() => requireSameOriginPost(make({ origin, "sec-fetch-site": "cross-site" }), origin));
  assert.throws(() => requireSameOriginPost(make({ origin }), `${origin}/`));
});
