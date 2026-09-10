import type { ReactElement } from "react";
import { Group, Paper, Skeleton, Stack, VisuallyHidden } from "@mantine/core";
import PageContainer from "@/components/layout/PageContainer";
import classes from "./ClubDetailSkeleton.module.css";

export function ClubDetailSkeleton(): ReactElement {
  return (
    <PageContainer size="md">
      <VisuallyHidden role="status">Memuat detail klub…</VisuallyHidden>
      <Stack gap="lg" aria-hidden="true">
        <Skeleton height={44} width={190} />
        <Paper withBorder radius="md" className={classes.profileHeader}>
          <div className={classes.identityHeader}>
            <Skeleton className={classes.logo} radius="md" />
            <Stack gap="sm" className={classes.identity}>
              <Skeleton height={22} width={150} />
              <Skeleton height={38} width="85%" />
              <Skeleton height={16} width="100%" />
              <Skeleton height={16} width="80%" />
            </Stack>
          </div>
        </Paper>
        <Group gap="md">
          <Skeleton height={44} width={100} />
          <Skeleton height={44} width={100} />
          <Skeleton height={44} width={80} />
        </Group>
        <div className={classes.overview}>
          <Paper withBorder radius="md" p="lg" className={classes.registration}>
            <Stack gap="lg">
              <Skeleton height={26} width="75%" />
              <Skeleton height={22} width="80%" />
              <Skeleton height={42} />
              <Skeleton height={42} />
              <Skeleton height={44} />
            </Stack>
          </Paper>
          <Paper withBorder radius="md" p="lg" className={classes.content}>
            <Skeleton height={26} width={160} mb="lg" />
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

export default ClubDetailSkeleton;
