import { Container, Skeleton, Stack, Group } from "@mantine/core";

export default function Loading() {
  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <Group justify="space-between">
          <Skeleton height={36} width={100} radius="md" />
          <Skeleton height={36} width={140} radius="md" />
        </Group>
        <Skeleton height={100} radius="md" />
        <Skeleton height={600} radius="md" />
      </Stack>
    </Container>
  );
}
