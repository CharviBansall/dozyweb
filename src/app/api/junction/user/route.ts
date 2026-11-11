import { NextResponse } from "next/server";
import { checkJunctionCaller } from "@/lib/app-auth";
import { ensureJunctionUser } from "@/lib/junction";
import {
  getMappedJunctionUserId,
  saveJunctionUserMapping,
} from "@/lib/junction-users";

export const runtime = "nodejs";

/**
 * Ensure a Junction user exists for this Dozy client user id
 * (typically the Sign in with Apple `user` identifier — not email).
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { clientUserId?: string };
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

    const existing = await getMappedJunctionUserId(clientUserId);
    const user = await ensureJunctionUser(clientUserId);
    await saveJunctionUserMapping(clientUserId, user.user_id);

    return NextResponse.json({
      clientUserId,
      junctionUserId: user.user_id,
      reusedMapping: Boolean(existing),
      connectedSources: user.connected_sources ?? [],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "User create failed";
    console.error("[junction/user]", message, error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
