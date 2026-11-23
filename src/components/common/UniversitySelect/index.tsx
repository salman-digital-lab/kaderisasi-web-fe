"use client";

import { useEffect, useState } from "react";
import { Select, type SelectProps } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { getUniversities } from "@/services/profile";
import { type University } from "@/types/model/university";

type UniversitySelectProps = Omit<SelectProps, "data" | "onSearchChange"> & {
  onChange?: (value: string | null) => void;
  showedValue?: string;
};

export default function UniversitySelect({
  onChange,
  showedValue,
  ...props
}: UniversitySelectProps) {
  const [universities, setUniversities] = useState<
    { label: string; value: string }[]
  >([]);
  const [searchValue, setSearchValue] = useState(showedValue || "");

  const fetchUniversities = async (search?: string) => {
    try {
      const data = await getUniversities(search);
      const formattedData = data.map((university: University) => ({
        label: university.name,
        value: university.id.toString(),
      }));
      setUniversities(formattedData);
    } catch (error) {
      console.error("Error fetching universities:", error);
    }
  };

  useEffect(() => {
    void fetchUniversities(showedValue);
  }, [showedValue]);

  const debouncedFetch = useDebouncedCallback((value: string) => {
    void fetchUniversities(value);
  }, 300);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    debouncedFetch(value);
  };

  return (
    <Select
      {...props}
      allowDeselect={false}
      data={universities}
      searchable
      searchValue={searchValue}
      onSearchChange={handleSearch}
      nothingFoundMessage="No universities found"
      onChange={onChange}
    />
  );
}
