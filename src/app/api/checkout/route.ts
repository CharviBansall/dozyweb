import { NextResponse } from "next/server";
import {
  getAppUrl,
  getStripe,
  getStripePriceId,
  randomIntegrationSuffix,
} from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      email?: string;
    };

    const stripe = getStripe();
    const priceId = getStripePriceId();
    const appUrl = getAppUrl();
    const email = body.email?.trim().toLowerCase() || undefined;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      // Omit payment_method_types — enable dynamic payment methods from Dashboard.
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cancel`,
      ...(email ? { customer_email: email } : {}),
      allow_promotion_codes: true,
      client_reference_id: email,
      subscription_data: {
        trial_period_days: 3,
        metadata: {
          product: "dozy_pro",
          source: "web",
        },
      },
      metadata: {
        product: "dozy_pro",
        source: "web",
      },
      integration_identifier: `dozy_web_sub_${randomIntegrationSuffix()}`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Checkout session missing redirect URL" },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    console.error("[checkout]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
