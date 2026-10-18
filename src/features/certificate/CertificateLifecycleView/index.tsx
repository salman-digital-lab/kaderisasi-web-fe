"use client";

import PageContainer from "@/components/layout/PageContainer";

import Link from "next/link";
import {
  Alert,
  Button,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconCertificateOff,
  IconClockHour4,
  IconInfoCircle,
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
    <PageContainer size="sm">
      <Paper p={{ base: "md", sm: "xl" }} radius="md" withBorder>
        <Stack gap="lg">
          <Stack align="center" gap="sm" ta="center">
            <ThemeIcon
              color={isWaiting ? "yellow" : "gray"}
              radius="xl"
              size={56}
              variant="light"
            >
              {isWaiting ? (
                <IconClockHour4 aria-hidden size={28} />
              ) : (
                <IconCertificateOff aria-hidden size={28} />
              )}
            </ThemeIcon>
            <Title order={1} size="h3">
              {isWaiting
                ? "Sertifikat belum diterbitkan"
                : "Belum memenuhi syarat sertifikat"}
            </Title>
            <Text c="dimmed" maw={420}>
              {isWaiting
                ? "Anda sudah memenuhi syarat. Sertifikat akan tersedia setelah diterbitkan oleh panitia."
                : "Sertifikat hanya tersedia untuk peserta yang dinyatakan lulus pada kegiatan ini."}
            </Text>
          </Stack>

          {isWaiting && (
            <Alert
              color="blue"
              icon={<IconInfoCircle aria-hidden size={20} />}
              title="Tidak perlu membuat ulang sertifikat"
            >
              Kunjungi kembali halaman kegiatan secara berkala. Tautan akan
              otomatis menuju sertifikat resmi setelah diterbitkan.
            </Alert>
          )}

          <Button
            component={Link}
            href="/profile?tab=activity"
            fullWidth
            leftSection={<IconArrowLeft aria-hidden size={18} />}
          >
            Kembali ke kegiatan saya
          </Button>
        </Stack>
      </Paper>
    </PageContainer>
  );
}
