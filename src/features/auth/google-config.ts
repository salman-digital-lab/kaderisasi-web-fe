export const GOOGLE_FLOW_COOKIE = "google-login-flow";

export function getGoogleConfig(): {
  clientId: string;
  redirectUri: string;
} | null {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  if (!clientId || !redirectUri) return null;
  try {
    const url = new URL(redirectUri);
    if (url.pathname !== "/api/auth/google/callback" || url.search || url.hash)
      return null;
    if (
      url.protocol !== "https:" &&
      !(url.protocol === "http:" && url.hostname === "localhost")
    )
      return null;
    return { clientId, redirectUri };
  } catch {
    return null;
  }
}

export const googleFlowCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/api/auth/google/callback",
  maxAge: 600,
};
