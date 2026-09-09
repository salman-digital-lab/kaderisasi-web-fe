import { beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("@/config/apiConfig", () => ({
  getApiConfig: () => ({ beApi: "https://api.example.test/v2" }),
}));
vi.mock("@/functions/common/fetcher", async () => {
  class FetcherError extends Error {
    constructor(
      message: string,
      public status: number,
    ) {
      super(message);
    }
  }
  return { default: vi.fn(), FetcherError };
});
import { getCertificateAccess } from "@/services/certificate";
import fetcher, { FetcherError } from "@/functions/common/fetcher";

describe("certificate download access states", () => {
  beforeEach(() => {
    vi.mocked(fetcher).mockReset();
  });
  it("does not make an authenticated read for signed-out visitors", async () => {
    expect(await getCertificateAccess(null, "CERT-1")).toBe("signed_out");
    expect(fetcher).not.toHaveBeenCalled();
  });
  it.each(["owner", "not_owner", "revoked"])(
    "recognizes %s without requesting the full snapshot",
    async (reason) => {
      vi.mocked(fetcher).mockResolvedValue({
        data: { reason, can_download: reason === "owner" },
      });
      expect(await getCertificateAccess("fixture-token", "CERT-1")).toBe(
        reason,
      );
      expect(fetcher).toHaveBeenCalledWith(
        "https://api.example.test/v2/certificates/code/CERT-1/access",
        expect.objectContaining({ cache: "no-store", method: "GET" }),
      );
    },
  );
  it("requires login again after an expired session", async () => {
    vi.mocked(fetcher).mockRejectedValue(new FetcherError("expired", 401));
    expect(await getCertificateAccess("expired", "CERT-1")).toBe("signed_out");
  });
  it.each([403, 404, 429, 500])(
    "offers retry for an unavailable access check (%i)",
    async (status) => {
      vi.mocked(fetcher).mockRejectedValue(
        new FetcherError("unavailable", status),
      );
      expect(await getCertificateAccess("token", "CERT-1")).toBe("unavailable");
    },
  );
  it("does not grant controls for an invalid response", async () => {
    vi.mocked(fetcher).mockResolvedValue({ data: { reason: "unexpected" } });
    expect(await getCertificateAccess("token", "CERT-1")).toBe("unavailable");
  });
});
