"use client";

import { Card, Skeleton, Stack, Group } from "@mantine/core";

export function ActivityCardSkeleton() {
  return (
    <Card radius="md" withBorder p="lg">
      <Card.Section>
        <Skeleton height={180} />
      </Card.Section>
      <Stack gap="sm" mt="md">
        <Skeleton height={20} width="80%" />
        <Group gap="xs">
          <Skeleton height={22} width={60} radius="xl" />
          <Skeleton height={22} width={80} radius="xl" />
        </Group>
        <Skeleton height={14} width="60%" />
      </Stack>
    </Card>
  );
}

export function ActivityGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <ActivityCardSkeleton key={i} />
      ))}
    </>
  );
}

export default ActivityCardSkeleton;

