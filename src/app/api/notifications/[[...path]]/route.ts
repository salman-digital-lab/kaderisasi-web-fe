import { getToken } from "@/functions/auth/getToken";
import { getApiConfig } from "@/config/apiConfig";

const privateHeaders = { "Cache-Control": "private, no-store" };
type Context = { params: Promise<{ path?: string[] }> };

async function proxy(request: Request, context: Context): Promise<Response> {
  const { path = [] } = await context.params;
  const suffix = path.join("/");
  const allowed =
    request.method === "GET"
      ? /^(?:|unread-count|[1-9][0-9]*)$/.test(suffix)
      : /^(?:read-all|[1-9][0-9]*\/read)$/.test(suffix);
  if (!allowed)
    return Response.json(
      { message: "NOT_FOUND" },
      { status: 404, headers: privateHeaders },
    );
  const token = await getToken();
  if (!token)
    return Response.json(
      { message: "UNAUTHORIZED" },
      { status: 401, headers: privateHeaders },
    );
  const url = new URL(request.url);
  if (
    request.method === "PUT" &&
    request.headers.get("origin") !== url.origin
  ) {
    return Response.json(
      { message: "UNTRUSTED_ORIGIN" },
      { status: 403, headers: privateHeaders },
    );
  }
  const query = new URLSearchParams();
  for (const key of ["cursor", "unread"]) {
    const value = url.searchParams.get(key);
    if (value !== null) query.set(key, value);
  }
  try {
    const body = request.method === "PUT" ? await request.text() : undefined;
    if (body && body.length > 1024)
      return Response.json(
        { message: "INVALID_INPUT" },
        { status: 413, headers: privateHeaders },
      );
    const response = await fetch(
      `${getApiConfig().beApi}/notifications${suffix ? `/${suffix}` : ""}?${query}`,
      {
        method: request.method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body,
        cache: "no-store",
        signal: AbortSignal.any([request.signal, AbortSignal.timeout(15000)]),
      },
    );
    const data: unknown = await response.json().catch(() => ({
      message:
        response.status === 401 ? "UNAUTHORIZED" : "NOTIFICATIONS_UNAVAILABLE",
    }));
    return Response.json(data, {
      status: response.status,
      headers: privateHeaders,
    });
  } catch {
    return Response.json(
      { message: "NOTIFICATIONS_UNAVAILABLE" },
      { status: 502, headers: privateHeaders },
    );
  }
}
export async function GET(
  request: Request,
  context: Context,
): Promise<Response> {
  return proxy(request, context);
}
export async function PUT(
  request: Request,
  context: Context,
): Promise<Response> {
  return proxy(request, context);
}
