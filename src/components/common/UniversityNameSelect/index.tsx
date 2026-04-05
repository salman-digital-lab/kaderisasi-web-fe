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
  value,
  ...props
}: UniversityNameSelectProps) {
  const currentValue =
    typeof value === "string"
      ? value
      : typeof defaultValue === "string"
        ? defaultValue
        : "";

  // Seed options with current value so it shows immediately before fetch completes
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    currentValue ? [{ label: currentValue, value: currentValue }] : [],
  );
  const [searchValue, setSearchValue] = useState(currentValue);

  const fetchUniversities = async (search?: string) => {
    try {
      const data = await getUniversities(search);
      const fetched = data.map((u: University) => ({ label: u.name, value: u.name }));
      // Keep current value in list even if not in results
      if (currentValue && !fetched.some((o) => o.value === currentValue)) {
        setOptions([{ label: currentValue, value: currentValue }, ...fetched]);
      } else {
        setOptions(fetched);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchUniversities(currentValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!currentValue) {
      return;
    }

    setSearchValue(currentValue);
    setOptions((previousOptions) => {
      if (previousOptions.some((option) => option.value === currentValue)) {
        return previousOptions;
      }

      return [{ label: currentValue, value: currentValue }, ...previousOptions];
    });
  }, [currentValue]);

  const debouncedFetch = useDebouncedCallback((value: string) => {
    fetchUniversities(value);
  }, 300);

  return (
    <Select
      {...props}
      value={value}
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
