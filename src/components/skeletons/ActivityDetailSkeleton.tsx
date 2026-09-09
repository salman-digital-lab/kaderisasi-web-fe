"use client";

import { Skeleton, Stack, SimpleGrid } from "@mantine/core";
import type { ReactElement } from "react";
import PageContainer from "@/components/layout/PageContainer";

export function ActivityDetailSkeleton(): ReactElement {
  return (
    <PageContainer size="md">
      <Stack gap="lg" role="status" aria-label="Memuat detail kegiatan">
        <Skeleton height={44} width={190} />
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          <Skeleton height={180} radius="md" />
          <Skeleton height={180} radius="md" />
        </SimpleGrid>
        <Skeleton height={200} radius="md" />
      </Stack>
    </PageContainer>
  );
}
export default ActivityDetailSkeleton;
