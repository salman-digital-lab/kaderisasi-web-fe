"use client";

import { useEffect, useState } from "react";
import { Select, type SelectProps } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { getUniversities } from "@/services/profile";
import type { University } from "@/types/model/university";

type UniversityNameSelectProps = Omit<SelectProps, "data" | "onSearchChange">;

type Option = { label: string; value: string };

async function loadOptions(
  search: string,
  keep: string,
): Promise<Option[] | null> {
  try {
    const data = await getUniversities(search);
    // The list can hold two universities with one name, and Select throws on
    // a repeated value. The kept value stays listed even if not in results.
    const names = new Set<string>(keep ? [keep] : []);
    for (const university of data as University[]) names.add(university.name);
    return [...names].map((name) => ({ label: name, value: name }));
  } catch {
    return null;
  }
}

/**
 * Searchable university select that stores the university NAME as the value
 * (unlike UniversitySelect which stores the ID). Only names from the
 * universities list can be picked; a name the profile already holds stays
 * selectable so older entries still display.
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
  const [options, setOptions] = useState<Option[]>(
    currentValue ? [{ label: currentValue, value: currentValue }] : [],
  );
  const [searchValue, setSearchValue] = useState(currentValue);

  const [initialValue] = useState(currentValue);

  useEffect(() => {
    void loadOptions(initialValue, initialValue).then(
      (loaded) => loaded && setOptions(loaded),
    );
  }, [initialValue]);

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

  const debouncedFetch = useDebouncedCallback(async (search: string) => {
    const loaded = await loadOptions(search, currentValue);
    if (loaded) setOptions(loaded);
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
      nothingFoundMessage="Institusi tidak ditemukan. Pilih dari daftar yang tersedia."
      allowDeselect={false}
    />
  );
}
