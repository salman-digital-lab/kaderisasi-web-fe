"use client";

import { SimpleGrid, Center, Skeleton } from "@mantine/core";
import { ActivityGridSkeleton } from "@/components/skeletons";

export function ActivityListSkeleton() {
  return (
    <>
      <SimpleGrid cols={{ base: 1, md: 4 }} spacing="md" mt={50}>
        <ActivityGridSkeleton count={8} />
      </SimpleGrid>

      <Center mt="xl">
        <Skeleton height={36} width={200} radius="md" />
      </Center>
    </>
  );
}

export default ActivityListSkeleton;

