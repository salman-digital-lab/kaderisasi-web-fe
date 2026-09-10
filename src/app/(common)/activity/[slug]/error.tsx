"use client";

import { useEffect } from "react";
import type { ReactElement } from "react";
import { Alert, Button, Group, Stack, Title } from "@mantine/core";
import { IconAlertCircle, IconRefresh } from "@tabler/icons-react";
import PageContainer from "@/components/layout/PageContainer";
import LinkButton from "@/components/common/LinkButton";

export default function ActivityDetailError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}): ReactElement {
  useEffect(() => {
    console.error("Activity detail error:", error);
  }, [error]);

  return (
    <PageContainer size="md">
      <Stack gap="lg">
        <Title order={1} size="h2">
          Kami tidak dapat membuka kegiatan ini
        </Title>
        <Alert
          color="red"
          title="Detail kegiatan belum dapat dimuat"
          icon={<IconAlertCircle aria-hidden="true" />}
        >
          Terjadi kendala saat mengambil informasi kegiatan. Periksa koneksi
          Anda lalu coba lagi.
        </Alert>
        <Group>
          <Button
            onClick={retry}
            leftSection={<IconRefresh size={18} aria-hidden="true" />}
          >
            Coba lagi
          </Button>
          <LinkButton href="/activity" variant="default">
            Kembali ke daftar kegiatan
          </LinkButton>
        </Group>
      </Stack>
    </PageContainer>
  );
}
