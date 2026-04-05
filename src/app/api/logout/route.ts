import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE_NAME,
  NAME_COOKIE_NAME,
  PROFILE_PICTURE_COOKIE_NAME,
} from "@/constants";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const redirectTo = request.nextUrl.searchParams.get("redirect") || "/login";

  cookieStore.delete(SESSION_COOKIE_NAME);
  cookieStore.delete(NAME_COOKIE_NAME);
  cookieStore.delete(PROFILE_PICTURE_COOKIE_NAME);

  return NextResponse.redirect(new URL(redirectTo, request.url));
}
