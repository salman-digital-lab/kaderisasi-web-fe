"use server";

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthRedirect } from "@/features/auth/redirect";
import {
  getGoogleConfig,
  GOOGLE_FLOW_COOKIE,
  googleFlowCookieOptions,
} from "@/features/auth/google-config";

export async function startGoogleLogin(form: FormData): Promise<never> {
  const config = getGoogleConfig();
  const destination = getAuthRedirect(String(form.get("redirect") || "/"));
  const mode = form.get("mode") === "register" ? "register" : "login";
  if (!config)
    redirect(
      `/${mode}?googleError=GOOGLE_LOGIN_UNAVAILABLE&redirect=${encodeURIComponent(destination)}`,
    );
  const state = randomBytes(32).toString("base64url");
  const codeVerifier = randomBytes(32).toString("base64url");
  const nonce = randomBytes(32).toString("base64url");
  (await cookies()).set(
    GOOGLE_FLOW_COOKIE,
    JSON.stringify({
      state,
      codeVerifier,
      nonce,
      destination,
      mode,
      createdAt: Date.now(),
    }),
    googleFlowCookieOptions,
  );
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.search = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    nonce,
    code_challenge: createHash("sha256")
      .update(codeVerifier)
      .digest("base64url"),
    code_challenge_method: "S256",
    prompt: "select_account",
  }).toString();
  redirect(url.toString());
}
