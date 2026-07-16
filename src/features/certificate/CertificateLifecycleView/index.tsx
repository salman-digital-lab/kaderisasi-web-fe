"use client";

import Link from "next/link";
import {
  Alert,
  Button,
  Container,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconCertificateOff,
  IconClockHour4,
} from "@tabler/icons-react";
import type { CertificateLifecycleSummary } from "@/types/model/certificate";

type CertificateLifecycleViewProps = {
  summary: CertificateLifecycleSummary;
};

export default function CertificateLifecycleView({
  summary,
}: CertificateLifecycleViewProps) {
  const isWaiting = summary.state === "eligible_not_issued";

  return (
    <Container component="main" size="sm" py="xl">
      <Paper p={{ base: "lg", sm: "xl" }} radius="md" withBorder>
        <Stack align="center" gap="lg" ta="center">
          <ThemeIcon
            color={isWaiting ? "yellow" : "gray"}
            radius="xl"
            size={72}
            variant="light"
          >
            {isWaiting ? (
              <IconClockHour4 aria-hidden size={36} />
            ) : (
              <IconCertificateOff aria-hidden size={36} />
            )}
          </ThemeIcon>

          <Stack gap="xs">
            <Title order={1} size="h2">
              {isWaiting
                ? "Sertifikat belum diterbitkan"
                : "Belum memenuhi syarat sertifikat"}
            </Title>
            <Text c="dimmed">
              {isWaiting
                ? "Anda sudah memenuhi syarat. Sertifikat akan tersedia setelah diterbitkan oleh panitia."
                : "Sertifikat hanya tersedia untuk peserta yang dinyatakan lulus pada kegiatan ini."}
            </Text>
          </Stack>

          {isWaiting && (
            <Alert
              color="blue"
              icon={<IconAlertTriangle aria-hidden size={20} />}
              title="Tidak perlu membuat ulang sertifikat"
            >
              Kunjungi kembali halaman kegiatan secara berkala. Tautan akan
              otomatis menuju sertifikat resmi setelah diterbitkan.
            </Alert>
          )}

          <Button component={Link} href="/profile?tab=activity" size="md">
            Kembali ke kegiatan saya
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
