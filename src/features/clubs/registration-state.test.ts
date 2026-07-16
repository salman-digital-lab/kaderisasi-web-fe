import { describe, expect, it } from "vitest";
import {
  getRegistrationPresentation,
  isClubRegistrationOpen,
} from "./registration-state";

describe("Club registration state helpers", () => {
  const now = new Date("2026-07-16T05:00:00.000Z");

  it("honors the configured registration flag and Jakarta end date", () => {
    expect(
      isClubRegistrationOpen({
        isRegistrationOpen: true,
        registrationEndDate: null,
        now,
      }),
    ).toBe(true);
    expect(
      isClubRegistrationOpen({
        isRegistrationOpen: true,
        registrationEndDate: "2026-07-16",
        now,
      }),
    ).toBe(true);
    expect(
      isClubRegistrationOpen({
        isRegistrationOpen: true,
        registrationEndDate: "2026-07-15",
        now,
      }),
    ).toBe(false);
    expect(
      isClubRegistrationOpen({
        isRegistrationOpen: false,
        registrationEndDate: null,
        now,
      }),
    ).toBe(false);
    expect(
      isClubRegistrationOpen({
        isRegistrationOpen: true,
        registrationEndDate: "2026-02-30",
        now,
      }),
    ).toBe(false);
  });

  it("fails closed for malformed deadlines", () => {
    expect(
      isClubRegistrationOpen({
        isRegistrationOpen: true,
        registrationEndDate: "not-a-date",
        now,
      }),
    ).toBe(false);
  });

  it("uses distinct, non-contradictory copy for every registration status", () => {
    expect(getRegistrationPresentation("PENDING")).toMatchObject({
      color: "orange",
    });
    expect(getRegistrationPresentation("APPROVED")).toMatchObject({
      color: "green",
    });
    expect(getRegistrationPresentation("REJECTED")).toMatchObject({
      color: "red",
    });
  });
});
