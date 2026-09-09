"use client";

import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { ACTIVITY_CATEGORY_OPTIONS } from "@/constants/form/activity";
import { useSearchParams } from "next/navigation";
import { getActivityCategories } from "@/services/activity";
import CatalogueFilters from "@/components/common/Catalogue/CatalogueFilters";

export default function ActivityFilter(): ReactElement {
  const searchParams = useSearchParams();
  const [availableCategories, setAvailableCategories] = useState<number[]>([]);
  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";

  useEffect(() => {
    let active = true;
    getActivityCategories()
      .then((categories) => {
        if (active && categories) setAvailableCategories(categories);
      })
      .catch((error: unknown) => {
        console.error("Failed to fetch activity categories", error);
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredOptions = ACTIVITY_CATEGORY_OPTIONS.filter((option) =>
    availableCategories.includes(option.value),
  );

  const categoryHref = (value: string): string => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("category", value);
    else params.delete("category");
    params.delete("page");
    const query = params.toString();
    return query ? `/activity?${query}` : "/activity";
  };

  return (
    <CatalogueFilters
      action="/activity"
      search={search}
      searchLabel="Cari kegiatan"
      filterLabel="Filter kategori kegiatan"
      filterName="category"
      filterValue={category}
      options={[
        { label: "Semua", href: categoryHref(""), active: !category },
        ...filteredOptions.map((option) => ({
          label: option.label,
          href: categoryHref(String(option.value)),
          active: category === String(option.value),
        })),
      ]}
    />
  );
}
