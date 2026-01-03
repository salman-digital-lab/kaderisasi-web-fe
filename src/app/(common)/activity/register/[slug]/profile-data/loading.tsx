import {
  Container,
  Paper,
  Skeleton,
  Stack,
  Box,
} from "@mantine/core";

export default function Loading() {
  return (
    <Container size="sm" component="main" mt="xl">
      {/* Title */}
      <Skeleton height={32} width="60%" mx="auto" mb="xl" />

      {/* Stepper */}
      <Stack gap="md" mb="xl" visibleFrom="sm">
        <Skeleton height={48} width="100%" />
      </Stack>

      {/* Mobile progress */}
      <Stack align="center" gap={0} hiddenFrom="sm" mb="xl">
        <Skeleton height={80} width={80} circle />
        <Skeleton height={20} width={80} mt="xs" />
        <Skeleton height={14} width={120} mt="xs" />
      </Stack>

      {/* Form */}
      <Paper radius="md" withBorder p="lg">
        <Stack gap="md">
          {Array.from({ length: 5 }).map((_, i) => (
            <Box key={i}>
              <Skeleton height={14} width={100} mb={6} />
              <Skeleton height={36} width="100%" radius="md" />
            </Box>
          ))}
          <Skeleton height={42} width="100%" radius="md" mt="md" />
        </Stack>
      </Paper>
    </Container>
  );
}

