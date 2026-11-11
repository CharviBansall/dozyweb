import { NextResponse } from "next/server";
import { checkJunctionCaller } from "@/lib/app-auth";
import {
  createLinkToken,
  DOZY_JUNCTION_PROVIDERS,
  ensureJunctionUser,
  type JunctionProviderSlug,
} from "@/lib/junction";
import { saveJunctionUserMapping } from "@/lib/junction-users";
import { getAppUrl } from "@/lib/stripe";

export const runtime = "nodejs";

/**
 * Create a Junction Link token so the iOS app can open the provider connect widget.
 * Default filter: oura, garmin, whoop_v2.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      clientUserId?: string;
      provider?: JunctionProviderSlug;
      redirectUrl?: string;
    };

    const clientUserId = body.clientUserId?.trim();
    if (!clientUserId) {
      return NextResponse.json(
        { error: "clientUserId required" },
        { status: 400 },
      );
    }

    const caller = checkJunctionCaller(
      request.headers.get("authorization"),
      clientUserId,
    );
    if (!caller.ok) {
      return NextResponse.json({ error: caller.error }, { status: caller.status });
    }

    const user = await ensureJunctionUser(clientUserId);
    await saveJunctionUserMapping(clientUserId, user.user_id);

    const redirectUrl =
      body.redirectUrl?.trim() ||
      `${getAppUrl()}/junction/connected`;

    const token = await createLinkToken({
      userId: user.user_id,
      provider: body.provider,
      redirectUrl,
      filterOnProviders: body.provider ? undefined : DOZY_JUNCTION_PROVIDERS,
    });

    return NextResponse.json({
      clientUserId,
      junctionUserId: user.user_id,
      linkToken: token.link_token || token.linkToken,
      linkWebUrl: token.link_web_url || token.linkWebUrl,
      providers: body.provider ? [body.provider] : DOZY_JUNCTION_PROVIDERS,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Link token create failed";
    console.error("[junction/link-token]", message, error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
