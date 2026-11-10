import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { EntitlementRecord } from "@/lib/entitlements";

export const SESSION_COOKIE = "dozy_entitlement";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export type SessionPayload = {
  customerId: string;
  email: string;
  status: string;
  subscriptionId: string | null;
  exp: number;
};

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET || process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    throw new Error("SESSION_SECRET or STRIPE_SECRET_KEY is required for sessions");
  }
  return secret;
}

function encode(payload: SessionPayload): string {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = createHmac("sha256", getSessionSecret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function decode(token: string): SessionPayload | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;

  const expected = createHmac("sha256", getSessionSecret()).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload;
    if (!payload.customerId || !payload.exp || payload.exp < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function sessionFromEntitlement(record: EntitlementRecord): string {
  const payload: SessionPayload = {
    customerId: record.stripeCustomerId,
    email: record.email,
    status: record.status,
    subscriptionId: record.stripeSubscriptionId,
    exp: Date.now() + MAX_AGE_SECONDS * 1000,
  };
  return encode(payload);
}

export async function setSessionCookie(record: EntitlementRecord): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, sessionFromEntitlement(record), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function readSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return decode(token);
}

/** Edge-safe decode for middleware (uses Web Crypto-compatible Node crypto in Node runtime). */
export function readSessionFromToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  try {
    return decode(token);
  } catch {
    return null;
  }
}
