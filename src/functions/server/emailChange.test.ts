import { beforeEach, describe, expect, it, vi } from "vitest";
import { FetcherError } from "@/functions/common/fetcher";
import { confirmEmailChange, startEmailChange } from "./emailChange";

const mocks = vi.hoisted(() => ({
  post: vi.fn(),
  confirm: vi.fn(),
  setLoginSession: vi.fn(),
}));
vi.mock("server-only", () => ({}));
vi.mock("./session", () => ({
  verifySession: async () => ({ session: "learner-token" }),
}));
vi.mock("@/functions/auth/setLoginSession", () => ({
  setLoginSession: mocks.setLoginSession,
}));
vi.mock("@/services/emailChange", () => ({
  getEmailChange: vi.fn(),
  postEmailChange: mocks.post,
  postEmailChangeCode: vi.fn(),
  deleteEmailChange: vi.fn(),
  putConfirmEmailChange: mocks.confirm,
}));

beforeEach(() => vi.clearAllMocks());

describe("email change actions", () => {
  it("sends the new email trimmed and lowercased", async () => {
    mocks.post.mockResolvedValue({
      message: "EMAIL_CHANGE_LINK_SENT",
      data: { step: "link", email: "baru@example.test", expires_at: "" },
    });
    const result = await startEmailChange({
      email: "  Baru@Example.TEST ",
      password: "rahasia",
    });
    expect(mocks.post).toHaveBeenCalledWith("learner-token", {
      email: "baru@example.test",
      password: "rahasia",
    });
    expect(result.success).toBe(true);
  });

  it("shows a wrong password as such, not as an expired session", async () => {
    mocks.post.mockRejectedValue(new FetcherError("WRONG_PASSWORD", 401));
    const result = await startEmailChange({ email: "baru@example.test" });
    expect(result).toEqual({
      success: false,
      message: "Password yang dimasukkan salah.",
    });
  });

  it("treats an unexplained 401 as an expired session", async () => {
    mocks.post.mockRejectedValue(new FetcherError("Unauthorized", 401));
    const result = await startEmailChange({ email: "baru@example.test" });
    expect(result.message).toBe("Sesi Anda berakhir. Silakan masuk lagi.");
  });

  it("reports success even when the API returned no new session", async () => {
    mocks.confirm.mockResolvedValue({
      message: "EMAIL_CHANGE_SUCCESS",
      data: { user: { email: "baru@example.test" } },
    });
    mocks.setLoginSession.mockResolvedValue(false);
    const result = await confirmEmailChange("token");
    expect(result).toEqual({
      success: true,
      message: "EMAIL_CHANGE_SUCCESS",
      data: { email: "baru@example.test" },
    });
  });
});
