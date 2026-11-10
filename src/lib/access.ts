import { redirect } from "next/navigation";
import {
  recordIsEntitled,
  resolveEntitlement,
  type EntitlementRecord,
} from "@/lib/entitlements";
import { clearSessionCookie, readSession, setSessionCookie } from "@/lib/session";

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
    await clearSessionCookie();
    redirect("/subscribe?reason=expired");
  }

  await setSessionCookie(record);
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
