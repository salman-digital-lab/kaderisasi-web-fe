"use client";

import PageContainer from "@/components/layout/PageContainer";

import type { CertificateDownloadAccess } from "@/services/certificate";
import type { PublicCertificateData } from "@/types/model/certificate";
import {
  Alert,
  Badge,
  Button,
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
  IconDownload,
  IconLogin,
  IconShare3,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import CertificateCanvas from "../CertificateCanvas";
import {
  formatCertificateTimestamp,
  getCertificatePath,
  getCertificateShareDetails,
  getVerificationPath,
} from "../utils/certificateData";
import classes from "./index.module.css";

type CertificateViewProps = {
  data: PublicCertificateData;
  imageBaseUrl: string;
  appUrl: string;
  access: CertificateDownloadAccess;
};

export default function CertificateView({
  data,
  imageBaseUrl,
  appUrl,
  access,
}: CertificateViewProps): React.ReactElement {
  const router = useRouter();
  const downloadRef = useRef(false);
  const [stage, setStage] = useState("");
  const [downloadError, setDownloadError] = useState("");
  const [revokedDuringDownload, setRevokedDuringDownload] = useState(false);
  const code = data.certificate.certificate_code;
  const path = getCertificatePath(code);
  const certificateUrl = `${appUrl}${path}`;
  const verificationPath = getVerificationPath(code);
  const verificationUrl = `${appUrl}${verificationPath}`;
  const loginPath = `/login?redirect=${encodeURIComponent(path)}`;
  const revoked = data.state === "issued_revoked" || revokedDuringDownload;
  const issuedAt = formatCertificateTimestamp(data.certificate.issued_at);

  async function copyLink(): Promise<void> {
    try {
      await navigator.clipboard.writeText(certificateUrl);
      notifications.show({
        color: "green",
        message: "Tautan sertifikat disalin.",
      });
    } catch {
      notifications.show({
        color: "red",
        message:
          "Tautan tidak dapat disalin. Salin alamat halaman dari peramban.",
      });
    }
  }
  async function share(): Promise<void> {
    if (!navigator.share) {
      await copyLink();
      return;
    }
    try {
      await navigator.share(getCertificateShareDetails(data, certificateUrl));
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError"))
        await copyLink();
    }
  }
  async function download(): Promise<void> {
    if (downloadRef.current || revoked || access !== "owner") return;
    downloadRef.current = true;
    setStage("Memeriksa sertifikat…");
    setDownloadError("");
    try {
      const response = await fetch(
        `/api/certificates/${encodeURIComponent(code)}/download`,
        {
          method: "POST",
          headers: { Accept: "application/json" },
          cache: "no-store",
        },
      );
      if (!response.ok) {
        if (response.status === 401) {
          router.push(loginPath);
          return;
        }
        if (response.status === 410) {
          setRevokedDuringDownload(true);
          router.refresh();
          throw new Error("Sertifikat telah dicabut dan tidak dapat diunduh.");
        }
        if (response.status === 403) {
          router.refresh();
          throw new Error("Unduhan hanya tersedia untuk pemilik sertifikat.");
        }
        throw new Error(
          "Sertifikat belum dapat diunduh. Periksa koneksi dan coba lagi.",
        );
      }
      const payload = (await response.json()) as { data?: unknown };
      const { certificateDataSchema } = await import("../schemas/certificate");
      const parsed = certificateDataSchema.safeParse(payload.data);
      if (
        !parsed.success ||
        parsed.data.certificate.certificate_code !== code ||
        parsed.data.certificate.revoked_at
      )
        throw new Error(
          "Sertifikat berubah. Muat ulang halaman sebelum mengunduh.",
        );
      const { saveOwnerCertificatePdf } =
        await import("../utils/ownerCertificatePdf");
      await saveOwnerCertificatePdf(
        parsed.data,
        imageBaseUrl,
        verificationUrl,
        setStage,
      );
      notifications.show({
        color: "green",
        message: "PDF sertifikat berhasil dibuat.",
      });
    } catch (error) {
      const knownMessage =
        error instanceof Error && /^(Sertifikat|Unduhan) /.test(error.message)
          ? error.message
          : "PDF tidak dapat dibuat. Periksa gambar dan koneksi, lalu coba lagi.";
      setDownloadError(knownMessage);
    } finally {
      downloadRef.current = false;
      setStage("");
    }
  }

  return (
    <PageContainer size="lg">
      <Stack gap="lg">
        <Button
          component={Link}
          href={access === "signed_out" ? "/" : "/profile?tab=activity"}
          variant="subtle"
          leftSection={<IconArrowLeft aria-hidden size={18} />}
          style={{ alignSelf: "flex-start" }}
        >
          Kembali
        </Button>
        <Paper withBorder p={{ base: "md", sm: "lg" }} radius="md">
          <Stack gap="xs">
            <Group justify="space-between" align="flex-start">
              <Title order={1} size="h2">
                {data.activity.name}
              </Title>
              <Badge color={revoked ? "red" : "green"} size="lg">
                {revoked ? "Dicabut" : "Valid"}
              </Badge>
            </Group>
            <Text>
              Sertifikat atas nama <strong>{data.participant.name}</strong>
            </Text>
            <Text c="dimmed">
              {data.participant.activity_date}
              {issuedAt ? ` · Diterbitkan ${issuedAt}` : ""}
            </Text>
            <Text size="sm" c="dimmed" className={classes.certificateCode}>
              Kode: {code}
            </Text>
          </Stack>
        </Paper>
        {revoked && (
          <Alert
            color="red"
            title="Sertifikat telah dicabut"
            icon={<IconAlertTriangle aria-hidden size={20} />}
          >
            Sertifikat ini tidak lagi valid dan tidak dapat diunduh.{" "}
            {data.certificate.revoked_reason}
          </Alert>
        )}
        <CertificateCanvas
          data={data}
          imageBaseUrl={imageBaseUrl}
          verificationUrl={verificationUrl}
        />
        <div className={classes.actions}>
          {!revoked && access === "owner" && (
            <Button
              className={classes.actionButton}
              onClick={download}
              loading={Boolean(stage)}
              leftSection={<IconDownload aria-hidden size={18} />}
            >
              {stage || "Unduh PDF"}
            </Button>
          )}
          {!revoked && access === "signed_out" && (
            <Button
              className={classes.actionButton}
              component={Link}
              href={loginPath}
              leftSection={<IconLogin aria-hidden size={18} />}
            >
              Masuk untuk unduh
            </Button>
          )}
          <Button
            className={classes.actionButton}
            variant="default"
            onClick={share}
            leftSection={<IconShare3 aria-hidden size={18} />}
          >
            Bagikan
          </Button>
          <Text
            component={Link}
            href={verificationPath}
            size="sm"
            className={classes.verificationLink}
          >
            Periksa keaslian sertifikat
          </Text>
        </div>
        {access === "not_owner" && (
          <Text c="dimmed" size="sm">
            Sertifikat dapat dilihat dan dibagikan. Unduhan tersedia untuk
            pemilik sertifikat.
          </Text>
        )}
        {access === "unavailable" && (
          <Alert title="Akses unduhan belum dapat diperiksa" color="blue">
            <Button variant="subtle" onClick={() => router.refresh()}>
              Coba lagi
            </Button>
          </Alert>
        )}
        {downloadError && (
          <Alert color="red" title="Unduhan belum berhasil">
            {downloadError}
          </Alert>
        )}
        <Text role="status" aria-live="polite" size="sm" c="dimmed">
          {stage}
        </Text>
      </Stack>
    </PageContainer>
  );
}
