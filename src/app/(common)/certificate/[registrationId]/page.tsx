import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import CertificateLifecycleView from "@/features/certificate/CertificateLifecycleView";
import CertificateConfigurationError from "@/features/certificate/CertificateConfigurationError";
import CertificateUnavailableView, {
  type CertificateUnavailableReason,
} from "@/features/certificate/CertificateUnavailableView";
import CertificateView from "@/features/certificate/CertificateView";
import { certificateCodeInputSchema } from "@/features/certificate/schemas/certificate";
import {
  getCertificateLifecycleDestination,
  getCertificatePath,
  isLegacyRegistrationParam,
  normalizeCertificateAppUrl,
} from "@/features/certificate/utils/certificateData";
import { getToken } from "@/functions/auth/getToken";
import { FetcherError } from "@/functions/common/fetcher";
import {
  getCertificateByCode,
  getCertificateLifecycle,
} from "@/services/certificate";

export const metadata: Metadata = {
  title: "Sertifikat | Kaderisasi Salman ITB",
  description:
    "Lihat dan verifikasi sertifikat kegiatan Kaderisasi Salman ITB.",
  robots: {
    follow: false,
    googleBot: { follow: false, index: false, noarchive: true },
    index: false,
    nocache: true,
  },
};

function getLoginPath(certificatePath: string): string {
  return `/login?redirect=${encodeURIComponent(certificatePath)}`;
}

function getUnavailableReason(
  status: number,
): CertificateUnavailableReason | null {
  if (status === 403) return "forbidden";
  if (status === 409) return "not-issued";
  if (status === 410) return "revoked";
  if (status === 422) return "template-unavailable";
  if (status === 429) return "rate-limited";
  return null;
}

export default async function CertificatePage(props: {
  params: Promise<{ registrationId: string }>;
}) {
  const { registrationId: certificateParam } = await props.params;
  if (!certificateParam) notFound();

  if (isLegacyRegistrationParam(certificateParam)) {
    const legacyPath = `/certificate/${certificateParam}`;
    const token = await getToken();
    if (!token) redirect(getLoginPath(legacyPath));

    const registrationId = Number(certificateParam);
    if (!Number.isSafeInteger(registrationId)) notFound();

    try {
      const summary = await getCertificateLifecycle(token, registrationId);
      const canonicalPath = getCertificateLifecycleDestination(summary);
      if (canonicalPath) redirect(canonicalPath);

      return <CertificateLifecycleView summary={summary} />;
    } catch (error) {
      if (error instanceof FetcherError) {
        if (error.status === 401) redirect(getLoginPath(legacyPath));
        if (error.status === 404) notFound();
        const reason = getUnavailableReason(error.status);
        if (reason) return <CertificateUnavailableView reason={reason} />;
      }
      throw error;
    }
  }

  const parsedCode = certificateCodeInputSchema.safeParse(certificateParam);
  if (!parsedCode.success) notFound();

  try {
    const [certificateData, token] = await Promise.all([
      getCertificateByCode(parsedCode.data),
      getToken(),
    ]);

    if (certificateParam !== certificateData.certificate.certificate_code) {
      redirect(
        getCertificatePath(certificateData.certificate.certificate_code),
      );
    }

    const appUrl = normalizeCertificateAppUrl(process.env.NEXT_PUBLIC_APP_URL);
    if (!appUrl) return <CertificateConfigurationError />;

    return (
      <CertificateView
        appUrl={appUrl}
        data={certificateData}
        imageBaseUrl={process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? ""}
        isLoggedIn={Boolean(token)}
      />
    );
  } catch (error) {
    if (error instanceof FetcherError) {
      if (error.status === 404) notFound();
      const reason = getUnavailableReason(error.status);
      if (reason) return <CertificateUnavailableView reason={reason} />;
    }
    throw error;
  }
}
