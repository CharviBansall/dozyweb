import { NextResponse } from "next/server";
import { checkJunctionCaller } from "@/lib/app-auth";
import {
  JUNCTION_DEMO_PROVIDERS,
  connectDemoProvider,
  ensureJunctionUser,
  type JunctionDemoProviderSlug,
} from "@/lib/junction";
import { saveJunctionUserMapping } from "@/lib/junction-users";

export const runtime = "nodejs";

/**
 * Sandbox-only: attach a synthetic provider (Oura / Whoop / …) with no real account.
 * Garmin is not offered as a Junction demo provider — use real Link OAuth for Garmin.
 */
export async function POST(request: Request) {
  try {
    const env = (process.env.JUNCTION_ENVIRONMENT || "sandbox").toLowerCase();
    if (env === "production" || env === "prod") {
      return NextResponse.json(
        { error: "Demo connections are sandbox-only" },
        { status: 403 },
      );
    }

    const body = (await request.json()) as {
      clientUserId?: string;
      provider?: string;
    };

    const clientUserId = body.clientUserId?.trim();
    const provider = body.provider?.trim() as JunctionDemoProviderSlug | undefined;

    if (!clientUserId) {
      return NextResponse.json(
        { error: "clientUserId required" },
        { status: 400 },
      );
    }
    if (!provider || !JUNCTION_DEMO_PROVIDERS.includes(provider)) {
      return NextResponse.json(
        {
          error: `provider must be one of: ${JUNCTION_DEMO_PROVIDERS.join(", ")}`,
        },
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

    const result = await connectDemoProvider({
      userId: user.user_id,
      provider,
    });

    return NextResponse.json({
      clientUserId,
      junctionUserId: user.user_id,
      provider,
      ...result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Demo connect failed";
    console.error("[junction/demo-connect]", message, error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
