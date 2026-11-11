/**
 * Identity for the iOS app's API calls.
 *
 * The app proves who it is once with a Sign in with Apple identity token, and gets back a
 * Dozy session token it sends as `Authorization: Bearer …` on the Junction routes.
 *
 * Only node built-ins are imported here so the module can be exercised with `node --test`.
 */
import {
  createHmac,
  createPublicKey,
  timingSafeEqual,
  verify as verifySignature,
} from "node:crypto";

const APPLE_ISSUER = "https://appleid.apple.com";
const APPLE_KEYS_URL = "https://appleid.apple.com/auth/keys";
const DEFAULT_BUNDLE_ID = "charvibansall.dozy";

const APPLE_KEY_CACHE_MS = 60 * 60 * 1000;
const APPLE_KEY_MIN_REFETCH_MS = 60 * 1000;
const CLOCK_LEEWAY_MS = 60 * 1000;

const SESSION_PREFIX = "dz1";
// Keeps app session signatures distinct from the entitlement cookie, which shares the secret.
const SESSION_CONTEXT = "dozy-app-session.v1.";
export const APP_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 90;

export type AppleJwk = {
  kty?: string;
  kid?: string;
  alg?: string;
  n?: string;
  e?: string;
  [key: string]: unknown;
};

export type AppleKeyFetcher = () => Promise<AppleJwk[]>;

export type AppleTokenResult =
  | { ok: true; userId: string }
  | { ok: false; reason: string };

let appleKeyCache: { keys: AppleJwk[]; fetchedAt: number } | null = null;

async function fetchAppleKeys(): Promise<AppleJwk[]> {
  const response = await fetch(APPLE_KEYS_URL, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Apple key fetch failed (${response.status})`);
  }
  const body = (await response.json()) as { keys?: AppleJwk[] };
  return body.keys ?? [];
}

async function resolveAppleKey(
  kid: string,
  fetchKeys: AppleKeyFetcher | undefined,
): Promise<AppleJwk | null> {
  if (fetchKeys) {
    return (await fetchKeys()).find((key) => key.kid === kid) ?? null;
  }

  const now = Date.now();
  if (appleKeyCache) {
    const age = now - appleKeyCache.fetchedAt;
    const hit = appleKeyCache.keys.find((key) => key.kid === kid);
    if (hit && age < APPLE_KEY_CACHE_MS) return hit;
    // Apple rotates keys, so an unknown kid triggers a refetch, but not more than once a minute.
    if (!hit && age < APPLE_KEY_MIN_REFETCH_MS) return null;
  }

  const keys = await fetchAppleKeys();
  appleKeyCache = { keys, fetchedAt: now };
  return keys.find((key) => key.kid === kid) ?? null;
}

function parseSegment(segment: string): Record<string, unknown> | null {
  try {
    const parsed: unknown = JSON.parse(
      Buffer.from(segment, "base64url").toString("utf8"),
    );
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

export function getAllowedAppleAudiences(): string[] {
  const configured = (process.env.APPLE_BUNDLE_ID || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return configured.length ? configured : [DEFAULT_BUNDLE_ID];
}

/**
 * Verify a Sign in with Apple identity token: Apple's RS256 signature, issuer, audience
 * (the app's bundle id), and expiry. Returns the stable Apple user id (`sub`).
 */
export async function verifyAppleIdentityToken(
  token: string,
  options: {
    fetchKeys?: AppleKeyFetcher;
    now?: number;
    audiences?: string[];
  } = {},
): Promise<AppleTokenResult> {
  const parts = token.split(".");
  if (parts.length !== 3 || parts.some((part) => !part)) {
    return { ok: false, reason: "malformed token" };
  }
  const [headerSegment, payloadSegment, signatureSegment] = parts;

  const header = parseSegment(headerSegment);
  if (!header || header.alg !== "RS256" || typeof header.kid !== "string") {
    return { ok: false, reason: "unsupported token header" };
  }

  const jwk = await resolveAppleKey(header.kid, options.fetchKeys);
  if (!jwk || jwk.kty !== "RSA") {
    return { ok: false, reason: "unknown signing key" };
  }

  let signatureValid = false;
  try {
    signatureValid = verifySignature(
      "RSA-SHA256",
      Buffer.from(`${headerSegment}.${payloadSegment}`),
      createPublicKey({ key: jwk, format: "jwk" }),
      Buffer.from(signatureSegment, "base64url"),
    );
  } catch {
    signatureValid = false;
  }
  if (!signatureValid) {
    return { ok: false, reason: "bad signature" };
  }

  const payload = parseSegment(payloadSegment);
  if (!payload) {
    return { ok: false, reason: "malformed payload" };
  }
  if (payload.iss !== APPLE_ISSUER) {
    return { ok: false, reason: "wrong issuer" };
  }

  const allowed = options.audiences ?? getAllowedAppleAudiences();
  const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!audiences.some((aud) => typeof aud === "string" && allowed.includes(aud))) {
    return { ok: false, reason: "wrong audience" };
  }

  const now = options.now ?? Date.now();
  if (typeof payload.exp !== "number" || payload.exp * 1000 + CLOCK_LEEWAY_MS < now) {
    return { ok: false, reason: "expired" };
  }

  if (typeof payload.sub !== "string" || !payload.sub) {
    return { ok: false, reason: "missing subject" };
  }
  return { ok: true, userId: payload.sub };
}

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET || process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    throw new Error("SESSION_SECRET or STRIPE_SECRET_KEY is required for sessions");
  }
  return secret;
}

function signSessionBody(body: string): string {
  return createHmac("sha256", getSessionSecret())
    .update(SESSION_CONTEXT + body)
    .digest("base64url");
}

export function issueAppSession(
  userId: string,
  now: number = Date.now(),
): { token: string; expiresAt: number } {
  const expiresAt = now + APP_SESSION_MAX_AGE_SECONDS * 1000;
  const body = Buffer.from(
    JSON.stringify({ sub: userId, exp: expiresAt }),
    "utf8",
  ).toString("base64url");
  return {
    token: `${SESSION_PREFIX}.${body}.${signSessionBody(body)}`,
    expiresAt,
  };
}

/** Returns the Apple user id the session was issued for, or null if it is not valid. */
export function verifyAppSession(
  token: string,
  now: number = Date.now(),
): string | null {
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== SESSION_PREFIX) return null;
  const [, body, signature] = parts;
  if (!body || !signature) return null;

  const expected = Buffer.from(signSessionBody(body));
  const actual = Buffer.from(signature);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return null;
  }

  const payload = parseSegment(body);
  if (!payload) return null;
  if (typeof payload.exp !== "number" || payload.exp < now) return null;
  if (typeof payload.sub !== "string" || !payload.sub) return null;
  return payload.sub;
}

/**
 * Production always requires a session. Sandbox stays open until JUNCTION_REQUIRE_AUTH=true,
 * so app builds that do not send a session yet keep working against test data.
 */
export function isJunctionAuthRequired(): boolean {
  const environment = (process.env.JUNCTION_ENVIRONMENT || "sandbox").toLowerCase();
  if (environment === "production" || environment === "prod") return true;
  const flag = (process.env.JUNCTION_REQUIRE_AUTH || "").toLowerCase();
  return flag === "true" || flag === "1";
}

export type CallerCheck =
  | { ok: true; authenticated: boolean }
  | { ok: false; status: 401 | 403; error: string };

/** Decide whether a request may act on `clientUserId`, given its Authorization header. */
export function checkJunctionCaller(
  authorizationHeader: string | null,
  clientUserId: string,
): CallerCheck {
  const match = /^Bearer\s+(\S+)$/i.exec((authorizationHeader || "").trim());

  if (!match) {
    if (isJunctionAuthRequired()) {
      return { ok: false, status: 401, error: "Sign in required" };
    }
    return { ok: true, authenticated: false };
  }

  const userId = verifyAppSession(match[1]);
  if (!userId) {
    return { ok: false, status: 401, error: "Session is invalid or expired" };
  }
  if (userId !== clientUserId) {
    return { ok: false, status: 403, error: "Session does not match clientUserId" };
  }
  return { ok: true, authenticated: true };
}
