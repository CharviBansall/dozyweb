import { NextResponse } from "next/server";
import type Stripe from "stripe";
import {
  revokeEntitlement,
  upsertEntitlementFromSubscription,
} from "@/lib/entitlements";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

async function fulfillCheckoutSession(session: Stripe.Checkout.Session) {
  if (session.mode !== "subscription") return;

  // Gate on payment_status for paid + async methods; trials may be no_payment_required.
  if (
    session.payment_status !== "paid" &&
    session.payment_status !== "no_payment_required"
  ) {
    return;
  }

  const stripe = getStripe();
  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  if (!subscriptionId) {
    console.warn("[webhook] checkout.session missing subscription", session.id);
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const email =
    session.customer_details?.email ??
    session.customer_email ??
    session.client_reference_id;

  await upsertEntitlementFromSubscription(subscription, email);
}

async function syncSubscription(subscription: Stripe.Subscription) {
  await upsertEntitlementFromSubscription(subscription);
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  const stripe = getStripe();
  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid signature";
    console.error("[webhook] signature verification failed", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        await fulfillCheckoutSession(event.data.object as Stripe.Checkout.Session);
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.created": {
        await syncSubscription(event.data.object as Stripe.Subscription);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;
        await upsertEntitlementFromSubscription(subscription);
        await revokeEntitlement(customerId, "canceled");
        break;
      }
      case "invoice.paid":
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionRef =
          invoice.parent?.subscription_details?.subscription ??
          (invoice as Stripe.Invoice & { subscription?: string | Stripe.Subscription | null })
            .subscription;

        const subscriptionId =
          typeof subscriptionRef === "string"
            ? subscriptionRef
            : subscriptionRef && typeof subscriptionRef === "object"
              ? subscriptionRef.id
              : null;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          await syncSubscription(subscription);
        }
        break;
      }
      case "charge.refunded":
      case "charge.dispute.created":
      case "radar.early_fraud_warning.created": {
        // Resolve affected customer → refresh subscription entitlement from Stripe.
        const obj = event.data.object as {
          customer?: string | { id: string } | null;
        };
        const customerId =
          typeof obj.customer === "string"
            ? obj.customer
            : obj.customer && typeof obj.customer === "object"
              ? obj.customer.id
              : null;

        if (customerId) {
          const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: "all",
            limit: 5,
          });
          for (const sub of subscriptions.data) {
            await syncSubscription(sub);
          }
        }
        break;
      }
      default:
        break;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Handler failed";
    console.error(`[webhook] handler error for ${event.type}`, message);
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
