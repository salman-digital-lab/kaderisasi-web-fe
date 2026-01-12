import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { SESSION_COOKIE_NAME } from "../../constants";

export const getToken = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  return token ?? null;
});
