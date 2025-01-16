import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { NAME_COOKIE_NAME, SESSION_COOKIE_NAME } from "../../constants";

export const verifySession = cache(async () => {
  const session = cookies().get(SESSION_COOKIE_NAME)?.value;
  const name = cookies().get(NAME_COOKIE_NAME)?.value;

  return { session, name };
});
