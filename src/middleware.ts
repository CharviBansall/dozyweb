import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "dozy_entitlement";

/**
 * Lightweight gate: protected app routes require a session cookie.
 * Full entitlement (active/trialing) is verified in server layouts via Stripe.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/app")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/subscribe";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*"],
};
