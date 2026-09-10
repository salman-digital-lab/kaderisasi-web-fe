import { Skeleton, Stack } from "@mantine/core";
import type { ReactElement } from "react";
import PageContainer from "@/components/layout/PageContainer";

export default function CourseSkeleton(): ReactElement {
  return (
    <PageContainer>
      <Stack aria-label="Memuat kelas" role="status">
        <Skeleton height={36} width="65%" />
        <Skeleton height={20} width="85%" />
        <Skeleton height={240} />
      </Stack>
    </PageContainer>
  );
}
