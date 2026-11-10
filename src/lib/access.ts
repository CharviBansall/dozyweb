import { redirect } from "next/navigation";
import {
  recordIsEntitled,
  resolveEntitlement,
  type EntitlementRecord,
} from "@/lib/entitlements";
import { clearSessionCookie, readSession } from "@/lib/session";

export async function requireEntitlement(): Promise<EntitlementRecord> {
  const session = await readSession();
  if (!session) {
    redirect("/subscribe");
  }

  const record = await resolveEntitlement({
    customerId: session.customerId,
    email: session.email,
  });

  if (!recordIsEntitled(record) || !record) {
    // Cookie writes are only allowed in Route Handlers / Server Actions.
    // Best-effort clear; never throw during RSC render (that surfaces as a
    // generic "Application error" on /app after Checkout).
    try {
      await clearSessionCookie();
    } catch {
      // ignore — redirect still gates access
    }
    redirect("/subscribe?reason=expired");
  }

  // Do not refresh the session cookie here — setSessionCookie during layout/page
  // render throws in production Next.js. Cookie is set by /api/checkout/complete.
  return record;
}

export async function getOptionalEntitlement(): Promise<EntitlementRecord | null> {
  const session = await readSession();
  if (!session) return null;

  try {
    const record = await resolveEntitlement({
      customerId: session.customerId,
      email: session.email,
    });
    if (!recordIsEntitled(record) || !record) {
      return null;
    }
    return record;
  } catch {
    return null;
  }
}
