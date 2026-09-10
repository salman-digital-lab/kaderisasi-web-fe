"use client";
import { Button } from "@mantine/core";
import type { ReactElement } from "react";
import PageState from "@/components/layout/PageState";

export default function CourseError({
  reset,
}: {
  reset: () => void;
}): ReactElement {
  return (
    <PageState
      title="Kelas belum dapat dimuat"
      description="Periksa koneksi Anda, lalu coba kembali."
    >
      <Button onClick={reset}>Coba kembali</Button>
    </PageState>
  );
}
