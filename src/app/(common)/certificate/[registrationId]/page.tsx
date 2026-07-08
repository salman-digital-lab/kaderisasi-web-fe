import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToken } from "@/functions/auth/getToken";
import { getCertificate, getCertificateByCode } from "@/services/certificate";
import CertificateView from "@/features/certificate/CertificateView";
import { FetcherError } from "@/functions/common/fetcher";

export const metadata: Metadata = {
  title: "Sertifikat | Kaderisasi Salman ITB",
  description: "Lihat dan unduh sertifikat kegiatan Anda",
};

export default async function CertificatePage(props: {
  params: Promise<{ registrationId: string }>;
}) {
  const params = await props.params;
  const certificateParam = params.registrationId;
  const registrationId = parseInt(certificateParam, 10);
  const isLegacyRegistrationUrl = !Number.isNaN(registrationId) && registrationId > 0;

  if (!certificateParam) {
    notFound();
  }

  // Check login state for gating the print/download button — no redirect
  const token = await getToken();

  try {
    const certificateData = isLegacyRegistrationUrl
      ? await getCertificate(registrationId)
      : await getCertificateByCode(certificateParam);

    return (
      <CertificateView
        data={certificateData}
        imageBaseUrl={process.env.NEXT_PUBLIC_IMAGE_BASE_URL || ""}
        appUrl={process.env.NEXT_PUBLIC_APP_URL || ""}
        isLoggedIn={!!token}
      />
    );
  } catch (error) {
    if (error instanceof FetcherError) {
      if (error.status === 404 || error.status === 400) {
        notFound();
      }
    }
    throw error;
  }
}
