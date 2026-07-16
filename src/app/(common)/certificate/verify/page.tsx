import type { Metadata } from "next";
import { Container, Paper, Stack, Text, Title } from "@mantine/core";
import VerificationSearch from "@/features/certificate/VerificationSearch";

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
    <Container component="main" size="sm" py="xl">
      <Paper p={{ base: "lg", sm: "xl" }} radius="md" withBorder>
        <Stack gap="lg">
          <Stack gap="xs">
            <Title order={1} size="h2">
              Verifikasi sertifikat
            </Title>
            <Text c="dimmed">
              Masukkan kode untuk melihat status dan data penerbitan sertifikat.
            </Text>
          </Stack>
          <VerificationSearch />
        </Stack>
      </Paper>
    </Container>
  );
}
