"use client";

import { Card, Skeleton, Stack, Group, Center } from "@mantine/core";

export function ClubCardSkeleton() {
  return (
    <Card radius="md" withBorder p="lg">
      <Center mb="md">
        <Skeleton height={80} width={80} circle />
      </Center>
      <Stack gap="sm" align="center">
        <Skeleton height={20} width="70%" />
        <Skeleton height={14} width="90%" />
        <Skeleton height={14} width="60%" />
        <Group gap="xs" mt="xs">
          <Skeleton height={22} width={100} radius="xl" />
        </Group>
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

