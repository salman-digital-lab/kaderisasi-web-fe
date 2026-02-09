"use client";

import {
  Button,
  Center,
  Code,
  Stack,
  Title,
  Text,
  Container,
  Group,
} from "@mantine/core";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isProduction = process.env.NEXT_PUBLIC_APP_ENV === "production";

  useEffect(() => {
    // Log error for debugging (always runs)
    console.error("Application error:", error);

    // In production, you might want to send to error tracking service
    // e.g., Sentry.captureException(error);
  }, [error]);

  return (
    <Container>
      <Center h="98vh">
        <Stack align="center">
          <Title ta="center">Telah Terjadi Kesalahan</Title>

          {/* Only show detailed error in development */}
          {!isProduction && (
            <>
              <Title order={3} c="dimmed">
                Detil Kesalahan:
              </Title>
              <Code p="md">{error.message}</Code>
              {error.digest && (
                <Text c="dimmed" size="xs">
                  Error ID: {error.digest}
                </Text>
              )}
            </>
          )}

          {isProduction && (
            <Text c="dimmed" ta="center">
              Mohon maaf, terjadi kesalahan pada sistem. Silakan coba lagi.
            </Text>
          )}

          <Stack gap="xs" mt="md">
            <Group justify="center">
              <Button color="red" onClick={() => reset()}>
                Coba Lagi
              </Button>
              <Button component={Link} href="/" variant="outline">
                Ke Beranda
              </Button>
            </Group>
            <Text ta="center" c="dimmed" size="sm" mt="md">
              Jika masalah berlanjut, laporkan kepada admin melalui media
              sosial.
            </Text>
          </Stack>
        </Stack>
      </Center>
    </Container>
  );
}
