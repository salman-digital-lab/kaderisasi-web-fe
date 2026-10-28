/**
 * Whether a browser request came from this site.
 *
 * Behind the production proxy `request.url` carries the internal address, so it
 * cannot be compared with the browser's `Origin`. Prefer `Sec-Fetch-Site`, which
 * the browser sets itself; fall back to `Origin` against the request URL and the
 * public `NEXT_PUBLIC_APP_URL` for browsers that do not send it.
 */
export function isSameOriginRequest(request: Request): boolean {
  const site = request.headers.get("sec-fetch-site");
  if (site) return site === "same-origin" || site === "none";
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const trusted = [request.url, process.env.NEXT_PUBLIC_APP_URL];
  return trusted.some((url) => {
    if (!url) return false;
    try {
      return new URL(url).origin === origin;
    } catch {
      return false;
    }
  });
}
