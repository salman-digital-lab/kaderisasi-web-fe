"use client";

import {
  Paper,
  Skeleton,
  Stack,
  Group,
  Container,
} from "@mantine/core";

export function LeaderboardItemSkeleton() {
  return (
    <Paper shadow="xs" p="md" withBorder>
      <Group w="100%" justify="space-between">
        <Group flex={1} gap="md">
          {/* Rank number */}
          <Skeleton height={24} width={40} />
          {/* Avatar */}
          <Skeleton height={40} width={40} circle />
          {/* Name and University */}
          <Stack gap={4}>
            <Skeleton height={16} width={120} />
            <Skeleton height={14} width={180} />
          </Stack>
        </Group>
        {/* Score */}
        <Skeleton height={20} width={70} />
      </Group>
    </Paper>
  );
}

export function LeaderboardSkeleton({ count = 10 }: { count?: number }) {
  return (
    <Container size="md" py="xl">
      <Group justify="space-between" mb="lg">
        <Skeleton height={28} width={180} />
      </Group>

      {/* User rank alert */}
      <Skeleton height={70} radius="md" mb="lg" />

      <Stack gap="md">
        {Array.from({ length: count }).map((_, i) => (
          <LeaderboardItemSkeleton key={i} />
        ))}
      </Stack>
    </Container>
  );
}

export default LeaderboardSkeleton;

