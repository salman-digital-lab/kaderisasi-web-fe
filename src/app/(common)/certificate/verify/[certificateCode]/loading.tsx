import { Container, Paper, Skeleton, Stack, Text } from "@mantine/core";

export default function Loading() {
  return (
    <Container aria-busy="true" component="main" size="sm" py="xl">
      <Text aria-live="polite" role="status" ta="center">
        Memeriksa keaslian sertifikat…
      </Text>
      <Paper aria-hidden mt="md" p="xl" radius="md" withBorder>
        <Stack gap="md">
          <Skeleton height={38} width="60%" />
          <Skeleton height={90} />
          <Skeleton height={180} />
        </Stack>
      </Paper>
    </Container>
  );
}
