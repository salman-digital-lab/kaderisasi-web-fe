import { beforeEach, expect, it, vi } from "vitest";
import { GET } from "./route";
const mocks = vi.hoisted(() => ({ token: vi.fn(), fetch: vi.fn() }));
vi.mock("@/functions/auth/getToken", () => ({ getToken: mocks.token }));
vi.mock("@/config/apiConfig", () => ({
  getApiConfig: () => ({ beApi: "http://backend.test/v2" }),
}));
beforeEach(() => {
  vi.clearAllMocks();
  mocks.token.mockResolvedValue("private-token");
  mocks.fetch.mockResolvedValue(Response.json({ data: { items: [] } }));
  vi.stubGlobal("fetch", mocks.fetch);
});
const context = (section = "activities") => ({
  params: Promise.resolve({ section }),
});
it("forwards only history parameters and keeps authentication private and uncached", async () => {
  const response = await GET(
    new Request(
      "http://localhost/api/profile-history/activities?page=2&per_page=6&search=test&status=all&user_id=99",
    ),
    context(),
  );
  expect(response.headers.get("cache-control")).toBe("private, no-store");
  expect(mocks.fetch).toHaveBeenCalledWith(
    "http://backend.test/v2/profiles/history/activities?page=2&per_page=6&search=test&status=all",
    expect.objectContaining({
      cache: "no-store",
      headers: expect.objectContaining({
        Authorization: "Bearer private-token",
      }),
      signal: expect.any(AbortSignal),
    }),
  );
  expect(await response.text()).not.toContain("private-token");
});
it("rejects unsupported sections and absent sessions without contacting the API", async () => {
  const request = new Request(
    "http://localhost/api/profile-history/activities",
  );
  expect((await GET(request, context("admin"))).status).toBe(404);
  mocks.token.mockResolvedValue(null);
  expect((await GET(request, context())).status).toBe(401);
  expect(mocks.fetch).not.toHaveBeenCalled();
});
it("preserves plain-text unauthorized responses and handles network failures", async () => {
  const request = new Request(
    "http://localhost/api/profile-history/activities",
  );
  mocks.fetch.mockResolvedValue(new Response("Unauthorized", { status: 401 }));
  expect((await GET(request, context())).status).toBe(401);
  mocks.fetch.mockRejectedValue(new Error("offline"));
  const response = await GET(request, context());
  expect(response.status).toBe(502);
  expect(response.headers.get("cache-control")).toBe("private, no-store");
});
