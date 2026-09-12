import { describe, expect, it } from "vitest";
import { profileTabId } from "./types";
import { validateProfilePicture } from "./picture-validation";
import { profileFormRequest, profileFormValues } from "./form-values";
import type { Member } from "@/types/model/members";
import { profileValidationErrors } from "./form-schema";

describe("profile state", () => {
  it("accepts only known tab names including prototype-like input", () => {
    expect(profileTabId(null)).toBe("profiledata");
    expect(profileTabId("invalid")).toBe("profiledata");
    expect(profileTabId("toString")).toBe("profiledata");
    expect(profileTabId("achievements")).toBe("achievements");
  });
  it("validates photo size and type", () => {
    expect(
      validateProfilePicture({ type: "image/png", size: 2 * 1024 * 1024 }),
    ).toBeUndefined();
    expect(
      validateProfilePicture({ type: "image/jpeg", size: 1 }),
    ).toBeUndefined();
    expect(
      validateProfilePicture({ type: "image/png", size: 2 * 1024 * 1024 + 1 }),
    ).toContain("2 MB");
    expect(validateProfilePicture({ type: "text/plain", size: 1 })).toContain(
      "JPG",
    );
    expect(validateProfilePicture({ type: "image/png", size: 0 })).toContain(
      "kosong",
    );
  });
  it("round-trips dates, legacy histories, location ids and unedited extra data", () => {
    const member = {
      name: "Peserta",
      gender: null,
      birth_date: "2000-05-15T00:00:00Z",
      province_id: 1,
      city_id: 11,
      origin_province_id: 2,
      origin_city_id: 21,
      education_history: [],
      work_history: [],
      extra_data: {
        current_activity_focus: ["academic"],
        kaderisasi_path: { ssc: 13 },
      },
    } as unknown as Member;
    const values = profileFormValues(member);
    expect(profileValidationErrors(values)).toEqual({});
    expect(values.birth_date).toBe("2000-05-15");
    expect(values.city_id).toBe("11");
    const request = profileFormRequest(values);
    expect(request.birth_date).toBe("2000-05-15");
    expect(request.origin_city_id).toBe(21);
    expect(request.extra_data?.kaderisasi_path).toEqual({ ssc: 13 });
    expect(
      profileValidationErrors({
        ...values,
        name: " ",
        birth_date: "2001-02-29",
        city_id: null,
      }),
    ).toMatchObject({
      name: "Nama lengkap wajib diisi.",
      birth_date: "Tanggal lahir tidak valid.",
      city_id: "Pilih kota / kabupaten untuk provinsi ini.",
    });
  });
});
