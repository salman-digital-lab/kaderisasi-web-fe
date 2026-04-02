"use client";

import { useEffect, useState } from "react";
import { Select, type SelectProps } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { getUniversities } from "@/services/profile";
import type { University } from "@/types/model/university";

type UniversityNameSelectProps = Omit<SelectProps, "data" | "onSearchChange">;

/**
 * Searchable university select that stores the university NAME as the value
 * (unlike UniversitySelect which stores the ID).
 * Compatible with Mantine useForm in both controlled and uncontrolled mode.
 */
export default function UniversityNameSelect({
  defaultValue,
  ...props
}: UniversityNameSelectProps) {
  // Seed options with current value so it shows immediately before fetch completes
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    defaultValue ? [{ label: defaultValue as string, value: defaultValue as string }] : [],
  );
  const [searchValue, setSearchValue] = useState((defaultValue as string) || "");

  const fetchUniversities = async (search?: string) => {
    try {
      const data = await getUniversities(search);
      const fetched = data.map((u: University) => ({ label: u.name, value: u.name }));
      // Keep current value in list even if not in results
      if (defaultValue && !fetched.some((o) => o.value === defaultValue)) {
        setOptions([{ label: defaultValue as string, value: defaultValue as string }, ...fetched]);
      } else {
        setOptions(fetched);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchUniversities((defaultValue as string) || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const debouncedFetch = useDebouncedCallback((value: string) => {
    fetchUniversities(value);
  }, 300);

  return (
    <Select
      {...props}
      defaultValue={defaultValue}
      data={options}
      searchable
      searchValue={searchValue}
      onSearchChange={(value) => {
        setSearchValue(value);
        debouncedFetch(value);
      }}
      nothingFoundMessage="Universitas tidak ditemukan"
      allowDeselect={false}
    />
  );
}
