import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  set: vi.fn(),
  session: vi.fn(),
  fetch: vi.fn(),
}));
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: mocks.get, set: mocks.set }),
}));
vi.mock("@/functions/auth/setLoginSession", () => ({
  setLoginSession: mocks.session,
}));
const state = "s".repeat(43);
const flow = {
  state,
  codeVerifier: "v".repeat(43),
  nonce: "n".repeat(43),
  destination: "/clubs/8",
  mode: "register",
  createdAt: Date.now(),
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("GOOGLE_CLIENT_ID", "test.apps.googleusercontent.com");
  vi.stubEnv(
    "GOOGLE_REDIRECT_URI",
    "http://localhost:3000/api/auth/google/callback",
  );
  vi.stubGlobal("fetch", mocks.fetch);
  mocks.get.mockReturnValue({
    value: JSON.stringify({ ...flow, createdAt: Date.now() }),
  });
  mocks.session.mockResolvedValue(true);
  mocks.fetch.mockResolvedValue({
    ok: true,
    json: async () => ({
      message: "LOGIN_SUCCESS",
      data: { token: { token: "app-token" } },
    }),
  });
});

function callback(params: Record<string, string>): Promise<Response> {
  return GET(
    new NextRequest(
      `http://localhost:3000/api/auth/google/callback?${new URLSearchParams(params)}`,
    ),
  );
}

describe("Google callback", () => {
  it.each(["/", "/custom-form/activity/42", "/clubs/8", "/consultation"])(
    "creates a session and returns to %s",
    async (destination) => {
      mocks.get.mockReturnValue({
        value: JSON.stringify({ ...flow, destination, createdAt: Date.now() }),
      });
      const response = await callback({ state, code: "single-use-code" });
      expect(response.headers.get("location")).toBe(
        `http://localhost:3000${destination}`,
      );
      expect(response.headers.get("cache-control")).toBe("no-store");
      expect(mocks.session).toHaveBeenCalledOnce();
      expect(mocks.set).toHaveBeenCalledWith(
        "google-login-flow",
        "",
        expect.objectContaining({ maxAge: 0, httpOnly: true }),
      );
      const body = JSON.parse(mocks.fetch.mock.calls[0]![1].body);
      expect(body).toEqual({
        code: "single-use-code",
        nonce: flow.nonce,
        codeVerifier: flow.codeVerifier,
      });
    },
  );
  it("rejects CSRF before calling the backend", async () => {
    const response = await callback({ state: "x".repeat(43), code: "code" });
    expect(response.headers.get("location")).toContain("GOOGLE_LOGIN_EXPIRED");
    expect(mocks.fetch).not.toHaveBeenCalled();
  });
  it("rejects callbacks without a flow cookie", async () => {
    mocks.get.mockReturnValue(undefined);
    expect(
      (await callback({ state, code: "code" })).headers.get("location"),
    ).toContain("GOOGLE_LOGIN_EXPIRED");
    expect(mocks.session).not.toHaveBeenCalled();
  });
  it("rejects expired flows", async () => {
    mocks.get.mockReturnValue({
      value: JSON.stringify({ ...flow, createdAt: Date.now() - 601_000 }),
    });
    await callback({ state, code: "code" });
    expect(mocks.fetch).not.toHaveBeenCalled();
  });
  it("keeps registration and destination when the user cancels", async () => {
    const response = await callback({ state, error: "access_denied" });
    const location = new URL(response.headers.get("location")!);
    expect(location.pathname).toBe("/register");
    expect(location.searchParams.get("redirect")).toBe("/clubs/8");
    expect(location.searchParams.get("googleError")).toBe(
      "GOOGLE_LOGIN_CANCELLED",
    );
    expect(mocks.fetch).not.toHaveBeenCalled();
  });
  it("never sets a session after backend rejection", async () => {
    mocks.fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ message: "GOOGLE_EMAIL_PASSWORD_REQUIRED" }),
    });
    const response = await callback({ state, code: "code" });
    expect(response.headers.get("location")).toContain(
      "GOOGLE_EMAIL_PASSWORD_REQUIRED",
    );
    expect(mocks.session).not.toHaveBeenCalled();
  });
  it("returns a retry message when Google or backend is unavailable", async () => {
    mocks.fetch.mockRejectedValue(new Error("timeout"));
    const response = await callback({ state, code: "code" });
    expect(response.headers.get("location")).toContain("GOOGLE_LOGIN_FAILED");
    expect(mocks.session).not.toHaveBeenCalled();
  });
});
