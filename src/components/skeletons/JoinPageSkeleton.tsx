"use client";

import { Container, Skeleton, Stack } from "@mantine/core";

export function JoinPageSkeleton() {
  return (
    <Container size="xs" py="xl">
      <Stack gap="lg">
        {/* Back button */}
        <Skeleton height={36} width={160} radius="md" />

        {/* Title + subtitle */}
        <Stack gap="xs" align="center">
          <Skeleton height={32} width="70%" radius="md" />
          <Skeleton height={16} width="50%" radius="md" />
        </Stack>

        {/* Option cards — one skeleton per card */}
        <Stack gap="sm">
          <Skeleton height={72} radius="md" />
          <Skeleton height={72} radius="md" />
          <Skeleton height={72} radius="md" />
        </Stack>
      </Stack>
    </Container>
  );
}
