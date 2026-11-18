import { NextResponse } from "next/server";
import { GOOGLE_USER_PREFIX, requireAppSession } from "@/lib/app-auth";
import { revokeAppleAuthorization } from "@/lib/apple-revoke";
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
 *
 * An Apple user's app also sends `{ "appleAuthorizationCode": "…" }`, which is used
 * to revoke Sign in with Apple for Dozy. Revocation is best effort: the account is
 * deleted whether or not Apple answers.
 */
export async function DELETE(request: Request) {
  const userId = requireAppSession(request.headers.get("authorization"));
  if (!userId) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  let appleAuthorizationCode: string | null = null;
  try {
    const body = (await request.json()) as { appleAuthorizationCode?: unknown };
    if (typeof body?.appleAuthorizationCode === "string") {
      appleAuthorizationCode = body.appleAuthorizationCode.trim() || null;
    }
  } catch {
    // No body is fine: Google users and older app builds send none.
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

    let appleRevocation = "not_requested";
    if (appleAuthorizationCode && !userId.startsWith(GOOGLE_USER_PREFIX)) {
      const result = await revokeAppleAuthorization(appleAuthorizationCode);
      appleRevocation = result.status;
      if (result.status === "failed") {
        console.warn("[account/delete] Apple revocation failed:", result.reason);
      }
    }

    return NextResponse.json({ deleted: true, hadTrackerData, appleRevocation });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete failed";
    console.error("[account/delete]", message, error);
    return NextResponse.json(
      { error: "Couldn't delete the account. Please try again." },
      { status: 500 },
    );
  }
}
