import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Junction sleep webhook receiver.
 * Configure in Junction Dashboard → Webhooks:
 *   https://www.appdozy.com/api/webhooks/junction
 * Events: daily.data.sleep.created, daily.data.sleep.updated
 *
 * Signature verification can be added once JUNCTION_WEBHOOK_SECRET is set.
 * For now we acknowledge and log so sandbox wiring can be tested end-to-end.
 */
export async function POST(request: Request) {
  const secret = process.env.JUNCTION_WEBHOOK_SECRET;
  const payload = await request.text();

  if (secret) {
    const header =
      request.headers.get("x-vital-signature") ||
      request.headers.get("svix-signature") ||
      request.headers.get("x-junction-signature");
    if (!header) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }
    // Full HMAC verification depends on Junction's current signing scheme;
    // keep the secret gate so misconfigured endpoints fail closed once set.
  }

  let event: { event_type?: string; user_id?: string; client_user_id?: string } =
    {};
  try {
    event = JSON.parse(payload) as typeof event;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  console.info("[junction/webhook]", {
    eventType: event.event_type,
    userId: event.user_id,
    clientUserId: event.client_user_id,
  });

  // Future: upsert sleep into durable store and/or push silent APNs to refresh iOS.
  return NextResponse.json({ received: true });
}
