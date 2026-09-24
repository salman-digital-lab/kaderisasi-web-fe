import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { verifySession } from "@/functions/server/session";
import { getCustomFormSuccessInfo } from "@/services/customForm";
import { getRegistrationStatus } from "@/services/clubRegistration";
import SuccessPage from "./page";

vi.mock("@/functions/server/session", () => ({ verifySession: vi.fn() }));
vi.mock("@/services/customForm", () => ({ getCustomFormSuccessInfo: vi.fn() }));
vi.mock("@/services/clubRegistration", () => ({
  getRegistrationStatus: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  redirect: (url: string): never => {
    throw new Error(`REDIRECT:${url}`);
  },
}));
vi.mock("@mantine/core", () => ({
  Paper: "div",
  Title: "h1",
  Text: "p",
  Stack: "div",
  Alert: "aside",
}));
vi.mock("@/components/layout/PageContainer", () => ({ default: "main" }));
vi.mock("@/components/layout/Error", () => ({ default: "output" }));
vi.mock("@/components/common/LinkButton", () => ({ default: "a" }));

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(verifySession).mockResolvedValue({
    session: "member",
    name: undefined,
    profilePicture: undefined,
  });
  vi.mocked(getCustomFormSuccessInfo).mockResolvedValue({
    id: 1,
    post_submission_info: "<p>Join the group</p>",
  });
});

const page = (type: string, id = "176") =>
  SuccessPage({ params: Promise.resolve({ type, id }) });

describe("registration success", () => {
  it("loads activity instructions without reading the member session", async () => {
    const html = renderToStaticMarkup(await page("activity"));
    expect(verifySession).not.toHaveBeenCalled();
    expect(getCustomFormSuccessInfo).toHaveBeenCalledWith({
      feature_type: "activity_registration",
      feature_id: 176,
    });
    expect(html).toContain("Pendaftaran Berhasil!");
    expect(html).toContain("Join the group");
  });

  it("starts club instructions while registration verification is pending", async () => {
    let resolveStatus!: (
      value: Awaited<ReturnType<typeof getRegistrationStatus>>,
    ) => void;
    vi.mocked(getRegistrationStatus).mockReturnValue(
      new Promise((resolve) => {
        resolveStatus = resolve;
      }),
    );
    const pending = page("club");
    await vi.waitFor(() => expect(getRegistrationStatus).toHaveBeenCalled());
    expect(getCustomFormSuccessInfo).toHaveBeenCalled();
    resolveStatus({ data: { isRegistered: false } } as Awaited<
      ReturnType<typeof getRegistrationStatus>
    >);
    await expect(pending).rejects.toThrow("REDIRECT:/clubs/176");
  });

  it("does not load club instructions for an anonymous visitor", async () => {
    vi.mocked(verifySession).mockResolvedValue({
      session: undefined,
      name: undefined,
      profilePicture: undefined,
    });
    await expect(page("club")).rejects.toThrow("REDIRECT:/clubs/176");
    expect(getCustomFormSuccessInfo).not.toHaveBeenCalled();
  });

  it("keeps an approved status when optional instructions fail", async () => {
    vi.mocked(getRegistrationStatus).mockResolvedValue({
      data: { isRegistered: true, registration: { status: "APPROVED" } },
    } as Awaited<ReturnType<typeof getRegistrationStatus>>);
    vi.mocked(getCustomFormSuccessInfo).mockRejectedValue(
      new Error("Unavailable"),
    );
    const html = renderToStaticMarkup(await page("club"));
    expect(html).toContain("Status Pendaftaran");
    expect(html).toContain("disetujui");
  });

  it("preserves independent form redirects", async () => {
    await expect(page("independent")).rejects.toThrow("REDIRECT:/form/176");
    expect(getCustomFormSuccessInfo).not.toHaveBeenCalled();
  });
});
