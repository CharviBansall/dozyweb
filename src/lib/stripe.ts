import Stripe from "stripe";

/**
 * Shared Stripe client (instance pattern — never set a global api_key).
 * Prefer a restricted key (rk_…) in production over a secret key (sk_…).
 */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }

  return new Stripe(key, {
    apiVersion: "2026-10-28.endive",
    typescript: true,
    appInfo: {
      name: "Dozy Web",
      version: "0.1.0",
      url: "https://www.appdozy.com",
    },
  });
}

export function getStripePriceId(): string {
  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId) {
    throw new Error("STRIPE_PRICE_ID is not set");
  }
  return priceId;
}

export function getAppUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL;

  if (!url) {
    return "http://localhost:3000";
  }

  return url.startsWith("http") ? url.replace(/\/$/, "") : `https://${url.replace(/\/$/, "")}`;
}

/** Active / trialing grants access (mirrors iOS paid entitlement intent). */
export function isEntitledStatus(
  status: Stripe.Subscription.Status | string | null | undefined,
): boolean {
  return status === "active" || status === "trialing";
}

export function randomIntegrationSuffix(length = 8): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}
