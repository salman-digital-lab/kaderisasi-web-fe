"use client";

import { Paper, Skeleton, Stack, Box } from "@mantine/core";

export function FormFieldSkeleton() {
  return (
    <Box>
      <Skeleton height={14} width={100} mb={6} />
      <Skeleton height={44} width="100%" radius="md" />
    </Box>
  );
}

export function FormSkeleton({ fields = 5 }: { fields?: number }) {
  return (
    <Paper
      radius="md"
      withBorder
      p="lg"
      role="status"
      aria-label="Memuat formulir"
    >
      <Stack gap="md">
        <Skeleton height={24} width="60%" mb="sm" />
        <Skeleton height={14} width="80%" mb="lg" />

        {Array.from({ length: fields }).map((_, i) => (
          <FormFieldSkeleton key={i} />
        ))}

        <Skeleton height={44} width="100%" radius="md" mt="md" />
      </Stack>
    </Paper>
  );
}

export default FormSkeleton;
