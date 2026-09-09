"use client";

import { Skeleton, Stack } from "@mantine/core";
import type { ReactElement } from "react";
import classes from "@/components/layout/DetailLayout.module.css";
import PageContainer from "@/components/layout/PageContainer";

export function ActivityDetailSkeleton(): ReactElement {
  return (
    <PageContainer size="md">
      <Stack gap="lg" role="status" aria-label="Memuat detail kegiatan">
        <Skeleton height={44} width={190} />
        <div className={classes.header}>
          <Skeleton height={180} radius="md" />
          <Skeleton height={180} radius="md" />
        </div>
        <Skeleton height={200} radius="md" />
      </Stack>
    </PageContainer>
  );
}
export default ActivityDetailSkeleton;
