import { NextResponse } from "next/server";
import { resolveEntitlement } from "@/lib/entitlements";
import { readSession } from "@/lib/session";
import { getAppUrl, getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST() {
  try {
    const session = await readSession();
    if (!session?.customerId) {
      return NextResponse.json(
        { error: "No active billing session. Subscribe first." },
        { status: 401 },
      );
    }

    const entitlement = await resolveEntitlement({
      customerId: session.customerId,
      email: session.email,
    });

    if (!entitlement?.stripeCustomerId) {
      return NextResponse.json(
        { error: "No Stripe customer found for this session." },
        { status: 404 },
      );
    }

    const stripe = getStripe();
    const appUrl = getAppUrl();

    const portal = await stripe.billingPortal.sessions.create({
      customer: entitlement.stripeCustomerId,
      return_url: `${appUrl}/app`,
    });

    return NextResponse.json({ url: portal.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Portal failed";
    console.error("[portal]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
