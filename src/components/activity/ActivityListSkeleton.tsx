"use client";

import { SimpleGrid, Center, Skeleton } from "@mantine/core";
import { ActivityGridSkeleton } from "@/components/skeletons";

export function ActivityListSkeleton() {
  return (
    <div aria-busy="true" aria-label="Memuat daftar kegiatan">
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" mt="xl">
        <ActivityGridSkeleton count={8} />
      </SimpleGrid>

      <Center mt="xl">
        <Skeleton height={44} width={240} radius="md" />
      </Center>
    </div>
  );
}

export default ActivityListSkeleton;
