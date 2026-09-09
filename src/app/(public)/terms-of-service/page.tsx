import type { Metadata } from "next";
import type { ReactElement } from "react";
import LegalPage from "@/features/legal/LegalPage";
import { termsSections } from "@/features/legal/content";

export const metadata: Metadata = {
  title: "Syarat dan Ketentuan",
  description:
    "Ketentuan penggunaan Kaderisasi Salman dan dasbor admin BMKA Salman ITB, termasuk akun, pendaftaran kegiatan, konten, sertifikat, dan hak akses.",
  alternates: { canonical: "/terms-of-service" },
  openGraph: {
    title: "Syarat dan Ketentuan | Kaderisasi Salman",
    url: "/terms-of-service",
  },
};

export default function TermsOfServicePage(): ReactElement {
  return (
    <LegalPage
      title="Syarat dan Ketentuan"
      englishTitle="Terms of Service"
      introduction="Ketentuan ini menjelaskan penggunaan layanan Kaderisasi Salman serta tanggung jawab pengguna dan pengelola."
      sections={termsSections}
      relatedHref="/privacy-policy"
      relatedTitle="Kebijakan Privasi"
    />
  );
}
