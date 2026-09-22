import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET, PUT } from "./route";

const mocks = vi.hoisted(() => ({ token: vi.fn(), fetch: vi.fn() }));
vi.mock("@/functions/auth/getToken", () => ({ getToken: mocks.token }));
vi.mock("@/config/apiConfig", () => ({
  getApiConfig: () => ({ beApi: "http://backend.test/v2" }),
}));
beforeEach(() => {
  vi.clearAllMocks();
  mocks.token.mockResolvedValue("private-token");
  mocks.fetch.mockResolvedValue(Response.json({ data: { unread: 2 } }));
  vi.stubGlobal("fetch", mocks.fetch);
});
const context = (path: string[] = []) => ({
  params: Promise.resolve({ path }),
});
describe("notification proxy", () => {
  it("forwards authentication only to the backend and never caches responses", async () => {
    const response = await GET(
      new Request("http://localhost:3000/api/notifications/unread-count"),
      context(["unread-count"]),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(mocks.fetch).toHaveBeenCalledWith(
      "http://backend.test/v2/notifications/unread-count?",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer private-token",
        }),
        cache: "no-store",
      }),
    );
    expect(await response.text()).not.toContain("private-token");
  });
  it("rejects missing sessions without contacting the backend", async () => {
    mocks.token.mockResolvedValue(null);
    expect(
      (
        await GET(
          new Request("http://localhost:3000/api/notifications"),
          context(),
        )
      ).status,
    ).toBe(401);
    expect(mocks.fetch).not.toHaveBeenCalled();
  });
  it("preserves plain-text authentication failures", async () => {
    mocks.fetch.mockResolvedValue(
      new Response("Unauthorized", { status: 401 }),
    );
    const response = await GET(
      new Request("http://localhost:3000/api/notifications"),
      context(),
    );
    expect(response.status).toBe(401);
  });
  it("rejects foreign origins and unsupported paths", async () => {
    expect(
      (
        await PUT(
          new Request("http://localhost:3000/api/notifications/read-all", {
            method: "PUT",
            headers: { Origin: "https://evil.test" },
            body: "{}",
          }),
          context(["read-all"]),
        )
      ).status,
    ).toBe(403);
    expect(
      (
        await GET(
          new Request("http://localhost:3000/api/notifications/admin-users"),
          context(["admin-users"]),
        )
      ).status,
    ).toBe(404);
    expect(mocks.fetch).not.toHaveBeenCalled();
  });
  it("forwards same-origin read requests with their cutoff", async () => {
    const body = JSON.stringify({ cutoff: "2026-09-22T00:00:00.123456Z" });
    const response = await PUT(
      new Request("http://localhost:3000/api/notifications/read-all", {
        method: "PUT",
        headers: { Origin: "http://localhost:3000" },
        body,
      }),
      context(["read-all"]),
    );
    expect(response.status).toBe(200);
    expect(mocks.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: "PUT", body }),
    );
  });
});
