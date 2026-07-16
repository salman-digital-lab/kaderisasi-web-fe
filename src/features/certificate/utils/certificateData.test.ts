import { describe, expect, it } from "vitest";
import type {
  CertificateData,
  CertificateElement,
  CertificateLifecycleSummary,
} from "@/types/model/certificate";
import {
  getCertificateFilename,
  formatCertificateTimestamp,
  getCertificateCta,
  getCertificateLifecycleDestination,
  getCertificatePath,
  getCertificateShareDetails,
  getVerificationPath,
  isLegacyRegistrationParam,
  normalizeCertificateAppUrl,
  resolveOwnerCertificateText,
  resolvePublicCertificateText,
  toPublicCertificateData,
} from "./certificateData";

const renderData: CertificateData = {
  activity: {
    activity_start: "2026-07-01T00:00:00.000Z",
    id: 91,
    name: "Latihan Kepemimpinan",
  },
  certificate: {
    activity_id: 91,
    certificate_code: "CERT-2026-ABC",
    id: 50,
    issued_at: "2026-07-02T00:00:00.000Z",
    registration_id: 42,
    revoked_at: null,
    revoked_reason: null,
    template_id: 7,
  },
  participant: {
    activity_date: "1 Juli 2026",
    activity_name: "Latihan Kepemimpinan",
    email: "private@example.com",
    gender: "Laki-laki",
    name: "Budi Santoso",
    registration_id: 42,
    university: "Institut Teknologi Bandung",
    user_id: 99,
  },
  template: {
    background_image: "certificates/background.png",
    id: 7,
    name: "Template Utama",
    template_data: {
      backgroundUrl: null,
      canvasHeight: 700,
      canvasWidth: 1000,
      elements: [],
    },
  },
};

function variableElement(variable: string): CertificateElement {
  return {
    height: 30,
    id: variable,
    type: "variable-text",
    variable,
    width: 100,
    x: 0,
    y: 0,
  };
}

describe("certificate route helpers", () => {
  it("recognizes only exact positive numeric legacy parameters", () => {
    expect(isLegacyRegistrationParam("42")).toBe(true);
    expect(isLegacyRegistrationParam("42abc")).toBe(false);
    expect(isLegacyRegistrationParam("0")).toBe(false);
    expect(isLegacyRegistrationParam("01")).toBe(false);
    expect(isLegacyRegistrationParam("-1")).toBe(false);
  });

  it("builds encoded canonical and verification paths", () => {
    expect(getCertificatePath("CERT 1/2")).toBe("/certificate/CERT%201%2F2");
    expect(getVerificationPath("CERT 1/2")).toBe(
      "/certificate/verify/CERT%201%2F2",
    );
  });

  it("redirects only issued lifecycle states with a code", () => {
    const summary: CertificateLifecycleSummary = {
      certificate_code: "CERT-2026-ABC",
      issued_at: "2026-07-02T00:00:00.000Z",
      registration_id: 42,
      revoked_at: null,
      state: "issued_active",
    };

    expect(getCertificateLifecycleDestination(summary)).toBe(
      "/certificate/CERT-2026-ABC",
    );
    expect(
      getCertificateLifecycleDestination({
        ...summary,
        certificate_code: null,
        issued_at: null,
        state: "eligible_not_issued",
      }),
    ).toBeNull();
  });

  it("accepts only an absolute HTTPS certificate origin", () => {
    expect(normalizeCertificateAppUrl("https://kaderisasi.example/path")).toBe(
      "https://kaderisasi.example",
    );
    expect(normalizeCertificateAppUrl("http://kaderisasi.example")).toBeNull();
    expect(normalizeCertificateAppUrl("http://localhost:3000/path")).toBe(
      "http://localhost:3000",
    );
    expect(normalizeCertificateAppUrl("http://127.0.0.1:3000")).toBe(
      "http://127.0.0.1:3000",
    );
    expect(normalizeCertificateAppUrl("/relative")).toBeNull();
    expect(normalizeCertificateAppUrl(undefined)).toBeNull();
  });

  it("prefers canonical code CTAs and reflects lifecycle state", () => {
    expect(
      getCertificateCta({
        certificateCode: "CERT-1",
        certificateState: "issued_revoked",
        hasTemplate: false,
        isPassed: false,
        registrationId: 42,
      }),
    ).toEqual({
      color: "red",
      href: "/certificate/CERT-1",
      label: "Sertifikat Dicabut",
    });
    expect(
      getCertificateCta({
        certificateState: "eligible_not_issued",
        hasTemplate: true,
        isPassed: true,
        registrationId: 42,
      }),
    ).toEqual({
      color: "yellow",
      href: "/certificate/42",
      label: "Menunggu Penerbitan",
    });
    expect(
      getCertificateCta({
        hasTemplate: false,
        isPassed: true,
        registrationId: 42,
      }),
    ).toBeNull();
  });

  it("formats certificate timestamps in Indonesian time", () => {
    expect(formatCertificateTimestamp("2026-07-02T00:00:00.000Z")).toContain(
      "2 Juli 2026",
    );
    expect(formatCertificateTimestamp(null)).toBeNull();
    expect(formatCertificateTimestamp("not-a-date")).toBe("not-a-date");
  });
});

describe("certificate data privacy and rendering", () => {
  const publicData = toPublicCertificateData(renderData);

  it("removes email and internal identifiers from the public DTO", () => {
    expect(publicData.state).toBe("issued_active");
    expect(publicData.participant).toEqual({
      activity_date: "1 Juli 2026",
      activity_name: "Latihan Kepemimpinan",
      gender: "Laki-laki",
      name: "Budi Santoso",
      university: "Institut Teknologi Bandung",
    });
    expect(publicData.certificate).not.toHaveProperty("registration_id");
    expect(publicData.activity).not.toHaveProperty("id");
    expect(publicData.template).not.toHaveProperty("id");
  });

  it("renders only allowlisted public variables", () => {
    expect(
      resolvePublicCertificateText(variableElement("{{name}}"), publicData),
    ).toBe("Budi Santoso");
    expect(
      resolvePublicCertificateText(variableElement("university"), publicData),
    ).toBe("Institut Teknologi Bandung");
    expect(
      resolvePublicCertificateText(variableElement("gender"), publicData),
    ).toBe("Laki-laki");
    expect(
      resolvePublicCertificateText(variableElement("email"), publicData),
    ).toBe("");
    expect(
      resolvePublicCertificateText(
        variableElement("registration_id"),
        publicData,
      ),
    ).toBe("");
  });

  it("allows owner-only variables after authenticated download authorization", () => {
    expect(
      resolveOwnerCertificateText(variableElement("email"), renderData),
    ).toBe("private@example.com");
    expect(
      resolveOwnerCertificateText(
        variableElement("registration_id"),
        renderData,
      ),
    ).toBe("42");
  });

  it("creates safe filenames and share details", () => {
    expect(getCertificateFilename("  Budi / Santoso! ")).toBe(
      "sertifikat-budi-santoso.pdf",
    );
    expect(
      getCertificateShareDetails(
        publicData,
        "https://kaderisasi.example/certificate/CERT-2026-ABC",
      ),
    ).toEqual({
      text: "Verifikasi sertifikat Latihan Kepemimpinan atas nama Budi Santoso.",
      title: "Sertifikat Latihan Kepemimpinan",
      url: "https://kaderisasi.example/certificate/CERT-2026-ABC",
    });
  });
});
