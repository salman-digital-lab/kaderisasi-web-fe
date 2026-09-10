import { describe, expect, it, vi, afterEach } from "vitest";
import { getAuthRedirect } from "./redirect";

afterEach(() => vi.unstubAllEnvs());
describe("authentication destinations", () => {
  it.each([
    "/",
    "/custom-form/activity/42",
    "/clubs/8",
    "/consultation",
    "/activity/a?step=2#register",
  ])("preserves %s", (path) => {
    expect(getAuthRedirect(path)).toBe(path);
  });
  it("supports existing same-origin absolute links", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://salman.test");
    expect(getAuthRedirect("https://salman.test/consultation")).toBe(
      "/consultation",
    );
  });
  it.each([
    undefined,
    "undefined",
    "https://evil.test",
    "//evil.test",
    "/\\evil.test",
    "javascript:alert(1)",
    "/login",
    "/register?redirect=//evil.test",
    "/api/logout",
    "/%2f/evil.test",
    "/%61pi/logout",
    "/x/../login",
    "/\n/evil.test",
  ])("rejects unsafe or looping destination %s", (path) => {
    expect(getAuthRedirect(path)).toBe("/");
  });
});
