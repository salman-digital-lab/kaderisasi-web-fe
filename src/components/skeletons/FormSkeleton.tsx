"use client";

import { Paper, Skeleton, Stack, Box } from "@mantine/core";

export function FormFieldSkeleton() {
  return (
    <Box>
      <Skeleton height={14} width={100} mb={6} />
      <Skeleton height={36} width="100%" radius="md" />
    </Box>
  );
}

export function FormSkeleton({ fields = 5 }: { fields?: number }) {
  return (
    <Paper radius="md" withBorder p="lg">
      <Stack gap="md">
        {/* Form Title */}
        <Skeleton height={24} width="60%" mb="sm" />
        <Skeleton height={14} width="80%" mb="lg" />

        {/* Form Fields */}
        {Array.from({ length: fields }).map((_, i) => (
          <FormFieldSkeleton key={i} />
        ))}

        {/* Submit Button */}
        <Skeleton height={42} width="100%" radius="md" mt="md" />
      </Stack>
    </Paper>
  );
}

export default FormSkeleton;

