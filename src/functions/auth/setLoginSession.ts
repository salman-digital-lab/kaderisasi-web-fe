import { cookies } from "next/headers";
import type { LoginResp } from "@/types/api/auth";
import {
  NAME_COOKIE_NAME,
  PROFILE_PICTURE_COOKIE_NAME,
  SESSION_COOKIE_NAME,
} from "@/constants";

export async function setLoginSession(response: LoginResp): Promise<boolean> {
  const token = response.data?.token?.token;
  if (!token) return false;
  const cookieStore = await cookies();
  const options = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  };
  cookieStore.set(SESSION_COOKIE_NAME, token, options);
  cookieStore.set(NAME_COOKIE_NAME, response.data?.data?.name || "", options);
  cookieStore.set(
    PROFILE_PICTURE_COOKIE_NAME,
    response.data?.data?.picture || "",
    options,
  );
  return true;
}
