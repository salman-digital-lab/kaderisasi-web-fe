"use client";

import { Container, Card, Skeleton, Stack, Group, Box } from "@mantine/core";

export function ActivityDetailSkeleton() {
  return (
    <Stack component="main" mt="xl">
      {/* Carousel Skeleton */}
      <Container size="xs">
        <Skeleton height={700} radius="md" />
      </Container>

      {/* Title and Control Cards */}
      <Container size="md">
        <Group grow align="flex-start" gap="md">
          {/* Title Card */}
          <Card padding="lg" radius="md" withBorder>
            <Skeleton height={28} width="80%" mb="sm" />
            <Group gap={7} mt={10}>
              <Skeleton height={22} width={60} radius="xl" />
              <Skeleton height={22} width={80} radius="xl" />
            </Group>
            <Box mt="md">
              <Skeleton height={14} width={140} mb="xs" />
              <Skeleton height={22} width={120} radius="xl" />
            </Box>
          </Card>

          {/* Control Card */}
          <Card padding="lg" radius="md" withBorder>
            <Stack gap="xs" align="center">
              <Skeleton height={20} width={140} mb="xs" />
              <Skeleton height={24} width={120} radius="xl" />
            </Stack>
            <Skeleton height={40} width="100%" radius="md" mt="md" />
          </Card>
        </Group>
      </Container>

      {/* Description Card */}
      <Container w="100%">
        <Card withBorder radius="md" p="lg">
          <Skeleton height={28} width={200} mx="auto" mb="lg" />
          <Stack gap="sm">
            <Skeleton height={14} width="100%" />
            <Skeleton height={14} width="95%" />
            <Skeleton height={14} width="90%" />
            <Skeleton height={14} width="85%" />
            <Skeleton height={14} width="80%" />
          </Stack>
        </Card>
      </Container>
    </Stack>
  );
}

export default ActivityDetailSkeleton;

