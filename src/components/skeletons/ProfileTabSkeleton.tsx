"use client";

import { Skeleton, Stack, Group, Box } from "@mantine/core";

export function ProfileTabListSkeleton() {
  return (
    <Group gap="xs" mb="md">
      <Skeleton height={32} width={80} radius="xl" />
      <Skeleton height={32} width={80} radius="xl" />
      <Skeleton height={32} width={100} radius="xl" />
      <Skeleton height={32} width={70} radius="xl" />
    </Group>
  );
}

export function PersonalDataFormSkeleton() {
  return (
    <Stack gap="md">
      {Array.from({ length: 6 }).map((_, i) => (
        <Box key={i}>
          <Skeleton height={14} width={100} mb={6} />
          <Skeleton height={36} width="100%" radius="md" />
        </Box>
      ))}
      <Skeleton height={42} width="100%" radius="md" mt="md" />
    </Stack>
  );
}

export function ProfileTabContentSkeleton() {
  return (
    <Stack gap="md">
      <ProfileTabListSkeleton />
      <PersonalDataFormSkeleton />
    </Stack>
  );
}
