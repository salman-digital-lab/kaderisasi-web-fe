"use client";

import Link from "next/link";
import { Button, Container, Paper, Stack, Text, Title } from "@mantine/core";

export default function CertificateNotFound() {
  return (
    <Container component="main" size="sm" py="xl">
      <Paper p="xl" radius="md" withBorder>
        <Stack align="center" gap="md" ta="center">
          <Title order={1} size="h2">
            Sertifikat tidak ditemukan
          </Title>
          <Text c="dimmed">
            Periksa kembali kode sertifikat atau minta tautan resmi kepada
            pemilik sertifikat.
          </Text>
          <Button component={Link} href="/certificate/verify">
            Verifikasi kode lain
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
