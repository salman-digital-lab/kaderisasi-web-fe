"use client";

import { SimpleGrid } from "@mantine/core";
import { ClubGridSkeleton } from "@/components/skeletons";

export function ClubsListSkeleton() {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
      <ClubGridSkeleton count={8} />
    </SimpleGrid>
  );
}

export default ClubsListSkeleton;

