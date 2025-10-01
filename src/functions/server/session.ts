import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { NAME_COOKIE_NAME, PROFILE_PICTURE_COOKIE_NAME, SESSION_COOKIE_NAME } from "../../constants";

export const verifySession = cache(async () => {
  const session = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const name = (await cookies()).get(NAME_COOKIE_NAME)?.value;
  const profilePicture = (await cookies()).get(PROFILE_PICTURE_COOKIE_NAME)?.value;

  return { session, name, profilePicture };
});
