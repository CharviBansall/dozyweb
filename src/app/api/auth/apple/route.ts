import { NextResponse } from "next/server";
import { issueAppSession, verifyAppleIdentityToken } from "@/lib/app-auth";

export const runtime = "nodejs";

/**
 * Exchange a Sign in with Apple identity token for a Dozy app session.
 * The app sends the returned `sessionToken` as `Authorization: Bearer …` on /api/junction/*.
 */
export async function POST(request: Request) {
  let identityToken: string | undefined;
  try {
    const body = (await request.json()) as { identityToken?: unknown };
    if (typeof body.identityToken === "string") {
      identityToken = body.identityToken.trim();
    }
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!identityToken) {
    return NextResponse.json({ error: "identityToken required" }, { status: 400 });
  }

  try {
    const result = await verifyAppleIdentityToken(identityToken);
    if (!result.ok) {
      console.warn("[auth/apple] rejected identity token:", result.reason);
      return NextResponse.json(
        { error: "Invalid Apple identity token" },
        { status: 401 },
      );
    }

    const session = issueAppSession(result.userId);
    return NextResponse.json({
      userId: result.userId,
      sessionToken: session.token,
      expiresAt: new Date(session.expiresAt).toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sign in failed";
    console.error("[auth/apple]", message, error);
    return NextResponse.json({ error: "Sign in failed" }, { status: 500 });
  }
}
