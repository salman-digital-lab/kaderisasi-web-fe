import type { ComponentProps } from "react";
import CertificateConfigurationError from "@/features/certificate/CertificateConfigurationError";
import CertificateLifecycleView from "@/features/certificate/CertificateLifecycleView";
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
  getCertificateAccessDetails,
  getCertificateByCode,
  getCertificateLifecycle,
  getOwnedCertificateForDownload,
} from "@/services/certificate";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

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

    let summary: Awaited<ReturnType<typeof getCertificateLifecycle>>;
    try {
      summary = await getCertificateLifecycle(token, registrationId);
    } catch (error) {
      if (error instanceof FetcherError) {
        if (error.status === 401) redirect(getLoginPath(legacyPath));
        if (error.status === 404) notFound();
        const reason = getUnavailableReason(error.status);
        if (reason) return <CertificateUnavailableView reason={reason} />;
      }
      throw error;
    }

    const canonicalPath = getCertificateLifecycleDestination(summary);
    if (canonicalPath) redirect(canonicalPath);

    return <CertificateLifecycleView summary={summary} />;
  }

  const parsedCode = certificateCodeInputSchema.safeParse(certificateParam);
  if (!parsedCode.success) notFound();

  let view: Omit<ComponentProps<typeof CertificateView>, "imageBaseUrl"> | null;
  try {
    const tokenPromise = getToken();
    const [certificateData, { access, currentCode }] = await Promise.all([
      getCertificateByCode(parsedCode.data),
      tokenPromise.then((token) =>
        getCertificateAccessDetails(token ?? null, parsedCode.data),
      ),
    ]);

    if (certificateParam !== certificateData.certificate.certificate_code) {
      redirect(
        getCertificatePath(certificateData.certificate.certificate_code),
      );
    }

    const appUrl = normalizeCertificateAppUrl(process.env.NEXT_PUBLIC_APP_URL);
    if (!appUrl) {
      view = null;
    } else {
      const token = await tokenPromise;
      const ownerCertificate =
        access === "owner" && token
          ? await getOwnedCertificateForDownload(token, parsedCode.data)
          : undefined;
      view = {
        appUrl,
        data: certificateData,
        access,
        currentCode,
        ownerScore: ownerCertificate?.participant.scoring_result,
      };
    }
  } catch (error) {
    if (error instanceof FetcherError) {
      if (error.status === 404) notFound();
      const reason = getUnavailableReason(error.status);
      if (reason) return <CertificateUnavailableView reason={reason} />;
    }
    throw error;
  }

  if (!view) return <CertificateConfigurationError />;

  return (
    <CertificateView
      {...view}
      imageBaseUrl={process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? ""}
    />
  );
}
