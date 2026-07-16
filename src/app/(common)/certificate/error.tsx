"use client";

import {
  Alert,
  Button,
  Container,
  Stack,
  Text,
  VisuallyHidden,
} from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";

export default function CertificateError({ reset }: { reset: () => void }) {
  return (
    <Container component="main" size="sm" py="xl">
      <Stack gap="md">
        <Alert
          color="red"
          icon={<IconAlertTriangle aria-hidden size={20} />}
          title="Sertifikat belum dapat dimuat"
        >
          <Stack gap="sm">
            <Text>
              Terjadi gangguan saat mengambil data sertifikat. Coba beberapa
              saat lagi.
            </Text>
            <Button color="red" onClick={reset} variant="light">
              Coba lagi
            </Button>
          </Stack>
        </Alert>
        <VisuallyHidden component="h1">Gangguan sertifikat</VisuallyHidden>
      </Stack>
    </Container>
  );
}
