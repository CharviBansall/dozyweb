import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type Stripe from "stripe";
import { getStripe, isEntitledStatus } from "@/lib/stripe";

export type EntitlementRecord = {
  email: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string | null;
  status: Stripe.Subscription.Status | "none";
  priceId: string | null;
  currentPeriodEnd: number | null;
  cancelAtPeriodEnd: boolean;
  updatedAt: string;
};

type EntitlementStore = {
  byCustomerId: Record<string, EntitlementRecord>;
  byEmail: Record<string, string>;
};

const STORE_PATH = path.join(process.cwd(), ".data", "entitlements.json");

declare global {
  var __dozyEntitlementCache: EntitlementStore | undefined;
}

function emptyStore(): EntitlementStore {
  return { byCustomerId: {}, byEmail: {} };
}

async function readStore(): Promise<EntitlementStore> {
  if (globalThis.__dozyEntitlementCache) {
    return globalThis.__dozyEntitlementCache;
  }

  try {
    const raw = await readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as EntitlementStore;
    globalThis.__dozyEntitlementCache = {
      byCustomerId: parsed.byCustomerId ?? {},
      byEmail: parsed.byEmail ?? {},
    };
    return globalThis.__dozyEntitlementCache;
  } catch {
    const store = emptyStore();
    globalThis.__dozyEntitlementCache = store;
    return store;
  }
}

async function writeStore(store: EntitlementStore): Promise<void> {
  globalThis.__dozyEntitlementCache = store;
  try {
    await mkdir(path.dirname(STORE_PATH), { recursive: true });
    await writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
  } catch {
    // Serverless filesystems may be read-only; in-memory + Stripe reconcile still work.
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function periodEnd(subscription: Stripe.Subscription): number | null {
  const itemEnd = subscription.items?.data?.[0]?.current_period_end;
  if (typeof itemEnd === "number") return itemEnd;
  const legacy = (subscription as Stripe.Subscription & { current_period_end?: number })
    .current_period_end;
  return typeof legacy === "number" ? legacy : null;
}

export async function upsertEntitlementFromSubscription(
  subscription: Stripe.Subscription,
  emailHint?: string | null,
): Promise<EntitlementRecord> {
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  let email = emailHint ? normalizeEmail(emailHint) : "";
  if (!email) {
    const stripe = getStripe();
    const customer = await stripe.customers.retrieve(customerId);
    if (!customer.deleted && customer.email) {
      email = normalizeEmail(customer.email);
    }
  }

  const priceId = subscription.items.data[0]?.price?.id ?? null;

  const record: EntitlementRecord = {
    email,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscription.id,
    status: subscription.status,
    priceId,
    currentPeriodEnd: periodEnd(subscription),
    cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
    updatedAt: new Date().toISOString(),
  };

  const store = await readStore();
  store.byCustomerId[customerId] = record;
  if (email) {
    store.byEmail[email] = customerId;
  }
  await writeStore(store);
  return record;
}

export async function revokeEntitlement(
  customerId: string,
  status: Stripe.Subscription.Status | "none" = "canceled",
): Promise<void> {
  const store = await readStore();
  const existing = store.byCustomerId[customerId];
  if (!existing) return;

  store.byCustomerId[customerId] = {
    ...existing,
    status,
    stripeSubscriptionId: existing.stripeSubscriptionId,
    updatedAt: new Date().toISOString(),
  };
  await writeStore(store);
}

export async function getEntitlementByCustomerId(
  customerId: string,
): Promise<EntitlementRecord | null> {
  const store = await readStore();
  return store.byCustomerId[customerId] ?? null;
}

export async function getEntitlementByEmail(
  email: string,
): Promise<EntitlementRecord | null> {
  const store = await readStore();
  const customerId = store.byEmail[normalizeEmail(email)];
  if (!customerId) return null;
  return store.byCustomerId[customerId] ?? null;
}

/** Durable check: local store first, then Stripe Subscriptions API. */
export async function resolveEntitlement(options: {
  customerId?: string | null;
  email?: string | null;
}): Promise<EntitlementRecord | null> {
  const { customerId, email } = options;

  if (customerId) {
    const local = await getEntitlementByCustomerId(customerId);
    if (local && isEntitledStatus(local.status)) {
      return local;
    }
  }

  if (email) {
    const local = await getEntitlementByEmail(email);
    if (local && isEntitledStatus(local.status)) {
      return local;
    }
  }

  if (!customerId && !email) {
    return null;
  }

  const stripe = getStripe();
  let resolvedCustomerId = customerId ?? null;

  if (!resolvedCustomerId && email) {
    const customers = await stripe.customers.list({
      email: normalizeEmail(email),
      limit: 1,
    });
    resolvedCustomerId = customers.data[0]?.id ?? null;
  }

  if (!resolvedCustomerId) {
    return null;
  }

  const subscriptions = await stripe.subscriptions.list({
    customer: resolvedCustomerId,
    status: "all",
    limit: 10,
  });

  const entitled =
    subscriptions.data.find((sub) => isEntitledStatus(sub.status)) ??
    subscriptions.data[0] ??
    null;

  if (!entitled) {
    return null;
  }

  return upsertEntitlementFromSubscription(entitled, email);
}

export function recordIsEntitled(record: EntitlementRecord | null | undefined): boolean {
  return Boolean(record && isEntitledStatus(record.status));
}
