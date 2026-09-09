import CatalogueCardSkeleton from "@/components/common/Catalogue/CatalogueCardSkeleton";
import type { ReactElement } from "react";

export { default as ActivityCardSkeleton } from "@/components/common/Catalogue/CatalogueCardSkeleton";
export default CatalogueCardSkeleton;

export function ActivityGridSkeleton({
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
