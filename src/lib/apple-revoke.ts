import { createPrivateKey, createSign } from "node:crypto";

/**
 * Revoking Sign in with Apple when an account is deleted.
 *
 * Apple asks apps that offer account deletion to revoke the user's tokens too, so
 * Dozy disappears from the user's "Sign in with Apple" list. That takes a key from
 * the Apple Developer account:
 *
 *   APPLE_TEAM_ID      the 10-character team id
 *   APPLE_KEY_ID       the id of a key with "Sign in with Apple" enabled
 *   APPLE_PRIVATE_KEY  the contents of that key's .p8 file
 *
 * Dozy stores no Apple tokens, so the app sends a fresh authorization code with the
 * delete request; it is swapped for a refresh token, which is revoked straight away.
 */

const APPLE_AUDIENCE = "https://appleid.apple.com";
const TOKEN_URL = "https://appleid.apple.com/auth/token";
const REVOKE_URL = "https://appleid.apple.com/auth/revoke";
const CLIENT_SECRET_LIFETIME_SECONDS = 5 * 60;

export type AppleRevocation =
  | { status: "revoked" }
  | { status: "not_configured" }
  | { status: "failed"; reason: string };

type FetchLike = (
  url: string,
  init: { method: string; headers: Record<string, string>; body: string },
) => Promise<{ ok: boolean; status: number; json: () => Promise<unknown> }>;

type AppleConfig = { teamId: string; keyId: string; privateKey: string };

function readConfig(): AppleConfig | null {
  const teamId = (process.env.APPLE_TEAM_ID || "").trim();
  const keyId = (process.env.APPLE_KEY_ID || "").trim();
  // Env editors often turn the .p8 file's line breaks into literal "\n".
  const privateKey = (process.env.APPLE_PRIVATE_KEY || "")
    .replace(/\\n/g, "\n")
    .trim();
  if (!teamId || !keyId || !privateKey) return null;
  return { teamId, keyId, privateKey };
}

/** The app's bundle id, which is its Sign in with Apple client id. */
function defaultClientId(): string {
  const configured = (process.env.APPLE_BUNDLE_ID || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return configured[0] ?? "charvibansall.dozy";
}

export function isAppleRevocationConfigured(): boolean {
  return readConfig() !== null;
}

const b64 = (value: unknown) =>
  Buffer.from(JSON.stringify(value)).toString("base64url");

/** The short-lived ES256 JWT Apple accepts as a client secret. */
export function createAppleClientSecret(
  config: AppleConfig,
  clientId: string,
  now: number = Date.now(),
): string {
  const issuedAt = Math.floor(now / 1000);
  const head = b64({ alg: "ES256", kid: config.keyId });
  const body = b64({
    iss: config.teamId,
    iat: issuedAt,
    exp: issuedAt + CLIENT_SECRET_LIFETIME_SECONDS,
    aud: APPLE_AUDIENCE,
    sub: clientId,
  });
  const signature = createSign("SHA256")
    .update(`${head}.${body}`)
    // JWTs carry the raw r||s signature, not the DER form OpenSSL produces by default.
    .sign({ key: createPrivateKey(config.privateKey), dsaEncoding: "ieee-p1363" })
    .toString("base64url");
  return `${head}.${body}.${signature}`;
}

const form = (fields: Record<string, string>) =>
  new URLSearchParams(fields).toString();

/**
 * Swap the authorization code for a refresh token and revoke it.
 * Never throws: deleting the account must not depend on Apple answering.
 */
export async function revokeAppleAuthorization(
  authorizationCode: string,
  options: { fetchImpl?: FetchLike; now?: number; clientId?: string } = {},
): Promise<AppleRevocation> {
  const config = readConfig();
  if (!config) return { status: "not_configured" };

  const fetchImpl = options.fetchImpl ?? (fetch as unknown as FetchLike);
  const clientId = options.clientId ?? defaultClientId();
  const headers = { "Content-Type": "application/x-www-form-urlencoded" };

  try {
    const clientSecret = createAppleClientSecret(config, clientId, options.now);

    const exchange = await fetchImpl(TOKEN_URL, {
      method: "POST",
      headers,
      body: form({
        client_id: clientId,
        client_secret: clientSecret,
        code: authorizationCode,
        grant_type: "authorization_code",
      }),
    });
    if (!exchange.ok) {
      return { status: "failed", reason: `token exchange ${exchange.status}` };
    }
    const tokens = (await exchange.json()) as {
      refresh_token?: unknown;
      access_token?: unknown;
    };
    const refreshToken =
      typeof tokens.refresh_token === "string" ? tokens.refresh_token : null;
    const accessToken =
      typeof tokens.access_token === "string" ? tokens.access_token : null;
    const token = refreshToken ?? accessToken;
    if (!token) return { status: "failed", reason: "no token returned" };

    const revoke = await fetchImpl(REVOKE_URL, {
      method: "POST",
      headers,
      body: form({
        client_id: clientId,
        client_secret: clientSecret,
        token,
        token_type_hint: refreshToken ? "refresh_token" : "access_token",
      }),
    });
    if (!revoke.ok) {
      return { status: "failed", reason: `revoke ${revoke.status}` };
    }
    return { status: "revoked" };
  } catch (error) {
    return {
      status: "failed",
      reason: error instanceof Error ? error.message : "unknown error",
    };
  }
}
