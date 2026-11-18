import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";

import { issueAppSession, requireAppSession } from "../src/lib/app-auth.ts";

const savedEnv = { ...process.env };
beforeEach(() => {
  process.env.SESSION_SECRET = "test-session-secret";
  // Sandbox lets anonymous callers through on the Junction routes; deletion must not.
  process.env.JUNCTION_ENVIRONMENT = "sandbox";
  delete process.env.JUNCTION_REQUIRE_AUTH;
});
afterEach(() => {
  process.env = { ...savedEnv };
});

test("returns the user id for a valid session", () => {
  const { token } = issueAppSession("google_123");
  assert.equal(requireAppSession(`Bearer ${token}`), "google_123");
});

test("refuses a missing header even in sandbox", () => {
  assert.equal(requireAppSession(null), null);
  assert.equal(requireAppSession(""), null);
});

test("refuses a tampered session", () => {
  const { token } = issueAppSession("google_123");
  const other = issueAppSession("google_999").token;
  const forged = `${other.split(".").slice(0, 2).join(".")}.${token.split(".")[2]}`;
  assert.equal(requireAppSession(`Bearer ${forged}`), null);
});

test("refuses an expired session", () => {
  const longAgo = Date.now() - 1000 * 60 * 60 * 24 * 365;
  const { token } = issueAppSession("google_123", longAgo);
  assert.equal(requireAppSession(`Bearer ${token}`), null);
});

test("refuses a token that is not a bearer token", () => {
  const { token } = issueAppSession("google_123");
  assert.equal(requireAppSession(token), null);
});
