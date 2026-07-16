"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  Alert,
  Badge,
  Button,
  Container,
  CopyButton,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconCertificate,
  IconCheck,
  IconCopy,
  IconDownload,
  IconExternalLink,
  IconLogin,
  IconShare3,
} from "@tabler/icons-react";
import type {
  CertificateData,
  PublicCertificateData,
} from "@/types/model/certificate";
import CertificateCanvas from "../CertificateCanvas";
import {
  formatCertificateTimestamp,
  getCertificateFilename,
  getCertificatePath,
  getCertificateShareDetails,
  getVerificationPath,
  resolveOwnerCertificateText,
} from "../utils/certificateData";
import { saveCertificatePdf } from "../utils/certificatePdf";
import classes from "./index.module.css";

type CertificateViewProps = {
  data: PublicCertificateData;
  imageBaseUrl: string;
  appUrl: string;
  isLoggedIn: boolean;
};

type DownloadApiResponse = {
  data?: unknown;
  message?: unknown;
};

function getApiErrorMessage(response: DownloadApiResponse): string {
  return typeof response.message === "string"
    ? response.message
    : "Sertifikat belum dapat diproses. Coba lagi nanti.";
}

export default function CertificateView({
  data,
  imageBaseUrl,
  appUrl,
  isLoggedIn,
}: CertificateViewProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const certificateCode = data.certificate.certificate_code;
  const certificatePath = getCertificatePath(certificateCode);
  const verificationPath = getVerificationPath(certificateCode);
  const certificateUrl = `${appUrl}${certificatePath}`;
  const verificationUrl = `${appUrl}${verificationPath}`;
  const loginRedirect = `/login?redirect=${encodeURIComponent(certificatePath)}`;
  const isRevoked = data.state === "issued_revoked";
  const issuedAt = formatCertificateTimestamp(data.certificate.issued_at);
  const revokedAt = formatCertificateTimestamp(data.certificate.revoked_at);

  async function copyShareLink(): Promise<void> {
    try {
      await navigator.clipboard.writeText(certificateUrl);
      notifications.show({
        color: "green",
        message: "Tautan sertifikat disalin.",
        title: "Berhasil",
      });
    } catch {
      notifications.show({
        color: "red",
        message: "Tautan tidak dapat disalin dari peramban ini.",
        title: "Gagal menyalin",
      });
    }
  }

  async function handleShare(): Promise<void> {
    const shareDetails = getCertificateShareDetails(data, certificateUrl);

    if (!navigator.share) {
      await copyShareLink();
      return;
    }

    try {
      await navigator.share(shareDetails);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      await copyShareLink();
    }
  }

  async function handleDownloadPdf(): Promise<void> {
    if (!certificateRef.current || isRevoked) return;

    setIsDownloading(true);
    try {
      const response = await fetch(
        `/api/certificates/${encodeURIComponent(certificateCode)}/download`,
        {
          method: "POST",
          headers: { Accept: "application/json" },
          cache: "no-store",
        },
      );
      const payload = (await response.json()) as DownloadApiResponse;

      if (!response.ok) {
        notifications.show({
          color: "red",
          message: getApiErrorMessage(payload),
          title: "Unduhan gagal",
        });
        if (response.status === 401) window.location.assign(loginRedirect);
        return;
      }

      const { certificateDataSchema } = await import("../schemas/certificate");
      const parsed = certificateDataSchema.safeParse(payload.data);
      if (!parsed.success) {
        throw new Error("INVALID_DOWNLOAD_RESPONSE");
      }

      const ownerData: CertificateData = parsed.data;
      const publicTemplate = data.template.template_data;
      const ownerTemplate = ownerData.template.template_data;
      if (
        ownerData.certificate.certificate_code !== certificateCode ||
        ownerData.certificate.revoked_at ||
        ownerTemplate.canvasWidth !== publicTemplate.canvasWidth ||
        ownerTemplate.canvasHeight !== publicTemplate.canvasHeight ||
        ownerTemplate.elements.length !== publicTemplate.elements.length
      ) {
        throw new Error("INVALID_CERTIFICATE_STATE");
      }

      await saveCertificatePdf({
        filename: getCertificateFilename(ownerData.participant.name),
        resolveText: (element) =>
          resolveOwnerCertificateText(element, ownerData),
        sourceElement: certificateRef.current,
        template: ownerData.template.template_data,
      });

      notifications.show({
        color: "green",
        message: "PDF sertifikat telah dibuat.",
        title: "Unduhan siap",
      });
    } catch {
      notifications.show({
        color: "red",
        message: "PDF tidak dapat dibuat. Periksa koneksi lalu coba kembali.",
        title: "Unduhan gagal",
      });
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <Container component="main" size="lg" py="xl">
      <Stack gap="lg">
        <div className={classes.topBar}>
          <Button
            className={classes.actionButton}
            component={Link}
            href={isLoggedIn ? "/profile?tab=activity" : "/"}
            leftSection={<IconArrowLeft aria-hidden size={18} />}
            variant="subtle"
          >
            Kembali
          </Button>

          <div className={classes.actions}>
            <Button
              className={classes.actionButton}
              component={Link}
              href={verificationPath}
              leftSection={<IconCertificate aria-hidden size={18} />}
              variant="light"
            >
              Verifikasi
            </Button>

            <CopyButton timeout={2500} value={certificateUrl}>
              {({ copied, copy }) => (
                <Button
                  aria-label={
                    copied
                      ? "Tautan sertifikat telah disalin"
                      : "Salin tautan sertifikat"
                  }
                  className={classes.actionButton}
                  color={copied ? "green" : undefined}
                  leftSection={
                    copied ? (
                      <IconCheck aria-hidden size={18} />
                    ) : (
                      <IconCopy aria-hidden size={18} />
                    )
                  }
                  onClick={copy}
                  variant="default"
                >
                  {copied ? "Tersalin" : "Salin tautan"}
                </Button>
              )}
            </CopyButton>

            <Button
              className={classes.actionButton}
              leftSection={<IconShare3 aria-hidden size={18} />}
              onClick={handleShare}
              variant="default"
            >
              Bagikan
            </Button>

            {!isRevoked &&
              (isLoggedIn ? (
                <Button
                  className={classes.actionButton}
                  disabled={isRevoked}
                  leftSection={<IconDownload aria-hidden size={18} />}
                  loading={isDownloading}
                  onClick={handleDownloadPdf}
                >
                  Unduh PDF
                </Button>
              ) : (
                <Button
                  className={classes.actionButton}
                  component={Link}
                  href={loginRedirect}
                  leftSection={<IconLogin aria-hidden size={18} />}
                  variant="filled"
                >
                  Masuk untuk unduh
                </Button>
              ))}
          </div>
        </div>

        {isRevoked && (
          <Alert
            color="red"
            icon={<IconAlertTriangle aria-hidden size={20} />}
            title="Sertifikat telah dicabut"
          >
            Sertifikat ini tidak lagi valid dan tidak dapat diunduh.
            {revokedAt ? ` Dicabut pada ${revokedAt}.` : ""}
            {data.certificate.revoked_reason
              ? ` Alasan: ${data.certificate.revoked_reason}`
              : ""}
          </Alert>
        )}

        <Paper withBorder p={{ base: "md", sm: "lg" }} radius="md">
          <Stack gap="xs">
            <Group justify="space-between" align="flex-start" wrap="wrap">
              <Title order={1} size="h2">
                {data.activity.name}
              </Title>
              <Badge
                color={isRevoked ? "red" : "green"}
                size="lg"
                variant="light"
              >
                {isRevoked ? "Dicabut" : "Valid"}
              </Badge>
            </Group>
            <Text>
              Sertifikat atas nama <strong>{data.participant.name}</strong>
            </Text>
            <Text c="dimmed">
              Tanggal kegiatan: {data.participant.activity_date}
            </Text>
            {issuedAt && <Text c="dimmed">Diterbitkan: {issuedAt}</Text>}
            <Text c="dimmed" className={classes.certificateCode}>
              Kode sertifikat: <strong>{certificateCode}</strong>
            </Text>
            <Text
              component={Link}
              href={verificationPath}
              size="md"
              style={{ alignItems: "center", display: "inline-flex", gap: 4 }}
            >
              Buka hasil verifikasi
              <IconExternalLink aria-hidden size={16} />
            </Text>
          </Stack>
        </Paper>

        <CertificateCanvas
          data={data}
          imageBaseUrl={imageBaseUrl}
          ref={certificateRef}
          verificationUrl={verificationUrl}
        />

        <Text c="dimmed" size="md" ta="center">
          Pindai kode QR atau buka halaman verifikasi untuk memeriksa keaslian
          sertifikat ini.
        </Text>
      </Stack>
    </Container>
  );
}
