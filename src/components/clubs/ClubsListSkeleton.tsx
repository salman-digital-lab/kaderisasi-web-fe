"use client";

import { Center, SimpleGrid, Skeleton } from "@mantine/core";
import { ClubGridSkeleton } from "@/components/skeletons";

export function ClubsListSkeleton() {
  return (
    <div aria-busy="true" aria-label="Memuat daftar klub">
      <SimpleGrid cols={{ base: 1, md: 4 }} spacing="md" mt={50}>
        <ClubGridSkeleton count={8} />
      </SimpleGrid>
      <Center mt="xl">
        <Skeleton height={44} width={240} radius="md" />
      </Center>
    </div>
  );
}

export default ClubsListSkeleton;
