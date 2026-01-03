"use client";

import {
  Container,
  Paper,
  Skeleton,
  Stack,
  Group,
  Box,
  Flex,
  Divider,
} from "@mantine/core";

export function ClubDetailSkeleton() {
  return (
    <main>
      {/* Hero Section */}
      <Container size="lg" py="xl">
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          justify="center"
          gap="xl"
        >
          {/* Club Logo */}
          <Box style={{ textAlign: "center" }}>
            <Skeleton height={120} width={120} circle mx="auto" />
          </Box>

          {/* Club Info */}
          <Stack gap="md" align="center">
            <Skeleton height={36} width={300} />
            <Skeleton height={20} width={400} />
            <Group gap="md" justify="center" mt="md">
              <Skeleton height={28} width={100} radius="xl" />
              <Skeleton height={28} width={130} radius="xl" />
              <Skeleton height={28} width={130} radius="xl" />
            </Group>
          </Stack>
        </Flex>
      </Container>

      {/* Registration CTA Skeleton */}
      <Container size="lg" py="xl">
        <Paper p="xl" radius="lg">
          <Stack gap="lg" align="center">
            <Skeleton height={60} width={60} circle />
            <Skeleton height={28} width={250} />
            <Skeleton height={50} width={180} radius="md" />
          </Stack>
        </Paper>
      </Container>

      {/* Content Section */}
      <Container size="lg" py="xl">
        <Stack gap="xl">
          {/* Description */}
          <Paper p="xl" radius="md" shadow="sm">
            <Group mb="md">
              <Skeleton height={24} width={24} circle />
              <Skeleton height={24} width={150} />
            </Group>
            <Divider mb="md" />
            <Stack gap="sm">
              <Skeleton height={14} width="100%" />
              <Skeleton height={14} width="95%" />
              <Skeleton height={14} width="90%" />
              <Skeleton height={14} width="88%" />
              <Skeleton height={14} width="75%" />
            </Stack>
          </Paper>

          {/* Media Gallery */}
          <Paper p="xl" radius="md" shadow="sm">
            <Skeleton height={24} width={150} mb="md" />
            <Group gap="md">
              <Skeleton height={200} width={200} radius="md" />
              <Skeleton height={200} width={200} radius="md" />
              <Skeleton height={200} width={200} radius="md" />
            </Group>
          </Paper>
        </Stack>
      </Container>
    </main>
  );
}

export default ClubDetailSkeleton;

