import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import {
  SESSION_COOKIE_NAME,
  NAME_COOKIE_NAME,
  PROFILE_PICTURE_COOKIE_NAME,
} from "@/constants";
import { GET } from "./route";

const mocks = vi.hoisted(() => ({ remove: vi.fn() }));
vi.mock("next/headers", () => ({
  cookies: async () => ({ delete: mocks.remove }),
}));

beforeEach(() => vi.clearAllMocks());

function logout(destination?: string): Promise<Response> {
  const query = destination
    ? `?${new URLSearchParams({ redirect: destination })}`
    : "";
  return GET(
    new NextRequest(`http://localhost:3000/api/logout${query}`, {
      headers: {
        "x-forwarded-host": "untrusted.example",
        "x-forwarded-proto": "https",
      },
    }),
  );
}

describe("Logout redirects behind a reverse proxy", () => {
  it.each([
    "/login?redirect=%2Fkelas%2F1",
    "/onboarding",
    "/login?redirect=%2Fcustom-form%2Factivity%2F42",
  ])(
    "keeps %s relative to the public origin and clears the old session",
    async (destination) => {
      const response = await logout(destination);
      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe(destination);
      expect(response.headers.get("cache-control")).toBe("private, no-store");
      expect(mocks.remove.mock.calls.map(([name]) => name)).toEqual([
        SESSION_COOKIE_NAME,
        NAME_COOKIE_NAME,
        PROFILE_PICTURE_COOKIE_NAME,
      ]);
    },
  );

  it.each([
    undefined,
    "https://untrusted.example/",
    "//untrusted.example/",
    "/\\untrusted.example/",
    "/%2f%2funtrusted.example/",
    "/%5cuntrusted.example/",
    "/%0d%0aLocation:evil",
    "/api/logout",
    "/%invalid",
  ])(
    "defaults unsafe or absent destination %s to login",
    async (destination) => {
      expect((await logout(destination)).headers.get("location")).toBe(
        "/login",
      );
    },
  );
});
