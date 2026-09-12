"use client";
import { Button } from "@mantine/core";
import type { ReactElement } from "react";
import PageState from "@/components/layout/PageState";

export default function CourseError({
  retry,
}: {
  retry: () => void;
}): ReactElement {
  return (
    <PageState
      title="Kelas belum dapat dimuat"
      description="Periksa koneksi Anda, lalu coba kembali."
    >
      <Button onClick={retry}>Coba kembali</Button>
    </PageState>
  );
}
