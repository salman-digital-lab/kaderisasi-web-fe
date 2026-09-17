import { verifySession } from "@/functions/server/session";
import { serverApiConfig } from "@/config/apiConfig";

type Context = { params: Promise<{ id: string; action: string[] }> };
async function proxyFormRequest(
  request: Request,
  { params }: Context,
): Promise<Response> {
  const { id, action } = await params;
  const validAction =
    request.method === "POST"
      ? (action.length === 1 &&
          ["sessions", "responses"].includes(action[0] ?? "")) ||
        (action.length === 2 && action[0] === "files")
      : action.length === 2 && action[0] === "files";
  if (
    !/^[1-9]\d*$/.test(id) ||
    !validAction ||
    action.some((part) => !/^[\w-]+$/.test(part))
  )
    return Response.json({ message: "NOT_FOUND" }, { status: 404 });
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return Response.json({ message: "FORBIDDEN" }, { status: 403 });
  const { session } = await verifySession();
  const headers = new Headers();
  if (session && request.headers.get("x-form-guest") !== "true")
    headers.set("Authorization", `Bearer ${session}`);
  for (const name of ["content-type", "x-form-session", "x-form-upload"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  try {
    const chunks: Uint8Array[] = [];
    let size = 0;
    const reader = request.body?.getReader();
    if (reader) {
      for (;;) {
        const chunk = await reader.read();
        if (chunk.done) break;
        size += chunk.value.length;
        if (size > 11 * 1024 * 1024) {
          await reader.cancel();
          return Response.json(
            { message: "INVALID_FILE_SIZE" },
            { status: 413 },
          );
        }
        chunks.push(chunk.value);
      }
    }
    const body = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.length;
    }
    const response = await fetch(
      `${serverApiConfig.beApi}/custom-forms/${id}/${action.map(encodeURIComponent).join("/")}`,
      {
        method: request.method,
        headers,
        body: size ? body : undefined,
        cache: "no-store",
        signal: request.signal,
      },
    );
    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return Response.json(
      { message: "Permintaan belum berhasil. Silakan coba lagi." },
      { status: 502 },
    );
  }
}
export const POST = proxyFormRequest;
export const DELETE = proxyFormRequest;
