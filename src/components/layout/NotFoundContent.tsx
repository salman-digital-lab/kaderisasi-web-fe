import type { ReactElement } from "react";
import LinkButton from "@/components/common/LinkButton";
import PageState from "./PageState";

export default function NotFoundContent(): ReactElement {
  return (
    <PageState
      title="Halaman tidak ditemukan"
      description="Halaman ini mungkin sudah dipindahkan atau alamatnya tidak sesuai. Kembali ke beranda untuk menemukan kegiatan dan layanan yang Anda cari."
    >
      <LinkButton href="/">Kembali ke Beranda</LinkButton>
    </PageState>
  );
}
