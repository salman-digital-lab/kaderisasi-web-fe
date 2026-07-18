"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  Alert,
  Button,
  Container,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconArrowLeft,
  IconRefresh,
} from "@tabler/icons-react";

type ClubDetailErrorProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function ClubDetailError({
  error,
  unstable_retry,
}: ClubDetailErrorProps) {
  useEffect(() => {
    console.error("Club detail error:", error);
  }, [error]);

  return (
    <Container size="md" py={{ base: "xl", md: 80 }}>
      <Stack gap="lg">
        <Title order={1} size="h2">
          Kami tidak dapat membuka klub ini
        </Title>
        <Alert
          color="red"
          icon={<IconAlertCircle aria-hidden="true" />}
          title="Detail klub belum dapat dimuat"
        >
          <Text>
            Terjadi kendala saat mengambil informasi klub. Periksa koneksi Anda
            lalu coba lagi.
          </Text>
        </Alert>
        <Group>
          <Button
            onClick={unstable_retry}
            size="lg"
            leftSection={<IconRefresh size={18} aria-hidden="true" />}
          >
            Coba lagi
          </Button>
          <Button
            component={Link}
            href="/clubs"
            variant="default"
            size="lg"
            leftSection={<IconArrowLeft size={18} aria-hidden="true" />}
          >
            Kembali ke daftar klub
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}
