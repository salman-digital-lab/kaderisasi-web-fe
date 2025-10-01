"use server";

import { cookies } from "next/headers";
import { PROFILE_PICTURE_COOKIE_NAME } from "../../constants";

export default async function updateProfilePictureCookie(picture: string) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  (await cookies()).set(PROFILE_PICTURE_COOKIE_NAME, picture, {
    expires: tomorrow,
  });
}
