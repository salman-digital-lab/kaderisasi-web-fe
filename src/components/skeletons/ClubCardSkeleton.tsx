import CatalogueCardSkeleton from "@/components/common/Catalogue/CatalogueCardSkeleton";
import type { ReactElement } from "react";

export function ClubGridSkeleton({
  count = 4,
}: {
  count?: number;
}): ReactElement {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <CatalogueCardSkeleton key={index} />
      ))}
    </>
  );
}
