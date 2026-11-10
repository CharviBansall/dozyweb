import { NextResponse } from "next/server";
import {
  recordIsEntitled,
  resolveEntitlement,
  upsertEntitlementFromSubscription,
} from "@/lib/entitlements";
import { setSessionCookie } from "@/lib/session";
import { getStripe, isEntitledStatus } from "@/lib/stripe";
import type Stripe from "stripe";

export const runtime = "nodejs";

/**
 * Success-page helper: sync local entitlement + set session cookie.
 * Authoritative fulfillment still happens in the Stripe webhook handler.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { sessionId?: string };
    if (!body.sessionId) {
      return NextResponse.json({ error: "sessionId required" }, { status: 400 });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(body.sessionId, {
      expand: ["subscription", "customer"],
    });

    if (session.mode !== "subscription") {
      return NextResponse.json({ error: "Not a subscription session" }, { status: 400 });
    }

    const customerId =
      typeof session.customer === "string"
        ? session.customer
        : session.customer && !session.customer.deleted
          ? session.customer.id
          : null;

    const email =
      session.customer_details?.email ??
      session.customer_email ??
      (typeof session.customer !== "string" &&
      session.customer &&
      !session.customer.deleted
        ? session.customer.email
        : null);

    let record = null;

    if (session.subscription) {
      const subscription =
        typeof session.subscription === "string"
          ? await stripe.subscriptions.retrieve(session.subscription)
          : (session.subscription as Stripe.Subscription);

      if (
        session.payment_status === "paid" ||
        session.payment_status === "no_payment_required" ||
        isEntitledStatus(subscription.status)
      ) {
        record = await upsertEntitlementFromSubscription(subscription, email);
      }
    }

    if (!record && customerId) {
      record = await resolveEntitlement({ customerId, email });
    }

    if (!recordIsEntitled(record) || !record) {
      return NextResponse.json(
        {
          entitled: false,
          paymentStatus: session.payment_status,
          message: "Subscription not active yet — webhook may still be processing.",
        },
        { status: 202 },
      );
    }

    await setSessionCookie(record);

    return NextResponse.json({
      entitled: true,
      status: record.status,
      email: record.email,
      customerId: record.stripeCustomerId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Complete failed";
    console.error("[checkout/complete]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
