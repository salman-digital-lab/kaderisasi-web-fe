"use client";

import { Container, Skeleton, Stack, Group } from "@mantine/core";

export function ActivityDetailSkeleton() {
  return (
    <Stack component="main" mt="xl" gap="md">
      {/* Image */}
      <Container size="xs" w="100%">
        <Skeleton height={400} radius="md" />
      </Container>

      {/* Title + Register */}
      <Container size="md" w="100%">
        <Group align="stretch" gap="md" wrap="nowrap">
          <Skeleton height={120} radius="md" style={{ flex: 3 }} />
          <Skeleton height={120} radius="md" style={{ flex: 1 }} />
        </Group>
      </Container>

      {/* Detail / Description */}
      <Container size="md" w="100%">
        <Skeleton height={200} radius="md" />
      </Container>
    </Stack>
  );
}

export default ActivityDetailSkeleton;
