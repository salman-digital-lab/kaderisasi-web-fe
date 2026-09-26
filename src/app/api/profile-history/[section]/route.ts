import { getToken } from "@/functions/auth/getToken";
import { getApiConfig } from "@/config/apiConfig";

const headers = { "Cache-Control": "private, no-store" };
export async function GET(
  request: Request,
  context: { params: Promise<{ section: string }> },
): Promise<Response> {
  const { section } = await context.params;
  if (!["activities", "consultations", "achievements"].includes(section))
    return Response.json({ message: "NOT_FOUND" }, { status: 404, headers });
  const token = await getToken();
  if (!token)
    return Response.json({ message: "UNAUTHORIZED" }, { status: 401, headers });
  const query = new URLSearchParams();
  const incoming = new URL(request.url).searchParams;
  for (const key of ["page", "per_page", "search", "status", "search_scope"]) {
    const value = incoming.get(key);
    if (value !== null) query.set(key, value);
  }
  try {
    const response = await fetch(
      `${getApiConfig().beApi}/profiles/history/${section}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        cache: "no-store",
        signal: AbortSignal.any([request.signal, AbortSignal.timeout(15000)]),
      },
    );
    const body: unknown = await response.json().catch(() => ({
      message: response.status === 401 ? "UNAUTHORIZED" : "HISTORY_UNAVAILABLE",
    }));
    return Response.json(body, { status: response.status, headers });
  } catch {
    return Response.json(
      { message: "HISTORY_UNAVAILABLE" },
      { status: 502, headers },
    );
  }
}
