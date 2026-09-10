export function getAuthRedirect(value?: string | null): string {
  if (!value || value.length > 2048 || /[\\\u0000-\u0020]/.test(value))
    return "/";
  try {
    const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const base = new URL(origin);
    if (!value.startsWith("/") && !value.startsWith(`${base.origin}/`))
      return "/";
    const url = new URL(value, base);
    if (url.origin !== base.origin || url.username || url.password) return "/";
    const path = decodeURIComponent(url.pathname);
    if (
      /^\/(?:api|login|register|forgot|reset)(?:\/|$)/.test(path) ||
      path.startsWith("//") ||
      path.includes("\\")
    )
      return "/";
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/";
  }
}
