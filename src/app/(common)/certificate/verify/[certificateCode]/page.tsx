import type { Metadata } from "next";
import {
  Alert,
  Badge,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconCircleX,
} from "@tabler/icons-react";
import { formatCertificateTimestamp } from "@/features/certificate/utils/certificateData";
import VerificationResultActions from "@/features/certificate/VerificationResultActions";
import { certificateCodeInputSchema } from "@/features/certificate/schemas/certificate";
import CertificateUnavailableView from "@/features/certificate/CertificateUnavailableView";
import { FetcherError } from "@/functions/common/fetcher";
import { getCertificateVerification } from "@/services/certificate";
import type { CertificateVerificationData } from "@/types/model/certificate";

export const metadata: Metadata = {
  title: "Hasil Verifikasi Sertifikat | Kaderisasi Salman ITB",
  description: "Hasil pemeriksaan keaslian sertifikat Kaderisasi Salman ITB.",
  robots: {
    follow: false,
    googleBot: { follow: false, index: false, noarchive: true },
    index: false,
    nocache: true,
  },
};

function createNotFoundResult(
  certificateCode: string,
): CertificateVerificationData {
  return {
    activity_date: null,
    activity_name: null,
    certificate_code: certificateCode,
    issued_at: null,
    participant_name: null,
    revoked_at: null,
    revoked_reason: null,
    state: "not_found",
    valid: false,
  };
}

export default async function CertificateVerificationPage(props: {
  params: Promise<{ certificateCode: string }>;
}) {
  const { certificateCode } = await props.params;
  const parsedCode = certificateCodeInputSchema.safeParse(certificateCode);
  const normalizedCode = parsedCode.success ? parsedCode.data : certificateCode;
  let result: CertificateVerificationData;

  try {
    result = parsedCode.success
      ? await getCertificateVerification(normalizedCode)
      : createNotFoundResult(normalizedCode);
  } catch (error) {
    if (
      error instanceof FetcherError &&
      (error.status === 400 || error.status === 404)
    ) {
      result = createNotFoundResult(normalizedCode);
    } else if (error instanceof FetcherError && error.status === 429) {
      return <CertificateUnavailableView reason="rate-limited" />;
    } else {
      throw error;
    }
  }

  const isActive = result.valid && result.state === "issued_active";
  const isRevoked = result.state === "issued_revoked";
  const statusColor = isActive ? "green" : "red";
  const statusTitle = isActive
    ? "Sertifikat valid"
    : isRevoked
      ? "Sertifikat telah dicabut"
      : "Sertifikat tidak ditemukan";

  return (
    <Container component="main" size="sm" py="xl">
      <Stack gap="lg">
        <Paper p={{ base: "lg", sm: "xl" }} radius="md" withBorder>
          <Stack gap="lg">
            <Group justify="space-between" align="flex-start" wrap="wrap">
              <Title order={1} size="h2">
                Hasil verifikasi
              </Title>
              <Badge color={statusColor} size="lg" variant="light">
                {isActive ? "Valid" : "Tidak valid"}
              </Badge>
            </Group>

            <Alert
              color={statusColor}
              icon={
                isActive ? (
                  <IconCircleCheck aria-hidden size={22} />
                ) : isRevoked ? (
                  <IconAlertTriangle aria-hidden size={22} />
                ) : (
                  <IconCircleX aria-hidden size={22} />
                )
              }
              title={statusTitle}
            >
              {isActive
                ? "Kode ini tercatat sebagai sertifikat resmi dan masih berlaku."
                : isRevoked
                  ? "Sertifikat pernah diterbitkan, tetapi sudah tidak berlaku."
                  : "Kode ini tidak tercatat. Periksa ejaan kode dan coba kembali."}
            </Alert>

            <Stack component="dl" gap="sm" m={0}>
              <div>
                <Text c="dimmed" component="dt" size="md">
                  Kode sertifikat
                </Text>
                <Text
                  component="dd"
                  fw={600}
                  m={0}
                  style={{ overflowWrap: "anywhere" }}
                >
                  {result.certificate_code}
                </Text>
              </div>
              {result.participant_name && (
                <div>
                  <Text c="dimmed" component="dt" size="md">
                    Nama peserta
                  </Text>
                  <Text component="dd" m={0}>
                    {result.participant_name}
                  </Text>
                </div>
              )}
              {result.activity_name && (
                <div>
                  <Text c="dimmed" component="dt" size="md">
                    Kegiatan
                  </Text>
                  <Text component="dd" m={0}>
                    {result.activity_name}
                  </Text>
                </div>
              )}
              {result.activity_date && (
                <div>
                  <Text c="dimmed" component="dt" size="md">
                    Tanggal kegiatan
                  </Text>
                  <Text component="dd" m={0}>
                    {result.activity_date}
                  </Text>
                </div>
              )}
              {result.issued_at && (
                <div>
                  <Text c="dimmed" component="dt" size="md">
                    Diterbitkan
                  </Text>
                  <Text component="dd" m={0}>
                    {formatCertificateTimestamp(result.issued_at)}
                  </Text>
                </div>
              )}
              {isRevoked && result.revoked_at && (
                <div>
                  <Text c="dimmed" component="dt" size="md">
                    Dicabut
                  </Text>
                  <Text component="dd" m={0}>
                    {formatCertificateTimestamp(result.revoked_at)}
                  </Text>
                </div>
              )}
              {isRevoked && result.revoked_reason && (
                <div>
                  <Text c="dimmed" component="dt" size="md">
                    Alasan pencabutan
                  </Text>
                  <Text component="dd" m={0}>
                    {result.revoked_reason}
                  </Text>
                </div>
              )}
            </Stack>

            <VerificationResultActions
              certificateCode={result.certificate_code}
              showCertificate={result.state !== "not_found"}
            />
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
