import { Container, Center, Loader, Stack, Text } from "@mantine/core";

export default function Loading() {
  return (
    <Container size="md" py="xl">
      <Center style={{ minHeight: "60vh" }}>
        <Stack align="center" gap="md">
          <Loader size="lg" type="dots" />
          <Text c="dimmed" size="sm">
            Memuat halaman...
          </Text>
        </Stack>
      </Center>
    </Container>
  );
}

