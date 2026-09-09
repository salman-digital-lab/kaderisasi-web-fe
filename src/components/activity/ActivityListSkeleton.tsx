"use client";

import { SimpleGrid, Center, Skeleton } from "@mantine/core";
import { ActivityGridSkeleton } from "@/components/skeletons";

export function ActivityListSkeleton() {
  return (
    <>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" mt="xl">
        <ActivityGridSkeleton count={8} />
      </SimpleGrid>

      <Center mt="xl">
        <Skeleton height={36} width={200} radius="md" />
      </Center>
    </>
  );
}

export default ActivityListSkeleton;
