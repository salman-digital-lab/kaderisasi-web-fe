import type { ReactElement } from "react";
import NotFoundContent from "@/components/layout/NotFoundContent";
import SiteLayout from "@/components/layout/SiteLayout";

export default function NotFound(): ReactElement {
  return (
    <SiteLayout>
      <NotFoundContent />
    </SiteLayout>
  );
}
