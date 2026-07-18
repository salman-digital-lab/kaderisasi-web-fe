"use client";

import { Group, Skeleton, Stack } from "@mantine/core";
import { ClubGridSkeleton } from "@/components/skeletons";
import gridClasses from "./club-grid.module.css";

export function ClubsListSkeleton() {
  return (
    <Stack gap="lg" aria-busy="true" aria-label="Memuat daftar klub">
      <Group gap="xs">
        <Skeleton height={26} width={128} />
        <Skeleton height={14} width={92} />
      </Group>
      <div className={gridClasses.grid}>
        <ClubGridSkeleton count={8} />
      </div>
    </Stack>
  );
}

export default ClubsListSkeleton;
