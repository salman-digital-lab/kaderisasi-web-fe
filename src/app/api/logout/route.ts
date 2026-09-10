import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  SESSION_COOKIE_NAME,
  NAME_COOKIE_NAME,
  PROFILE_PICTURE_COOKIE_NAME,
} from "@/constants";
import { cookies } from "next/headers";

function logoutDestination(value: string | null): string {
  if (
    !value ||
    value.length > 2048 ||
    !value.startsWith("/") ||
    /[\\\u0000-\u0020]/.test(value)
  )
    return "/login";
  try {
    const url = new URL(value, "https://logout.invalid");
    const path = decodeURIComponent(url.pathname);
    if (
      url.origin !== "https://logout.invalid" ||
      path.startsWith("//") ||
      /[\\\u0000-\u0020]/.test(path) ||
      /^\/api\/logout(?:\/|$)/.test(path)
    )
      return "/login";
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/login";
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const cookieStore = await cookies();
  const redirectTo = logoutDestination(
    request.nextUrl.searchParams.get("redirect"),
  );

  cookieStore.delete(SESSION_COOKIE_NAME);
  cookieStore.delete(NAME_COOKIE_NAME);
  cookieStore.delete(PROFILE_PICTURE_COOKIE_NAME);

  return new NextResponse(null, {
    status: 307,
    headers: { Location: redirectTo, "Cache-Control": "private, no-store" },
  });
}
