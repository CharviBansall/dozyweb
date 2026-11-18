import { NextResponse } from "next/server";
import { requireAppSession } from "@/lib/app-auth";
import { deleteJunctionUser, findJunctionUserId } from "@/lib/junction";
import {
  getMappedJunctionUserId,
  removeJunctionUserMapping,
} from "@/lib/junction-users";

export const runtime = "nodejs";

/**
 * Delete the signed-in user's Dozy account.
 *
 * Dozy keeps no user table: a "user" on the server is the tracker link held by
 * Junction, plus a cached id mapping. Deleting the account removes both, which
 * disconnects Oura/Garmin/Whoop and erases the sleep data Junction pulled.
 * Always requires a session, so one user can never delete another.
 */
export async function DELETE(request: Request) {
  const userId = requireAppSession(request.headers.get("authorization"));
  if (!userId) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  try {
    let hadTrackerData = false;
    if (process.env.JUNCTION_API_KEY) {
      const junctionUserId =
        (await getMappedJunctionUserId(userId)) ??
        (await findJunctionUserId(userId));
      if (junctionUserId) {
        await deleteJunctionUser(junctionUserId);
        hadTrackerData = true;
      }
    }
    await removeJunctionUserMapping(userId);

    return NextResponse.json({ deleted: true, hadTrackerData });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete failed";
    console.error("[account/delete]", message, error);
    return NextResponse.json(
      { error: "Couldn't delete the account. Please try again." },
      { status: 500 },
    );
  }
}
