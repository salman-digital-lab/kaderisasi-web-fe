import { Group, Paper, Skeleton, Stack, VisuallyHidden } from "@mantine/core";
import type { ReactElement } from "react";
import classes from "@/app/(common)/activity/[slug]/index.module.css";
import PageContainer from "@/components/layout/PageContainer";

export function ActivityDetailSkeleton(): ReactElement {
  return (
    <PageContainer size="md">
      <VisuallyHidden role="status">Memuat detail kegiatan…</VisuallyHidden>
      <Stack gap="lg" aria-hidden="true">
        <Skeleton height={44} width={190} />
        <Paper withBorder radius="md" className={classes.header}>
          <Stack gap="md">
            <Skeleton height={22} width={130} />
            <Skeleton height={38} width="85%" />
            <Skeleton height={42} width="55%" />
          </Stack>
        </Paper>
        <Group gap="md">
          <Skeleton height={44} width={120} />
          <Skeleton height={44} width={100} />
        </Group>
        <div className={classes.overview} data-has-poster>
          <Stack gap="sm" className={classes.posterSection}>
            <Skeleton className={classes.posterSkeleton} radius="md" />
            <Group gap="xs">
              {[0, 1, 2].map((index) => (
                <Skeleton key={index} width={68} height={104} radius="sm" />
              ))}
            </Group>
          </Stack>
          <Paper withBorder radius="md" className={classes.registrationCard}>
            <Stack gap="lg">
              <Skeleton height={26} width="75%" />
              <Skeleton height={22} width="80%" />
              <Skeleton height={42} />
              <Skeleton height={42} />
              <Skeleton height={42} />
              <Skeleton height={44} />
            </Stack>
          </Paper>
          <Paper withBorder radius="md" className={classes.contentSection}>
            <Skeleton height={26} width="60%" mb="lg" />
            <Stack gap="md">
              {[100, 96, 90, 72, 100, 92, 80].map((width, index) => (
                <Skeleton key={index} height={16} width={`${width}%`} />
              ))}
            </Stack>
          </Paper>
        </div>
      </Stack>
    </PageContainer>
  );
}
export default ActivityDetailSkeleton;
