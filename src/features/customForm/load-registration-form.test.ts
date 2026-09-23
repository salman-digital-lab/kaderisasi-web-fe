import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CustomForm, CustomFormField } from "@/types/api/customForm";
import { getCustomFormByFeature } from "@/services/customForm";
import { getProfile } from "@/services/profile";
import { getCountries, getProvinces } from "@/services/profile.cache";
import { loadRegistrationForm } from "./load-registration-form";

vi.mock("@/services/customForm", () => ({ getCustomFormByFeature: vi.fn() }));
vi.mock("@/services/profile", () => ({ getProfile: vi.fn() }));
vi.mock("@/services/profile.cache", () => ({
  getCountries: vi.fn(),
  getProvinces: vi.fn(),
}));

const feature = { feature_type: "club_registration", feature_id: 1 } as const;
function form(fields: CustomFormField[] = []): CustomForm {
  return {
    id: 1,
    schema_hash: "test",
    form_name: "Registration",
    form_description: "Description",
    ...feature,
    form_schema: { fields: [{ section_name: "profile_data", fields }] },
    is_active: true,
    created_at: "2026-09-23",
    updated_at: "2026-09-23",
  };
}
function field(key: string, hidden = false): CustomFormField {
  return { key, hidden, label: key, type: "select", required: false };
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(getCustomFormByFeature).mockResolvedValue(form());
  vi.mocked(getProvinces).mockResolvedValue([]);
  vi.mocked(getCountries).mockResolvedValue([]);
});

describe("registration form loading", () => {
  it("starts the profile before the schema resolves and skips unused reference data", async () => {
    let resolveForm!: (value: CustomForm) => void;
    vi.mocked(getCustomFormByFeature).mockReturnValue(
      new Promise((resolve) => {
        resolveForm = resolve;
      }),
    );
    const pending = loadRegistrationForm(feature, "test-session", false);
    expect(getProfile).toHaveBeenCalledWith("test-session");
    resolveForm(form());
    await pending;
    expect(getCountries).not.toHaveBeenCalled();
    expect(getProvinces).not.toHaveBeenCalled();
  });

  it("loads the reference lists used by member profile controls", async () => {
    vi.mocked(getCustomFormByFeature).mockResolvedValue(
      form([field("origin_province_id"), field("country")]),
    );
    await loadRegistrationForm(feature, "test-session", false);
    expect(getProvinces).toHaveBeenCalledOnce();
    expect(getCountries).toHaveBeenCalledOnce();
  });

  it("does not load a profile or country list for guests", async () => {
    vi.mocked(getCustomFormByFeature).mockResolvedValue(
      form([field("province_id"), field("country")]),
    );
    await loadRegistrationForm(feature, "", true);
    expect(getProvinces).toHaveBeenCalledOnce();
    expect(getProfile).not.toHaveBeenCalled();
    expect(getCountries).not.toHaveBeenCalled();
  });

  it("skips reference lists for hidden controls", async () => {
    vi.mocked(getCustomFormByFeature).mockResolvedValue(
      form([field("province_id", true), field("country", true)]),
    );
    await loadRegistrationForm(feature, "test-session", false);
    expect(getProvinces).not.toHaveBeenCalled();
    expect(getCountries).not.toHaveBeenCalled();
  });

  it("preserves form errors when the profile request also fails", async () => {
    const error = new Error("Form not found");
    vi.mocked(getCustomFormByFeature).mockRejectedValue(error);
    vi.mocked(getProfile).mockRejectedValue(new Error("Unauthorized"));
    await expect(loadRegistrationForm(feature, "expired", false)).rejects.toBe(
      error,
    );
  });

  it("propagates profile failures rather than rendering an unauthenticated member form", async () => {
    const error = new Error("Unauthorized");
    vi.mocked(getProfile).mockRejectedValue(error);
    await expect(loadRegistrationForm(feature, "expired", false)).rejects.toBe(
      error,
    );
  });
});
