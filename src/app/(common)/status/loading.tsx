import type { ReactElement } from "react";
import PageContainer from "@/components/layout/PageContainer";
import StatusHeader from "@/features/status/StatusHeader";
import StatusSkeleton from "@/features/status/StatusSkeleton";

export default function Loading(): ReactElement {
  return (
    <PageContainer size="lg">
      <StatusHeader />
      <StatusSkeleton />
    </PageContainer>
  );
}
