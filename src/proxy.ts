import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/constants";
import { getAuthRedirect } from "@/features/auth/redirect";

export default function proxy(req: NextRequest): NextResponse {
  const path = req.nextUrl.pathname;
  const cookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (path === "/profile" && !cookie) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (cookie && (path === "/login" || path === "/register")) {
    return NextResponse.redirect(
      new URL(
        getAuthRedirect(req.nextUrl.searchParams.get("redirect")),
        req.nextUrl,
      ),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile", "/login", "/register"],
};
