"use client";

import { Button, Paper, Text, Title } from "@mantine/core";
import type { ReactElement } from "react";
import PageContainer from "@/components/layout/PageContainer";
import StatusHeader from "@/features/status/StatusHeader";
import classes from "@/features/status/status.module.css";

export default function Error({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}): ReactElement {
  return (
    <PageContainer size="lg">
      <StatusHeader />
      <Paper withBorder className={classes.empty}>
        <Title order={2} size="h3">
          Status kegiatan belum dapat dimuat
        </Title>
        <Text c="dimmed">
          Terjadi kendala saat mengambil pendaftaran Anda. Silakan coba lagi.
        </Text>
        <Button onClick={retry}>Coba lagi</Button>
      </Paper>
    </PageContainer>
  );
}
