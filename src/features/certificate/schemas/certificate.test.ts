import { describe, expect, it } from "vitest";
import {
  certificateCodeInputSchema,
  certificateLifecycleSchema,
  certificateVerificationSchema,
  publicCertificateDataSchema,
} from "./certificate";

describe("certificate boundary schemas", () => {
  it.each([
    "not_eligible",
    "eligible_not_issued",
    "issued_active",
    "issued_revoked",
  ] as const)("accepts the %s lifecycle state", (state) => {
    expect(
      certificateLifecycleSchema.safeParse({
        certificate_code: state.startsWith("issued") ? "CERT-1" : null,
        issued_at: state.startsWith("issued") ? "2026-07-01" : null,
        registration_id: 1,
        revoked_at: state === "issued_revoked" ? "2026-07-02" : null,
        state,
      }).success,
    ).toBe(true);
  });

  it("rejects malformed lifecycle data", () => {
    expect(
      certificateLifecycleSchema.safeParse({
        certificate_code: null,
        issued_at: null,
        registration_id: "1",
        revoked_at: null,
        state: "unknown",
      }).success,
    ).toBe(false);
    expect(
      certificateLifecycleSchema.safeParse({
        certificate_code: null,
        issued_at: null,
        registration_id: 1,
        revoked_at: null,
        state: "issued_active",
      }).success,
    ).toBe(false);
  });

  it("validates dedicated verification results", () => {
    expect(
      certificateVerificationSchema.safeParse({
        activity_date: "1 Juli 2026",
        activity_name: "Latihan Kepemimpinan",
        certificate_code: "CERT-1",
        issued_at: "2026-07-02",
        participant_name: "Budi Santoso",
        revoked_at: null,
        revoked_reason: null,
        state: "issued_active",
        valid: true,
      }).success,
    ).toBe(true);
  });

  it("validates the locked public render shape and state consistency", () => {
    const payload = {
      activity: {
        activity_date: "1 Juli 2026",
        activity_start: "2026-07-01",
        name: "Latihan Kepemimpinan",
      },
      certificate: {
        certificate_code: "CERT-1",
        issued_at: "2026-07-02",
        revoked_at: null,
        revoked_reason: null,
      },
      participant: {
        activity_date: "1 Juli 2026",
        activity_name: "Latihan Kepemimpinan",
        gender: "Laki-laki",
        name: "Budi Santoso",
        university: "Institut Teknologi Bandung",
      },
      state: "issued_active",
      template: {
        background_image: null,
        name: "Template Utama",
        template_data: {
          backgroundUrl: null,
          canvasHeight: 700,
          canvasWidth: 1000,
          elements: [],
        },
      },
    };

    expect(publicCertificateDataSchema.safeParse(payload).success).toBe(true);
    expect(
      publicCertificateDataSchema.safeParse({
        ...payload,
        state: "issued_revoked",
      }).success,
    ).toBe(false);
  });

  it("normalizes valid user input and rejects route-like input", () => {
    expect(certificateCodeInputSchema.parse("  cert-2026-1  ")).toBe(
      "CERT-2026-1",
    );
    expect(certificateCodeInputSchema.safeParse("CERT_2026").success).toBe(
      false,
    );
    expect(certificateCodeInputSchema.safeParse("CERT/../../1").success).toBe(
      false,
    );
    expect(certificateCodeInputSchema.safeParse("A".repeat(97)).success).toBe(
      false,
    );
  });
});
