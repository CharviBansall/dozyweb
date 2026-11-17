import assert from "node:assert/strict";
import { createSign, generateKeyPairSync } from "node:crypto";
import { afterEach, beforeEach, test } from "node:test";

import {
  checkJunctionCaller,
  issueAppSession,
  verifyGoogleIdToken,
} from "../src/lib/app-auth.ts";

const CLIENT_ID = "1234567890-abcdefg.apps.googleusercontent.com";
const SUB = "109876543210987654321";
const USER_ID = `google_${SUB}`;
const NOW = Date.UTC(2026, 10, 17, 12, 0, 0);

const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const jwk = { ...publicKey.export({ format: "jwk" }), kid: "test-kid", alg: "RS256" };
const fetchKeys = async () => [jwk];

const b64 = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");

function googleToken(claims = {}, header = {}, signingKey = privateKey) {
  const head = b64({ alg: "RS256", kid: "test-kid", ...header });
  const body = b64({
    iss: "https://accounts.google.com",
    aud: CLIENT_ID,
    sub: SUB,
    iat: Math.floor(NOW / 1000),
    exp: Math.floor(NOW / 1000) + 600,
    ...claims,
  });
  const signature = createSign("RSA-SHA256")
    .update(`${head}.${body}`)
    .sign(signingKey)
    .toString("base64url");
  return `${head}.${body}.${signature}`;
}

const verify = (token) => verifyGoogleIdToken(token, { fetchKeys, now: NOW });

const savedEnv = { ...process.env };
beforeEach(() => {
  process.env.SESSION_SECRET = "test-session-secret";
  process.env.GOOGLE_CLIENT_ID = CLIENT_ID;
  process.env.JUNCTION_ENVIRONMENT = "production";
});
afterEach(() => {
  process.env = { ...savedEnv };
});

test("accepts a valid Google ID token and prefixes the user id", async () => {
  assert.deepEqual(await verify(googleToken()), { ok: true, userId: USER_ID });
});

test("accepts Google's bare issuer form", async () => {
  const result = await verify(googleToken({ iss: "accounts.google.com" }));
  assert.deepEqual(result, { ok: true, userId: USER_ID });
});

test("refuses everything until GOOGLE_CLIENT_ID is set", async () => {
  delete process.env.GOOGLE_CLIENT_ID;
  const result = await verify(googleToken());
  assert.deepEqual(result, { ok: false, reason: "google sign in not configured" });
});

test("rejects a token issued for another app", async () => {
  const result = await verify(googleToken({ aud: "someone-else.apps.googleusercontent.com" }));
  assert.deepEqual(result, { ok: false, reason: "wrong audience" });
});

test("rejects a token from another issuer", async () => {
  const result = await verify(googleToken({ iss: "https://appleid.apple.com" }));
  assert.deepEqual(result, { ok: false, reason: "wrong issuer" });
});

test("rejects an expired token", async () => {
  const result = await verify(googleToken({ exp: Math.floor(NOW / 1000) - 3600 }));
  assert.deepEqual(result, { ok: false, reason: "expired" });
});

test("rejects a token signed by a different key", async () => {
  const other = generateKeyPairSync("rsa", { modulusLength: 2048 }).privateKey;
  const result = await verify(googleToken({}, {}, other));
  assert.deepEqual(result, { ok: false, reason: "bad signature" });
});

test("rejects an unsigned token", async () => {
  const result = await verify(googleToken({}, { alg: "none" }));
  assert.deepEqual(result, { ok: false, reason: "unsupported token header" });
});

test("a Google session works on the Junction routes for its own user only", () => {
  const { token } = issueAppSession(USER_ID);
  assert.deepEqual(checkJunctionCaller(`Bearer ${token}`, USER_ID), {
    ok: true,
    authenticated: true,
  });
  assert.equal(checkJunctionCaller(`Bearer ${token}`, "001234.apple.user").ok, false);
});
