import { Container, Paper, Skeleton, Stack, Box } from "@mantine/core";

export default function Loading() {
  return (
    <Container size="md" py="xl">
      {/* Header */}
      <Stack align="center" gap="md" mb="xl">
        <Skeleton height={80} width={80} circle />
        <Skeleton height={32} width={300} />
        <Skeleton height={20} width={400} />
      </Stack>

      {/* Registration Info Card */}
      <Paper p="xl" radius="md" withBorder>
        <Stack gap="lg">
          <Skeleton height={24} width={200} />
          <Skeleton height={14} width="100%" />
          <Skeleton height={14} width="90%" />
          <Skeleton height={14} width="85%" />

          <Box mt="md">
            <Skeleton height={14} width={100} mb={6} />
            <Skeleton height={36} width="100%" radius="md" />
          </Box>

          <Box>
            <Skeleton height={14} width={120} mb={6} />
            <Skeleton height={80} width="100%" radius="md" />
          </Box>

          <Skeleton height={42} width="100%" radius="md" mt="md" />
        </Stack>
      </Paper>
    </Container>
  );
}

