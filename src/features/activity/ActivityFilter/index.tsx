"use client";

import React from "react";
import { ACTIVITY_CATEGORY_OPTIONS } from "../../../constants/form/activity";
import { Chip, ChipGroup, Group, rem, TextInput } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ActivityFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get("category");

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
          {ACTIVITY_CATEGORY_OPTIONS.map((option) => (
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
