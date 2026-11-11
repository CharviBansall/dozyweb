import assert from "node:assert/strict";
import { createHmac, createSign, generateKeyPairSync } from "node:crypto";
import { afterEach, beforeEach, test } from "node:test";

import {
  checkJunctionCaller,
  issueAppSession,
  verifyAppSession,
  verifyAppleIdentityToken,
} from "../src/lib/app-auth.ts";

const BUNDLE_ID = "charvibansall.dozy";
const USER_ID = "001234.abcdef0123456789.0001";
const NOW = Date.UTC(2026, 10, 11, 12, 0, 0);

const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const jwk = { ...publicKey.export({ format: "jwk" }), kid: "test-kid", alg: "RS256" };
const fetchKeys = async () => [jwk];

const b64 = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");

function appleToken(claims = {}, header = {}, signingKey = privateKey) {
  const head = b64({ alg: "RS256", kid: "test-kid", ...header });
  const body = b64({
    iss: "https://appleid.apple.com",
    aud: BUNDLE_ID,
    sub: USER_ID,
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

const verify = (token) => verifyAppleIdentityToken(token, { fetchKeys, now: NOW });

const savedEnv = { ...process.env };
beforeEach(() => {
  process.env.SESSION_SECRET = "test-session-secret";
  delete process.env.APPLE_BUNDLE_ID;
  delete process.env.JUNCTION_REQUIRE_AUTH;
  process.env.JUNCTION_ENVIRONMENT = "sandbox";
});
afterEach(() => {
  process.env = { ...savedEnv };
});

test("accepts a valid Apple identity token", async () => {
  assert.deepEqual(await verify(appleToken()), { ok: true, userId: USER_ID });
});

test("rejects a token for another app", async () => {
  const result = await verify(appleToken({ aud: "com.someone.else" }));
  assert.deepEqual(result, { ok: false, reason: "wrong audience" });
});

test("rejects a token from another issuer", async () => {
  const result = await verify(appleToken({ iss: "https://evil.example" }));
  assert.deepEqual(result, { ok: false, reason: "wrong issuer" });
});

test("rejects an expired token", async () => {
  const result = await verify(appleToken({ exp: Math.floor(NOW / 1000) - 3600 }));
  assert.deepEqual(result, { ok: false, reason: "expired" });
});

test("rejects a token signed by a different key", async () => {
  const other = generateKeyPairSync("rsa", { modulusLength: 2048 }).privateKey;
  const result = await verify(appleToken({}, {}, other));
  assert.deepEqual(result, { ok: false, reason: "bad signature" });
});

test("rejects a payload swapped after signing", async () => {
  const [head, , signature] = appleToken().split(".");
  const forged = b64({
    iss: "https://appleid.apple.com",
    aud: BUNDLE_ID,
    sub: "someone-else",
    exp: Math.floor(NOW / 1000) + 600,
  });
  const result = await verify(`${head}.${forged}.${signature}`);
  assert.deepEqual(result, { ok: false, reason: "bad signature" });
});

test("rejects unsigned and HMAC tokens", async () => {
  const body = b64({ iss: "https://appleid.apple.com", aud: BUNDLE_ID, sub: USER_ID, exp: 9e9 });
  const none = `${b64({ alg: "none", kid: "test-kid" })}.${body}.`;
  assert.equal((await verify(none)).ok, false);

  const hsHead = b64({ alg: "HS256", kid: "test-kid" });
  const hsSig = createHmac("sha256", JSON.stringify(jwk))
    .update(`${hsHead}.${body}`)
    .digest("base64url");
  const result = await verify(`${hsHead}.${body}.${hsSig}`);
  assert.deepEqual(result, { ok: false, reason: "unsupported token header" });
});

test("rejects an unknown key id and garbage input", async () => {
  const unknown = await verify(appleToken({}, { kid: "nope" }));
  assert.deepEqual(unknown, { ok: false, reason: "unknown signing key" });
  assert.equal((await verify("not-a-token")).ok, false);
  assert.equal((await verify("")).ok, false);
});

test("honours APPLE_BUNDLE_ID when set", async () => {
  process.env.APPLE_BUNDLE_ID = "com.example.one, com.example.two";
  const token = appleToken({ aud: "com.example.two" });
  assert.equal((await verifyAppleIdentityToken(token, { fetchKeys, now: NOW })).ok, true);
  const defaultAud = await verifyAppleIdentityToken(appleToken(), { fetchKeys, now: NOW });
  assert.deepEqual(defaultAud, { ok: false, reason: "wrong audience" });
});

test("app session round-trips and expires", () => {
  const { token, expiresAt } = issueAppSession(USER_ID, NOW);
  assert.equal(verifyAppSession(token, NOW), USER_ID);
  assert.equal(verifyAppSession(token, expiresAt - 1), USER_ID);
  assert.equal(verifyAppSession(token, expiresAt + 1), null);
});

test("app session rejects tampering and other secrets", () => {
  const { token } = issueAppSession(USER_ID, NOW);
  const [prefix, , signature] = token.split(".");
  const forgedBody = b64({ sub: "someone-else", exp: NOW + 1e9 });
  assert.equal(verifyAppSession(`${prefix}.${forgedBody}.${signature}`, NOW), null);

  process.env.SESSION_SECRET = "a-different-secret";
  assert.equal(verifyAppSession(token, NOW), null);
});

test("app session rejects an entitlement-cookie style token", () => {
  // The web entitlement cookie is `<body>.<hmac(body)>` under the same secret.
  const body = b64({ sub: USER_ID, exp: NOW + 1e9 });
  const cookieSig = createHmac("sha256", "test-session-secret").update(body).digest("base64url");
  assert.equal(verifyAppSession(`${body}.${cookieSig}`, NOW), null);
  assert.equal(verifyAppSession(`dz1.${body}.${cookieSig}`, NOW), null);
});

test("sandbox allows a missing session unless JUNCTION_REQUIRE_AUTH is set", () => {
  assert.deepEqual(checkJunctionCaller(null, USER_ID), { ok: true, authenticated: false });

  process.env.JUNCTION_REQUIRE_AUTH = "true";
  const result = checkJunctionCaller(null, USER_ID);
  assert.equal(result.ok, false);
  assert.equal(result.status, 401);
});

test("production always requires a session", () => {
  process.env.JUNCTION_ENVIRONMENT = "production";
  process.env.JUNCTION_REQUIRE_AUTH = "false";
  assert.equal(checkJunctionCaller(null, USER_ID).status, 401);
  assert.equal(checkJunctionCaller("", USER_ID).status, 401);
  assert.equal(checkJunctionCaller("Basic abc", USER_ID).status, 401);
});

test("a session only authorises its own user", () => {
  process.env.JUNCTION_ENVIRONMENT = "production";
  const { token } = issueAppSession(USER_ID);
  assert.deepEqual(checkJunctionCaller(`Bearer ${token}`, USER_ID), {
    ok: true,
    authenticated: true,
  });
  assert.equal(checkJunctionCaller(`Bearer ${token}`, "another-user").status, 403);
});

test("an invalid session is rejected even where auth is optional", () => {
  assert.equal(checkJunctionCaller("Bearer garbage", USER_ID).status, 401);
  const expired = issueAppSession(USER_ID, Date.now() - 200 * 24 * 3600 * 1000).token;
  assert.equal(checkJunctionCaller(`Bearer ${expired}`, USER_ID).status, 401);
});
