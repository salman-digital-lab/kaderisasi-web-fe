"use client";

import { Card, Group, Skeleton, Stack } from "@mantine/core";

export function ClubCardSkeleton() {
  return (
    <Card radius="md" withBorder p="md">
      <Group align="flex-start" wrap="nowrap" gap="md">
        <Skeleton height={68} width={68} radius="md" />
        <Stack gap={7} style={{ flex: 1 }}>
          <Skeleton height={12} width="30%" />
          <Skeleton height={20} width="85%" />
          <Skeleton height={14} width="65%" />
        </Stack>
      </Group>
      <Stack gap={7} mt="md">
        <Skeleton height={14} width="100%" />
        <Skeleton height={14} width="78%" />
        <Skeleton height={14} width="58%" mt="xs" />
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
