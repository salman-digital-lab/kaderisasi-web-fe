"use client";

import {
  Button,
  Center,
  Code,
  Stack,
  Title,
  Text,
  Container,
} from "@mantine/core";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container>
      <Center h="98vh">
        <Stack>
          <Title ta="center">Telah Terjadi Kesalahan</Title>
          <Title order={3} c="dimmed">
            Detil Kesalahan :
          </Title>
          <Code p="md">{error.message}</Code>
          <Stack gap="xs">
            <Button color="red" onClick={() => reset()}>
              Silahkan Ulangi Kembali
            </Button>
            <Text ta="center" c="dimmed" size="sm">
              Atau
            </Text>
            <Text ta="center" size="sm">
              Laporkan Kepada Admin Melalui Media Sosial
            </Text>
          </Stack>
        </Stack>
      </Center>
    </Container>
  );
}
