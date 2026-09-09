import PageContainer from "@/components/layout/PageContainer";
import { normalizeCertificateAppUrl } from "@/features/certificate/utils/certificateData";
import VerificationSearch from "@/features/certificate/VerificationSearch";
import { Paper, Stack, Text, Title } from "@mantine/core";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verifikasi Sertifikat | Kaderisasi Salman ITB",
  description: "Periksa keaslian sertifikat kegiatan Kaderisasi Salman ITB.",
  robots: {
    follow: false,
    googleBot: { follow: false, index: false, noarchive: true },
    index: false,
    nocache: true,
  },
};

export default function VerifyCertificatePage() {
  return (
    <PageContainer size="sm">
      <Paper p={{ base: "lg", sm: "xl" }} radius="md" withBorder>
        <Stack gap="lg">
          <Stack gap="xs">
            <Title order={1} size="h2">
              Verifikasi sertifikat
            </Title>
            <Text c="dimmed">
              Masukkan kode atau tautan sertifikat untuk melihat status
              penerbitannya.
            </Text>
          </Stack>
          <VerificationSearch
            appUrl={normalizeCertificateAppUrl(process.env.NEXT_PUBLIC_APP_URL)}
          />
        </Stack>
      </Paper>
    </PageContainer>
  );
}
