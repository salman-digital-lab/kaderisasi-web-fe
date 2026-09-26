import { beforeEach, describe, expect, it, vi } from "vitest";
import ClubRegistrationButton from "@/components/common/ClubRegistrationButton";
import { FetcherError } from "@/functions/common/fetcher";
import { verifySession } from "@/functions/server/session";
import { getCustomFormByFeature } from "@/services/customForm";
import type { CustomForm } from "@/types/api/customForm";
import { ClubRegistrationAction } from "./ClubRegistrationAction";

vi.mock("@/functions/server/session", () => ({ verifySession: vi.fn() }));
vi.mock("@/services/customForm", () => ({ getCustomFormByFeature: vi.fn() }));

const club = {
  clubId: 42,
  clubName: "Klub uji",
  isRegistrationOpen: true,
};
const customForm: CustomForm = {
  id: 7,
  schema_hash: "test",
  form_name: "Pendaftaran klub",
  form_description: "",
  feature_type: "club_registration",
  feature_id: club.clubId,
  form_schema: { fields: [] },
  is_active: true,
  created_at: "2026-09-26",
  updated_at: "2026-09-26",
};

function setSession(session: string | undefined): void {
  vi.mocked(verifySession).mockResolvedValue({
    session,
    name: undefined,
    profilePicture: undefined,
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  setSession("test-session");
  vi.mocked(getCustomFormByFeature).mockResolvedValue(customForm);
});

describe("club registration action loading", () => {
  it("shows guest login actions without requesting or serializing the form", async () => {
    setSession(undefined);
    const result = await ClubRegistrationAction(club);

    expect(getCustomFormByFeature).not.toHaveBeenCalled();
    expect(result.type).toBe(ClubRegistrationButton);
    expect(result.props).toEqual({
      ...club,
      isAuthenticated: false,
      hasActiveForm: false,
      customFormError: false,
    });
  });

  it.each([undefined, "test-session"])(
    "does not request a closed club's form for session %s",
    async (session) => {
      setSession(session);
      const result = await ClubRegistrationAction({
        ...club,
        isRegistrationOpen: false,
      });

      expect(getCustomFormByFeature).not.toHaveBeenCalled();
      expect(result.props).toEqual({
        ...club,
        isRegistrationOpen: false,
        isAuthenticated: Boolean(session),
        hasActiveForm: false,
        customFormError: false,
      });
    },
  );

  it.each([true, false])(
    "passes only form availability to authenticated visitors when active is %s",
    async (isActive) => {
      vi.mocked(getCustomFormByFeature).mockResolvedValue({
        ...customForm,
        is_active: isActive,
      });
      const result = await ClubRegistrationAction(club);

      expect(getCustomFormByFeature).toHaveBeenCalledExactlyOnceWith({
        feature_type: "club_registration",
        feature_id: club.clubId,
      });
      expect(result.props).toEqual({
        ...club,
        isAuthenticated: true,
        hasActiveForm: isActive,
        customFormError: false,
      });
    },
  );

  it.each([
    { error: new FetcherError("Not found", 404), customFormError: false },
    { error: new FetcherError("Unavailable", 503), customFormError: true },
    { error: new Error("Network failure"), customFormError: true },
  ])("preserves form error handling for $error.message", async (testCase) => {
    vi.mocked(getCustomFormByFeature).mockRejectedValue(testCase.error);
    const result = await ClubRegistrationAction(club);

    expect(result.props).toEqual({
      ...club,
      isAuthenticated: true,
      hasActiveForm: false,
      customFormError: testCase.customFormError,
    });
  });
});
