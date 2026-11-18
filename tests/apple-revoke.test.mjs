import assert from "node:assert/strict";
import { createVerify, generateKeyPairSync } from "node:crypto";
import { afterEach, beforeEach, test } from "node:test";

import {
  createAppleClientSecret,
  isAppleRevocationConfigured,
  revokeAppleAuthorization,
} from "../src/lib/apple-revoke.ts";

const { privateKey, publicKey } = generateKeyPairSync("ec", { namedCurve: "P-256" });
const PEM = privateKey.export({ type: "pkcs8", format: "pem" });
const CLIENT_ID = "charvibansall.dozy";
const NOW = Date.UTC(2026, 10, 17, 12, 0, 0);

const savedEnv = { ...process.env };
beforeEach(() => {
  process.env.APPLE_TEAM_ID = "TEAM123456";
  process.env.APPLE_KEY_ID = "KEY1234567";
  process.env.APPLE_PRIVATE_KEY = PEM;
  process.env.APPLE_BUNDLE_ID = CLIENT_ID;
});
afterEach(() => {
  process.env = { ...savedEnv };
});

const ok = (body) => ({ ok: true, status: 200, json: async () => body });
const fail = (status) => ({ ok: false, status, json: async () => ({}) });

function recorder(responses) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, fields: Object.fromEntries(new URLSearchParams(init.body)) });
    return responses.shift();
  };
  return { calls, fetchImpl };
}

test("client secret is an ES256 JWT Apple can verify", () => {
  const config = { teamId: "TEAM123456", keyId: "KEY1234567", privateKey: PEM };
  const jwt = createAppleClientSecret(config, CLIENT_ID, NOW);
  const [head, body, signature] = jwt.split(".");

  assert.deepEqual(JSON.parse(Buffer.from(head, "base64url")), {
    alg: "ES256",
    kid: "KEY1234567",
  });
  const claims = JSON.parse(Buffer.from(body, "base64url"));
  assert.equal(claims.iss, "TEAM123456");
  assert.equal(claims.sub, CLIENT_ID);
  assert.equal(claims.aud, "https://appleid.apple.com");
  assert.equal(claims.iat, Math.floor(NOW / 1000));
  assert.equal(claims.exp - claims.iat, 300);

  const valid = createVerify("SHA256")
    .update(`${head}.${body}`)
    .verify({ key: publicKey, dsaEncoding: "ieee-p1363" }, Buffer.from(signature, "base64url"));
  assert.equal(valid, true);
});

test("exchanges the code, then revokes the refresh token", async () => {
  const { calls, fetchImpl } = recorder([ok({ refresh_token: "r-1", access_token: "a-1" }), ok({})]);
  const result = await revokeAppleAuthorization("code-1", { fetchImpl, now: NOW });

  assert.deepEqual(result, { status: "revoked" });
  assert.equal(calls.length, 2);
  assert.equal(calls[0].url, "https://appleid.apple.com/auth/token");
  assert.equal(calls[0].fields.code, "code-1");
  assert.equal(calls[0].fields.grant_type, "authorization_code");
  assert.equal(calls[0].fields.client_id, CLIENT_ID);
  assert.equal(calls[1].url, "https://appleid.apple.com/auth/revoke");
  assert.equal(calls[1].fields.token, "r-1");
  assert.equal(calls[1].fields.token_type_hint, "refresh_token");
});

test("falls back to the access token when Apple sends no refresh token", async () => {
  const { calls, fetchImpl } = recorder([ok({ access_token: "a-1" }), ok({})]);
  const result = await revokeAppleAuthorization("code-1", { fetchImpl, now: NOW });
  assert.deepEqual(result, { status: "revoked" });
  assert.equal(calls[1].fields.token_type_hint, "access_token");
});

test("does nothing until the Apple key is configured", async () => {
  delete process.env.APPLE_PRIVATE_KEY;
  const { calls, fetchImpl } = recorder([]);
  assert.equal(isAppleRevocationConfigured(), false);
  assert.deepEqual(await revokeAppleAuthorization("code-1", { fetchImpl }), {
    status: "not_configured",
  });
  assert.equal(calls.length, 0);
});

test("accepts a key whose line breaks were escaped", async () => {
  process.env.APPLE_PRIVATE_KEY = PEM.replace(/\n/g, "\\n");
  const { fetchImpl } = recorder([ok({ refresh_token: "r-1" }), ok({})]);
  assert.deepEqual(await revokeAppleAuthorization("code-1", { fetchImpl, now: NOW }), {
    status: "revoked",
  });
});

test("reports failure without throwing when Apple refuses the code", async () => {
  const { calls, fetchImpl } = recorder([fail(400)]);
  const result = await revokeAppleAuthorization("used-code", { fetchImpl, now: NOW });
  assert.deepEqual(result, { status: "failed", reason: "token exchange 400" });
  assert.equal(calls.length, 1);
});

test("reports failure without throwing when the network drops", async () => {
  const fetchImpl = async () => {
    throw new Error("socket hang up");
  };
  const result = await revokeAppleAuthorization("code-1", { fetchImpl, now: NOW });
  assert.deepEqual(result, { status: "failed", reason: "socket hang up" });
});
