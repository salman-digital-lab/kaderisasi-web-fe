import type { ReactElement } from "react";
import PageState from "@/components/layout/PageState";
import LinkButton from "@/components/common/LinkButton";

export default function CertificateNotFound(): ReactElement {
  return (
    <PageState
      title="Sertifikat tidak ditemukan"
      description="Periksa kembali kode sertifikat atau minta tautan resmi kepada pemilik sertifikat."
    >
      <LinkButton href="/certificate/verify">Verifikasi kode lain</LinkButton>
    </PageState>
  );
}
