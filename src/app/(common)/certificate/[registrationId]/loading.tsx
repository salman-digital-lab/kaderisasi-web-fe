import { Container, Group, Skeleton, Stack, Text } from "@mantine/core";

export default function Loading() {
  return (
    <Container aria-busy="true" component="main" size="lg" py="xl">
      <Text aria-live="polite" role="status" ta="center">
        Memuat sertifikat…
      </Text>
      <Stack aria-hidden gap="xl" mt="md">
        <Group justify="space-between">
          <Skeleton height={44} radius="md" width={110} />
          <Skeleton height={44} radius="md" width={160} />
        </Group>
        <Skeleton height={130} radius="md" />
        <Skeleton height={520} radius="md" />
      </Stack>
    </Container>
  );
}
