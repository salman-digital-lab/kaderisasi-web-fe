import type { ReactElement } from "react";
import PageState from "@/components/layout/PageState";
import LinkButton from "@/components/common/LinkButton";

export default function CourseNotFound(): ReactElement {
  return (
    <PageState
      title="Kelas tidak tersedia"
      description="Kelas atau materi ini tidak tersedia untuk akun Anda."
    >
      <LinkButton href="/kelas">Kembali ke kelas</LinkButton>
    </PageState>
  );
}
