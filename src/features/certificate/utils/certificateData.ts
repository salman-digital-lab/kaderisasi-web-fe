import type {
  CertificateData,
  CertificateElement,
  CertificateLifecycleSummary,
  CertificateLifecycleState,
  PublicCertificateData,
} from "@/types/model/certificate";

const LEGACY_REGISTRATION_PATTERN = /^[1-9]\d*$/;

export function normalizeCertificateAppUrl(
  value: string | undefined,
): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    const isLocalHttp =
      url.protocol === "http:" &&
      ["localhost", "127.0.0.1", "[::1]", "::1"].includes(url.hostname);
    if (url.protocol !== "https:" && !isLocalHttp) return null;
    return url.origin;
  } catch {
    return null;
  }
}

export type CertificateCta = {
  color: "green" | "red" | "yellow";
  href: string;
  label:
    | "Lihat Sertifikat"
    | "Sertifikat Dicabut"
    | "Menunggu Penerbitan"
    | "Cek Sertifikat";
};

export function getCertificateCta({
  certificateCode,
  certificateState,
  hasTemplate,
  isPassed,
  registrationId,
}: {
  certificateCode?: string | null;
  certificateState?: CertificateLifecycleState;
  hasTemplate: boolean;
  isPassed: boolean;
  registrationId?: number;
}): CertificateCta | null {
  const href = certificateCode
    ? getCertificatePath(certificateCode)
    : registrationId
      ? `/certificate/${registrationId}`
      : null;

  if (!href) return null;
  if (certificateCode || certificateState?.startsWith("issued_")) {
    return certificateState === "issued_revoked"
      ? { color: "red", href, label: "Sertifikat Dicabut" }
      : { color: "green", href, label: "Lihat Sertifikat" };
  }
  if (certificateState === "eligible_not_issued") {
    return { color: "yellow", href, label: "Menunggu Penerbitan" };
  }
  if (certificateState === "not_eligible") return null;
  if (isPassed && hasTemplate) {
    return { color: "yellow", href, label: "Cek Sertifikat" };
  }

  return null;
}

export function formatCertificateTimestamp(
  value: string | null,
): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

export function isLegacyRegistrationParam(value: string): boolean {
  return LEGACY_REGISTRATION_PATTERN.test(value);
}

export function getCertificatePath(certificateCode: string): string {
  return `/certificate/${encodeURIComponent(certificateCode)}`;
}

export function getCertificateLifecycleDestination(
  summary: CertificateLifecycleSummary,
): string | null {
  const isIssued =
    summary.state === "issued_active" || summary.state === "issued_revoked";

  return isIssued && summary.certificate_code
    ? getCertificatePath(summary.certificate_code)
    : null;
}

export function getVerificationPath(certificateCode: string): string {
  return `/certificate/verify/${encodeURIComponent(certificateCode)}`;
}

export function getCertificateShareDetails(
  data: PublicCertificateData,
  certificateUrl: string,
): { title: string; text: string; url: string } {
  return {
    title: `Sertifikat ${data.activity.name}`,
    text: `Verifikasi sertifikat ${data.activity.name} atas nama ${data.participant.name}.`,
    url: certificateUrl,
  };
}

export function toPublicCertificateData(
  data: CertificateData,
): PublicCertificateData {
  return {
    state: data.certificate.revoked_at ? "issued_revoked" : "issued_active",
    activity: {
      name: data.activity.name,
      activity_start: data.activity.activity_start,
    },
    template: {
      name: data.template.name,
      background_image: data.template.background_image,
      template_data: data.template.template_data,
    },
    participant: {
      name: data.participant.name,
      activity_name: data.participant.activity_name,
      activity_date: data.participant.activity_date,
      university: data.participant.university,
      gender: data.participant.gender,
    },
    certificate: {
      certificate_code: data.certificate.certificate_code,
      issued_at: data.certificate.issued_at,
      revoked_at: data.certificate.revoked_at,
      revoked_reason: data.certificate.revoked_reason,
    },
  };
}

function normalizeVariable(variable: string | undefined): string {
  return variable?.replace(/\{\{|\}\}/g, "").trim() ?? "";
}

export function resolvePublicCertificateText(
  element: CertificateElement,
  data: PublicCertificateData,
): string {
  if (element.type === "static-text") return element.content ?? "";
  if (element.type !== "variable-text") return "";

  switch (normalizeVariable(element.variable)) {
    case "name":
      return data.participant.name;
    case "activity_name":
      return data.participant.activity_name;
    case "university":
      return data.participant.university ?? "";
    case "gender":
      return data.participant.gender ?? "";
    case "activity_date":
    case "date":
      return data.participant.activity_date;
    case "certificate_id":
    case "certificate_code":
      return data.certificate.certificate_code;
    default:
      return "";
  }
}

export function resolveOwnerCertificateText(
  element: CertificateElement,
  data: CertificateData,
): string {
  if (element.type === "static-text") return element.content ?? "";
  if (element.type !== "variable-text") return "";

  switch (normalizeVariable(element.variable)) {
    case "name":
      return data.participant.name;
    case "email":
      return data.participant.email ?? "";
    case "university":
      return data.participant.university ?? "";
    case "gender":
      return data.participant.gender ?? "";
    case "activity_name":
      return data.participant.activity_name;
    case "activity_date":
    case "date":
      return data.participant.activity_date;
    case "registration_id":
      return data.participant.registration_id
        ? String(data.participant.registration_id)
        : "";
    case "user_id":
      return data.participant.user_id ? String(data.participant.user_id) : "";
    case "certificate_id":
    case "certificate_code":
      return data.certificate.certificate_code;
    default:
      return "";
  }
}

export function getCertificateFilename(participantName: string): string {
  const safeName = participantName
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();

  return `sertifikat-${safeName || "peserta"}.pdf`;
}
