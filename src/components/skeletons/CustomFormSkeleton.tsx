"use client";

import { Container, Paper, Skeleton, Stack, Group, Box } from "@mantine/core";

const paperProps = {
  radius: "md" as const,
  withBorder: true,
  p: { base: "md", sm: "xl" } as const,
};

export function CustomFormSkeleton() {
  return (
    <Container size="md" py={{ base: "md", sm: "xl" }} px={{ base: "xs", sm: "md" }}>
      <Stack gap="md">
        {/* Back button */}
        <Skeleton height={36} width={160} radius="md" />

        {/* Header card: title + stepper */}
        <Paper {...paperProps}>
          <Skeleton height={28} width="50%" mb="xs" />
          <Skeleton height={14} width="80%" mb="lg" />
          {/* Stepper */}
          <Group gap="xl" mt="lg">
            <Box style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Skeleton height={32} width={32} radius="xl" />
              <Stack gap={4}>
                <Skeleton height={12} width={60} />
                <Skeleton height={10} width={80} />
              </Stack>
            </Box>
            <Skeleton height={2} width={40} />
            <Box style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Skeleton height={32} width={32} radius="xl" />
              <Stack gap={4}>
                <Skeleton height={12} width={60} />
                <Skeleton height={10} width={80} />
              </Stack>
            </Box>
          </Group>
        </Paper>

        {/* Form card */}
        <Paper {...paperProps}>
          <Stack gap="md">
            <Skeleton height={22} width="40%" />
            <Skeleton height={14} width="60%" />
            {/* Fields */}
            {Array.from({ length: 4 }).map((_, i) => (
              <Box key={i}>
                <Skeleton height={14} width={100} mb={6} />
                <Skeleton height={36} width="100%" radius="md" />
              </Box>
            ))}
          </Stack>
        </Paper>

        {/* Navigation buttons */}
        <Group justify="flex-end">
          <Skeleton height={36} width={120} radius="md" />
        </Group>
      </Stack>
    </Container>
  );
}
