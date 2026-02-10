"use client";

import React, { useEffect, useState } from "react";
import { ACTIVITY_CATEGORY_OPTIONS } from "../../../constants/form/activity";
import { Chip, ChipGroup, Group, rem, TextInput } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { getActivityCategories } from "@/services/activity";

export default function ActivityFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [availableCategories, setAvailableCategories] = useState<number[]>([]);

  const category = searchParams.get("category");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getActivityCategories();
        if (categories) {
          setAvailableCategories(categories);
        }
      } catch (error) {
        console.error("Failed to fetch activity categories", error);
      }
    };

    fetchCategories();
  }, []);

  const filteredOptions = ACTIVITY_CATEGORY_OPTIONS.filter((option) =>
    availableCategories.includes(option.value),
  );

  const onChangeCategory = (value: string, key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value !== "") {
      params.set(key, String(value));
    } else {
      params.delete(key);
    }
    router.push("/activity?" + params, { scroll: false });
  };

  const handleSearch = useDebouncedCallback((value: string) => {
    onChangeCategory(value, "search");
  }, 500);

  return (
    <>
      <TextInput
        size="md"
        placeholder="Cari Kegiatan"
        rightSectionWidth={42}
        leftSection={
          <IconSearch
            style={{ width: rem(18), height: rem(18) }}
            stroke={1.5}
          />
        }
        onChange={(e) => handleSearch(e.target.value)}
      />

      <ChipGroup
        value={category || ""}
        onChange={(val) => {
          if (typeof val === "string") onChangeCategory(val, "category");
        }}
      >
        <Group mt="md" justify="center">
          <Chip key="semua" radius="xs" value="">
            Semua
          </Chip>
          {filteredOptions.map((option) => (
            <Chip
              key={option.value}
              radius="xs"
              value={option.value.toString()}
            >
              {option.label}
            </Chip>
          ))}
        </Group>
      </ChipGroup>
    </>
  );
}
