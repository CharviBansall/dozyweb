import { NextResponse } from "next/server";
import { recordIsEntitled, resolveEntitlement } from "@/lib/entitlements";
import { clearSessionCookie, readSession, setSessionCookie } from "@/lib/session";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await readSession();
    if (!session) {
      return NextResponse.json({ entitled: false, reason: "no_session" });
    }

    const record = await resolveEntitlement({
      customerId: session.customerId,
      email: session.email,
    });

    if (!recordIsEntitled(record) || !record) {
      await clearSessionCookie();
      return NextResponse.json({
        entitled: false,
        status: record?.status ?? "none",
        reason: "not_subscribed",
      });
    }

    await setSessionCookie(record);

    return NextResponse.json({
      entitled: true,
      status: record.status,
      email: record.email,
      customerId: record.stripeCustomerId,
      subscriptionId: record.stripeSubscriptionId,
      currentPeriodEnd: record.currentPeriodEnd,
      cancelAtPeriodEnd: record.cancelAtPeriodEnd,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Entitlement check failed";
    console.error("[entitlement]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
