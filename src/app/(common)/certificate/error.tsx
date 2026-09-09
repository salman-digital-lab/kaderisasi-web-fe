"use client";

import { Button, Group } from "@mantine/core";
import type { ReactElement } from "react";
import PageState from "@/components/layout/PageState";
import LinkButton from "@/components/common/LinkButton";

export default function CertificateError({
  retry,
}: {
  retry: () => void;
}): ReactElement {
  return (
    <PageState
      title="Sertifikat belum dapat dimuat"
      description="Terjadi gangguan saat mengambil data sertifikat. Coba beberapa saat lagi."
    >
      <Group justify="center">
        <Button onClick={retry}>Coba lagi</Button>
        <LinkButton href="/certificate/verify" variant="default">
          Kembali ke verifikasi
        </LinkButton>
      </Group>
    </PageState>
  );
}
