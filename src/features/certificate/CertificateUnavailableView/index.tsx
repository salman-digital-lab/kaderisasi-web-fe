"use client";

import Link from "next/link";
import { Alert, Button, Container, Stack, Text, Title } from "@mantine/core";
import {
  IconAlertTriangle,
  IconBan,
  IconClockHour4,
  IconLock,
} from "@tabler/icons-react";

export type CertificateUnavailableReason =
  | "forbidden"
  | "not-issued"
  | "rate-limited"
  | "revoked"
  | "template-unavailable";

const CONTENT: Record<
  CertificateUnavailableReason,
  {
    title: string;
    description: string;
    color: string;
    actionHref: string;
    actionLabel: string;
  }
> = {
  forbidden: {
    actionHref: "/profile?tab=activity",
    actionLabel: "Kembali ke kegiatan saya",
    color: "red",
    description:
      "Sertifikat ini bukan milik akun yang sedang digunakan. Masuk dengan akun peserta yang sesuai.",
    title: "Akses sertifikat ditolak",
  },
  "not-issued": {
    actionHref: "/profile?tab=activity",
    actionLabel: "Kembali ke kegiatan saya",
    color: "blue",
    description:
      "Anda memenuhi syarat, tetapi sertifikat resmi belum diterbitkan oleh panitia.",
    title: "Sertifikat belum diterbitkan",
  },
  "rate-limited": {
    actionHref: "/certificate/verify",
    actionLabel: "Kembali ke verifikasi",
    color: "yellow",
    description:
      "Terlalu banyak permintaan verifikasi dalam waktu singkat. Tunggu sebentar sebelum mencoba kembali.",
    title: "Batas pemeriksaan sementara tercapai",
  },
  revoked: {
    actionHref: "/profile?tab=activity",
    actionLabel: "Kembali ke kegiatan saya",
    color: "red",
    description:
      "Sertifikat ini telah dicabut dan tidak lagi dapat digunakan atau diunduh.",
    title: "Sertifikat tidak berlaku",
  },
  "template-unavailable": {
    actionHref: "/profile?tab=activity",
    actionLabel: "Kembali ke kegiatan saya",
    color: "yellow",
    description:
      "Data penerbitan tersedia, tetapi tampilan sertifikat belum dapat diproses. Hubungi panitia kegiatan.",
    title: "Template sertifikat tidak tersedia",
  },
};

function StatusIcon({ reason }: { reason: CertificateUnavailableReason }) {
  if (reason === "forbidden") return <IconLock aria-hidden size={22} />;
  if (reason === "not-issued" || reason === "rate-limited") {
    return <IconClockHour4 aria-hidden size={22} />;
  }
  if (reason === "revoked") return <IconBan aria-hidden size={22} />;
  return <IconAlertTriangle aria-hidden size={22} />;
}

export default function CertificateUnavailableView({
  reason,
}: {
  reason: CertificateUnavailableReason;
}) {
  const content = CONTENT[reason];

  return (
    <Container component="main" size="sm" py="xl">
      <Stack gap="lg">
        <Title order={1} size="h2">
          {content.title}
        </Title>
        <Alert
          color={content.color}
          icon={<StatusIcon reason={reason} />}
          title={content.title}
        >
          <Stack gap="md">
            <Text>{content.description}</Text>
            <Button component={Link} href={content.actionHref} variant="light">
              {content.actionLabel}
            </Button>
          </Stack>
        </Alert>
      </Stack>
    </Container>
  );
}
