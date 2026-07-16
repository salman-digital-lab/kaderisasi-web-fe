"use client";

import Link from "next/link";
import { Alert, Button, Container, Stack, Text, Title } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";

export default function CertificateConfigurationError() {
  return (
    <Container component="main" size="sm" py="xl">
      <Stack gap="md">
        <Title order={1} size="h2">
          Sertifikat belum dapat ditampilkan
        </Title>
        <Alert
          color="yellow"
          icon={<IconAlertTriangle aria-hidden size={20} />}
          title="Tautan verifikasi belum dikonfigurasi"
        >
          <Stack gap="md">
            <Text>
              Alamat resmi HTTPS untuk sertifikat belum tersedia. Coba kembali
              setelah konfigurasi layanan diperbarui.
            </Text>
            <Button component={Link} href="/" variant="light">
              Kembali ke beranda
            </Button>
          </Stack>
        </Alert>
      </Stack>
    </Container>
  );
}
