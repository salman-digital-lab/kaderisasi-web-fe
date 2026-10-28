import { afterEach, describe, expect, it, vi } from "vitest";
import { isSameOriginRequest } from "./sameOrigin";

// Production: the proxy forwards to the app over plain HTTP on an internal host.
const internal = "http://0.0.0.0:3000/api/forms/1/files/photo";
const request = (headers: Record<string, string>) =>
  new Request(internal, { method: "POST", headers });

afterEach(() => vi.unstubAllEnvs());

describe("isSameOriginRequest", () => {
  it("trusts same-origin fetches even when the internal URL differs", () => {
    expect(
      isSameOriginRequest(
        request({
          "sec-fetch-site": "same-origin",
          origin: "https://kaderisasi.salmanitb.com",
        }),
      ),
    ).toBe(true);
  });
  it("rejects cross-site and same-site fetches", () => {
    for (const site of ["cross-site", "same-site"])
      expect(
        isSameOriginRequest(
          request({ "sec-fetch-site": site, origin: "https://evil.test" }),
        ),
      ).toBe(false);
  });
  it("falls back to the public app URL without Sec-Fetch-Site", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://kaderisasi.salmanitb.com");
    expect(
      isSameOriginRequest(
        request({ origin: "https://kaderisasi.salmanitb.com" }),
      ),
    ).toBe(true);
    expect(isSameOriginRequest(request({ origin: "https://evil.test" }))).toBe(
      false,
    );
  });
  it("allows requests without any browser origin headers", () => {
    expect(isSameOriginRequest(request({}))).toBe(true);
  });
});
