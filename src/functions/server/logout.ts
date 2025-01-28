"use server";

import { NAME_COOKIE_NAME, SESSION_COOKIE_NAME } from "../../constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function logout(redirectionUrl?: string) {
  (await cookies()).delete(SESSION_COOKIE_NAME);
  (await cookies()).delete(NAME_COOKIE_NAME);
  if (redirectionUrl) {
    redirect(redirectionUrl);
  } else {
    redirect("/");
  }
}
