import { describe, expect, it } from "vitest";
import { parseVerificationInput } from "./verificationInput";

describe("certificate verification input", () => {
  const site = "https://example.test/kaderisasi";
  it("normalizes a pasted code", () => {
    expect(parseVerificationInput("  cert-123-abc  ")).toBe("CERT-123-ABC");
  });
  it.each(["certificate", "certificate/verify"])(
    "accepts a configured-site %s URL",
    (path) => {
      expect(
        parseVerificationInput(
          `https://example.test/kaderisasi/${path}/cert-123-abc/?source=share`,
          site,
        ),
      ).toBe("CERT-123-ABC");
    },
  );
  it.each([
    "https://evil.test/kaderisasi/certificate/ABC",
    "https://example.test.evil.test/kaderisasi/certificate/ABC",
    "https://user:password@example.test/kaderisasi/certificate/ABC",
    "https://example.test/certificate/ABC",
    "https://example.test/kaderisasi/certificate/ABC%2FDEF",
    "https://example.test/kaderisasi/certificate/%FF",
    "javascript:alert(1)",
    "",
    "A B",
    "A".repeat(97),
  ])("rejects invalid input %s", (input) => {
    expect(parseVerificationInput(input, site)).toBeNull();
  });
  it("does not trust a URL without a configured public site", () => {
    expect(
      parseVerificationInput("https://example.test/certificate/ABC"),
    ).toBeNull();
  });
});
