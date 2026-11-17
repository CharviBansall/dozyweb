import { NextResponse } from "next/server";
import { issueAppSession, verifyGoogleIdToken } from "@/lib/app-auth";

export const runtime = "nodejs";

/**
 * Exchange a Sign in with Google ID token for a Dozy app session.
 * Mirrors /api/auth/apple: the app sends the returned `sessionToken` as
 * `Authorization: Bearer …` on /api/junction/*, and uses `userId` as its `clientUserId`.
 */
export async function POST(request: Request) {
  let idToken: string | undefined;
  try {
    const body = (await request.json()) as { idToken?: unknown };
    if (typeof body.idToken === "string") {
      idToken = body.idToken.trim();
    }
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!idToken) {
    return NextResponse.json({ error: "idToken required" }, { status: 400 });
  }

  try {
    const result = await verifyGoogleIdToken(idToken);
    if (!result.ok) {
      console.warn("[auth/google] rejected id token:", result.reason);
      return NextResponse.json({ error: "Invalid Google ID token" }, { status: 401 });
    }

    const session = issueAppSession(result.userId);
    return NextResponse.json({
      userId: result.userId,
      sessionToken: session.token,
      expiresAt: new Date(session.expiresAt).toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sign in failed";
    console.error("[auth/google]", message, error);
    return NextResponse.json({ error: "Sign in failed" }, { status: 500 });
  }
}
