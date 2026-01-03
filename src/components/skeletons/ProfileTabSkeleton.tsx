"use client";

import { Skeleton, Stack, Group, Paper, Box, Card } from "@mantine/core";

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

export function ActivityListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <Stack gap="md">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} withBorder radius="md" p="md">
          <Group justify="space-between">
            <Stack gap="xs">
              <Skeleton height={18} width={200} />
              <Skeleton height={14} width={150} />
            </Stack>
            <Skeleton height={24} width={80} radius="xl" />
          </Group>
        </Card>
      ))}
    </Stack>
  );
}

export function AchievementListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <Stack gap="md">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} withBorder radius="md" p="md">
          <Group justify="space-between">
            <Stack gap="xs">
              <Skeleton height={18} width={180} />
              <Skeleton height={14} width={120} />
              <Skeleton height={14} width={100} />
            </Stack>
            <Skeleton height={36} width={60} radius="md" />
          </Group>
        </Card>
      ))}
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

export default ProfileTabContentSkeleton;

