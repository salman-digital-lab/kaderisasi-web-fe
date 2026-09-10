import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { serverApiConfig } from "@/config/apiConfig";
import {
  getGoogleConfig,
  GOOGLE_FLOW_COOKIE,
  googleFlowCookieOptions,
} from "@/features/auth/google-config";
import { getAuthRedirect } from "@/features/auth/redirect";
import { setLoginSession } from "@/functions/auth/setLoginSession";
import type { LoginResp } from "@/types/api/auth";

const flowSchema = z.object({
  state: z.string().length(43),
  codeVerifier: z.string().length(43),
  nonce: z.string().length(43),
  destination: z.string(),
  mode: z.enum(["login", "register"]),
  createdAt: z.number(),
});

export async function GET(request: NextRequest): Promise<NextResponse> {
  const config = getGoogleConfig();
  const origin = config
    ? new URL(config.redirectUri).origin
    : request.nextUrl.origin;
  const cookieStore = await cookies();
  const rawFlow = cookieStore.get(GOOGLE_FLOW_COOKIE)?.value;
  cookieStore.set(GOOGLE_FLOW_COOKIE, "", {
    ...googleFlowCookieOptions,
    maxAge: 0,
  });
  let destination = "/";
  let mode = "login";
  const finish = (path: string): NextResponse => {
    const response = NextResponse.redirect(new URL(path, origin), 303);
    response.headers.set("Cache-Control", "no-store");
    response.headers.set("Referrer-Policy", "no-referrer");
    return response;
  };
  const fail = (message: string): NextResponse =>
    finish(
      `/${mode}?${new URLSearchParams({ googleError: message, redirect: destination })}`,
    );
  try {
    const flow = flowSchema.parse(JSON.parse(rawFlow || "null"));
    destination = getAuthRedirect(flow.destination);
    mode = flow.mode;
    const state = request.nextUrl.searchParams.get("state") || "";
    if (
      state.length !== flow.state.length ||
      !timingSafeEqual(Buffer.from(state), Buffer.from(flow.state)) ||
      Date.now() - flow.createdAt > 600_000 ||
      flow.createdAt > Date.now()
    )
      return fail("GOOGLE_LOGIN_EXPIRED");
    if (request.nextUrl.searchParams.has("error"))
      return fail("GOOGLE_LOGIN_CANCELLED");
    if (!config) return fail("GOOGLE_LOGIN_UNAVAILABLE");
    const code = request.nextUrl.searchParams.get("code");
    if (!code) return fail("GOOGLE_LOGIN_FAILED");
    const result = await fetch(`${serverApiConfig.beApi}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        codeVerifier: flow.codeVerifier,
        nonce: flow.nonce,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });
    const body: LoginResp = await result.json();
    if (!result.ok) {
      const knownErrors = [
        "GOOGLE_EMAIL_PASSWORD_REQUIRED",
        "GOOGLE_ACCOUNT_INACTIVE",
        "GOOGLE_LOGIN_UNAVAILABLE",
      ];
      return fail(
        knownErrors.includes(body.message)
          ? body.message
          : "GOOGLE_LOGIN_FAILED",
      );
    }
    if (!(await setLoginSession(body))) return fail("GOOGLE_LOGIN_FAILED");
    return finish(destination);
  } catch {
    return fail(rawFlow ? "GOOGLE_LOGIN_FAILED" : "GOOGLE_LOGIN_EXPIRED");
  }
}
