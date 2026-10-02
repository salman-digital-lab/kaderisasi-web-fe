import { describe, expect, it } from "vitest";
import {
  initialOpenSections,
  sectionForField,
  sectionHasData,
} from "./form-sections";
import type { ProfileFormValues } from "./form-values";

const empty: ProfileFormValues = {
  name: "Peserta",
  gender: undefined,
  personal_id: "",
  birth_date: null,
  province_id: null,
  city_id: null,
  origin_province_id: null,
  origin_city_id: null,
  country: null,
  whatsapp: "",
  line: "",
  linkedin: "",
  instagram: "",
  tiktok: "",
  education_history: [],
  work_history: [],
  extra_data: { preferred_name: "", current_activity_focus: [] },
};

describe("profile form sections", () => {
  it("maps nested and list fields to their section", () => {
    expect(sectionForField("name")).toBe("identity");
    expect(sectionForField("extra_data.preferred_name")).toBe("identity");
    expect(sectionForField("work_history.0.company")).toBe("work");
    expect(sectionForField("extra_data.current_activity_focus")).toBe("focus");
    expect(sectionForField("origin_city_id")).toBe("origin");
    expect(sectionForField("unknown")).toBeUndefined();
  });

  it("treats blank strings and empty lists as no data", () => {
    expect(sectionHasData("contact", { ...empty, whatsapp: "  " })).toBe(false);
    expect(sectionHasData("contact", { ...empty, tiktok: "uji" })).toBe(true);
    expect(sectionHasData("education", empty)).toBe(false);
  });

  it("opens identity plus sections that already hold data", () => {
    expect(initialOpenSections(empty)).toEqual(["identity"]);
    expect(
      initialOpenSections({
        ...empty,
        province_id: "1",
        extra_data: { preferred_name: "", current_activity_focus: ["social"] },
      }),
    ).toEqual(["identity", "domicile", "focus"]);
  });
});
