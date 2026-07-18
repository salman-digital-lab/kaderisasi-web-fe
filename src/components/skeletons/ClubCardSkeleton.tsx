"use client";

import { Card, Group, Skeleton, Stack } from "@mantine/core";

export function ClubCardSkeleton() {
  return (
    <Card radius="md" withBorder p="md">
      <Card.Section>
        <Skeleton height={180} />
      </Card.Section>
      <Stack gap="md" mt="md">
        <Skeleton height={20} width="82%" />
        <Stack gap="xs">
          <Skeleton height={14} width="45%" />
          <Group gap="xs">
            <Skeleton height={22} width={64} radius="xl" />
            <Skeleton height={22} width={112} radius="xl" />
          </Group>
        </Stack>
        <Stack gap="xs">
          <Skeleton height={14} width="55%" />
          <Group gap="xs">
            <Skeleton height={22} width={54} radius="xl" />
            <Skeleton height={22} width={118} radius="xl" />
          </Group>
        </Stack>
        <Skeleton height={36} width="100%" radius="md" />
      </Stack>
    </Card>
  );
}

export function ClubGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <ClubCardSkeleton key={i} />
      ))}
    </>
  );
}

export default ClubCardSkeleton;
