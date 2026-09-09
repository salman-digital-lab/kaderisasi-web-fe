"use client";

import { useSearchParams } from "next/navigation";
import type { ReactElement } from "react";
import CataloguePagination from "@/components/common/Catalogue/CataloguePagination";

export default function ActivityPagination({
  total,
  current,
}: {
  total: number;
  current: number;
}): ReactElement {
  const searchParams = useSearchParams();
  const hrefForPage = (page: number): string => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `/activity?${params}`;
  };
  return (
    <CataloguePagination
      label="Navigasi halaman daftar kegiatan"
      page={current}
      totalPages={total}
      hrefForPage={hrefForPage}
    />
  );
}
