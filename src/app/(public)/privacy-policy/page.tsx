import type { Metadata } from "next";
import type { ReactElement } from "react";
import LegalPage from "@/features/legal/LegalPage";
import { privacySections } from "@/features/legal/content";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description:
    "Cara Kaderisasi Salman dan dasbor admin BMKA Salman ITB mengumpulkan, menggunakan, menyimpan, dan melindungi data pribadi, termasuk data Masuk dengan Google.",
  alternates: { canonical: "/privacy-policy" },
  openGraph: {
    title: "Kebijakan Privasi | Kaderisasi Salman",
    url: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage(): ReactElement {
  return (
    <LegalPage
      title="Kebijakan Privasi"
      englishTitle="Privacy Policy"
      introduction="Pelajari data yang diproses saat Anda menggunakan Kaderisasi Salman, tujuan penggunaannya, serta pilihan Anda untuk mengelola data tersebut."
      sections={privacySections}
      relatedHref="/terms-of-service"
      relatedTitle="Syarat dan Ketentuan"
    />
  );
}
