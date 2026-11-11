import { NextResponse } from "next/server";
import { ensureJunctionUser, getSleepSummaries } from "@/lib/junction";
import {
  getMappedJunctionUserId,
  saveJunctionUserMapping,
} from "@/lib/junction-users";

export const runtime = "nodejs";

/**
 * Fetch normalized sleep summaries for a Dozy client user from Junction.
 * Query: clientUserId, startDate (YYYY-MM-DD), optional endDate, optional provider.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientUserId = searchParams.get("clientUserId")?.trim();
    const startDate = searchParams.get("startDate")?.trim();
    const endDate = searchParams.get("endDate")?.trim() || undefined;
    const provider = searchParams.get("provider")?.trim() || undefined;

    if (!clientUserId || !startDate) {
      return NextResponse.json(
        { error: "clientUserId and startDate are required" },
        { status: 400 },
      );
    }

    let junctionUserId = await getMappedJunctionUserId(clientUserId);
    if (!junctionUserId) {
      const user = await ensureJunctionUser(clientUserId);
      junctionUserId = user.user_id;
      await saveJunctionUserMapping(clientUserId, junctionUserId);
    }

    const data = await getSleepSummaries({
      userId: junctionUserId,
      startDate,
      endDate,
      provider,
    });

    return NextResponse.json({
      clientUserId,
      junctionUserId,
      sleep: data.sleep ?? [],
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Sleep fetch failed";
    console.error("[junction/sleep]", message, error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
