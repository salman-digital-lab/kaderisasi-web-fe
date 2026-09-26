import type { ReactElement } from "react";
import PageHeader from "@/components/layout/PageHeader";

export default function StatusHeader(): ReactElement {
  return (
    <PageHeader
      title="Cek Status Kegiatan"
      description="Pendaftaran, hasil seleksi, dan kelulusan kegiatan Anda."
    />
  );
}
