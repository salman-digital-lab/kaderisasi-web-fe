"use client";

import { useEffect, useMemo } from "react";
import CertificateView from "@/features/certificate/CertificateView";
import VerificationSearch from "@/features/certificate/VerificationSearch";
import { toPublicCertificateData } from "@/features/certificate/utils/certificateData";
import type { CertificateData } from "@/types/model/certificate";
import type { CertificateDownloadAccess } from "@/services/certificate";

const gradient = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="566"><rect width="800" height="566" fill="#faf7ef"/><path d="M0 0H800V35H35V566H0Z" fill="#297480"/><circle cx="730" cy="495" r="115" fill="#deb76b" opacity=".15"/></svg>')}`;
export const certificateFixture: CertificateData = {
  activity: {
    name: "Pelatihan Kepemimpinan Salman 2026",
    activity_start: "2026-09-09",
  },
  participant: {
    name: "Muhammad Abdurrahman Pratama Wiratama Kusumah",
    activity_name: "Pelatihan Kepemimpinan Salman 2026",
    activity_date: "9 September 2026",
    university: "Institut Teknologi Bandung",
    gender: "",
    email: "fixture@example.test",
  },
  certificate: {
    certificate_code: "CERT-LAB-2026",
    issued_at: "2026-09-09T00:00:00Z",
    revoked_at: null,
    revoked_reason: null,
  },
  template: {
    name: "Sertifikat pelatihan",
    background_image: gradient,
    template_data: {
      backgroundUrl: null,
      canvasWidth: 800,
      canvasHeight: 566,
      elements: [
        {
          id: "title",
          type: "static-text",
          content: "SERTIFIKAT",
          x: 80,
          y: 60,
          width: 640,
          height: 70,
          fontSize: 38,
          fontFamily: "Georgia",
          fontWeight: "bold",
          letterSpacing: 4,
          color: "#205e67",
        },
        {
          id: "caption",
          type: "static-text",
          content: "Diberikan kepada",
          x: 80,
          y: 145,
          width: 640,
          height: 40,
          fontSize: 18,
        },
        {
          id: "name",
          type: "variable-text",
          variable: "{{name}}",
          x: 80,
          y: 195,
          width: 640,
          height: 110,
          fontSize: 30,
          fontFamily: "Georgia",
          fontWeight: "bold",
          color: "#205e67",
        },
        {
          id: "activity",
          type: "variable-text",
          variable: "{{activity_name}}",
          x: 90,
          y: 325,
          width: 620,
          height: 55,
          fontSize: 21,
        },
        {
          id: "unicode",
          type: "static-text",
          content: "Salman · العربية · 日本語 · é",
          x: 80,
          y: 395,
          width: 400,
          height: 40,
          fontSize: 16,
          rotation: -8,
          opacity: 65,
        },
        {
          id: "code",
          type: "variable-text",
          variable: "{{certificate_code}}",
          x: 80,
          y: 480,
          width: 440,
          height: 35,
          fontSize: 14,
        },
        { id: "qr", type: "qr-code", x: 615, y: 395, width: 120, height: 120 },
      ],
    },
  },
};
export default function CertificateLab({
  access,
  revoked = false,
  downloadStatus = 200,
  broken = false,
  portrait = false,
}: {
  access: CertificateDownloadAccess;
  revoked?: boolean;
  downloadStatus?: number;
  broken?: boolean;
  portrait?: boolean;
}): React.ReactElement {
  const fixture = useMemo(() => {
    const value = structuredClone(certificateFixture);
    if (broken)
      value.template.background_image =
        "http://localhost:3000/certificate-lab/missing.png";
    if (portrait) {
      value.template.template_data.canvasWidth = 566;
      value.template.template_data.canvasHeight = 800;
      value.template.template_data.elements =
        value.template.template_data.elements.map((element) => ({
          ...element,
          x: element.x * 0.7075,
          width: element.width * 0.7075,
          y: element.y * 1.4134,
          height: element.height * 1.4134,
        }));
    }
    return value;
  }, [broken, portrait]);
  useEffect(() => {
    const original = window.fetch;
    window.fetch = async (input, init) => {
      if (
        typeof input === "string" &&
        input === "/api/certificates/CERT-LAB-2026/download"
      )
        return Response.json({ data: fixture }, { status: downloadStatus });
      return original(input, init);
    };
    return () => {
      window.fetch = original;
    };
  }, [downloadStatus, fixture]);
  const data = toPublicCertificateData({
    ...fixture,
    certificate: {
      ...fixture.certificate,
      revoked_at: revoked ? "2026-09-09T00:00:00Z" : null,
      revoked_reason: revoked ? "Contoh sertifikat dicabut" : null,
    },
  });
  return (
    <>
      <CertificateView
        data={data}
        access={access}
        appUrl="http://localhost:3000"
        imageBaseUrl=""
      />
      <div style={{ maxWidth: 800, margin: "24px auto", padding: 16 }}>
        <VerificationSearch appUrl="http://localhost:3000" />
      </div>
    </>
  );
}
