import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import proxy, { config } from "./proxy";

function request(path: string, session?: string): NextRequest {
  return new NextRequest(`https://kaderisasi.example${path}`, {
    headers: session ? { cookie: `session=${session}` } : undefined,
  });
}

describe("authentication proxy scope", () => {
  it.each(["/profile", "/login", "/register?redirect=%2Fclubs"])(
    "keeps authentication routing for %s",
    (url) => {
      expect(unstable_doesMiddlewareMatch({ config, url })).toBe(true);
    },
  );

  it.each([
    "/",
    "/activity",
    "/activity/example/join",
    "/clubs?page=2",
    "/custom-form/activity/42",
    "/privacy-policy",
    "/signup",
    "/api/logout",
    "/logo.svg",
    "/favicon.ico",
    "/_next/static/chunks/app.js",
    "/_next/image?url=%2Flogo.png&w=256&q=75",
  ])("skips the auth proxy for %s", (url) => {
    expect(unstable_doesMiddlewareMatch({ config, url })).toBe(false);
  });
});

describe("authentication proxy redirects", () => {
  it("sends a signed-out profile request to login", () => {
    const response = proxy(request("/profile"));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://kaderisasi.example/login",
    );
  });

  it("passes a profile request with a session to its server-side checks", () => {
    expect(
      proxy(request("/profile", "test-session")).headers.get("location"),
    ).toBeNull();
  });

  it.each(["/login", "/register"])(
    "keeps %s accessible without a session",
    (path) => {
      expect(proxy(request(path)).headers.get("location")).toBeNull();
    },
  );

  it.each(["/login", "/register"])(
    "returns signed-in visitors from %s to their requested page",
    (path) => {
      const response = proxy(
        request(
          `${path}?redirect=%2Fcustom-form%2Factivity%2F42`,
          "test-session",
        ),
      );
      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe(
        "https://kaderisasi.example/custom-form/activity/42",
      );
    },
  );

  it.each(["https://untrusted.example/", "/login", "/api/logout"])(
    "rejects an unsafe or looping signed-in destination %s",
    (destination) => {
      const response = proxy(
        request(
          `/login?${new URLSearchParams({ redirect: destination })}`,
          "test-session",
        ),
      );
      expect(response.headers.get("location")).toBe(
        "https://kaderisasi.example/",
      );
    },
  );
});
