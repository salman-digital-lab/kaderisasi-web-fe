import PageContainer from "@/components/layout/PageContainer";
import { Group, Skeleton, Stack, Text } from "@mantine/core";

export default function Loading() {
  return (
    <PageContainer size="lg">
      <div role="status" aria-label="Memuat halaman" aria-busy="true">
        <Text aria-live="polite" role="status" ta="center">
          Memuat sertifikat…
        </Text>
        <Stack aria-hidden gap="xl" mt="md">
          <Group justify="space-between">
            <Skeleton height={44} radius="md" width={110} />
            <Skeleton height={44} radius="md" width={160} />
          </Group>
          <Skeleton height={130} radius="md" />
          <Skeleton height={520} radius="md" />
        </Stack>
      </div>
    </PageContainer>
  );
}
