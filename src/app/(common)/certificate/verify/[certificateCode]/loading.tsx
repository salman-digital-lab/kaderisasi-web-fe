import PageContainer from "@/components/layout/PageContainer";
import { Paper, Skeleton, Stack, Text } from "@mantine/core";

export default function Loading() {
  return (
    <PageContainer size="sm">
      <div role="status" aria-label="Memuat halaman" aria-busy="true">
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
      </div>
    </PageContainer>
  );
}
