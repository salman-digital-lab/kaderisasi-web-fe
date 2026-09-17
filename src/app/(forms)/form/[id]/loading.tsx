import type { ReactElement } from "react";
import PageContainer from "@/components/layout/PageContainer";
import { CustomFormSkeleton } from "@/components/skeletons/CustomFormSkeleton";

export default function Loading(): ReactElement {
  return (
    <PageContainer size="sm">
      <CustomFormSkeleton />
    </PageContainer>
  );
}
