"use client";

import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import Form from "next/form";
import { ACTIVITY_CATEGORY_OPTIONS } from "@/constants/form/activity";
import { Button, Chip, ChipGroup, Group, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { getActivityCategories } from "@/services/activity";
import classes from "./index.module.css";

export default function ActivityFilter(): ReactElement {
  const router = useRouter();
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

  const changeCategory = (value: string): void => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("category", value);
    else params.delete("category");
    params.delete("page");
    router.push(`/activity?${params}`, { scroll: false });
  };

  return (
    <>
      <Form action="/activity" className={classes.searchForm}>
        <TextInput
          key={search}
          name="search"
          aria-label="Cari kegiatan"
          placeholder="Cari Kegiatan"
          defaultValue={search}
          leftSection={<IconSearch size={18} aria-hidden />}
          className={classes.searchInput}
        />
        <input type="hidden" name="category" value={category} />
        <Button type="submit">Cari</Button>
      </Form>
      <ChipGroup
        value={category}
        onChange={(value) => {
          if (typeof value === "string") changeCategory(value);
        }}
      >
        <Group
          mt="md"
          gap="xs"
          role="group"
          aria-label="Filter kategori kegiatan"
        >
          <Chip radius="md" value="">
            Semua
          </Chip>
          {filteredOptions.map((option) => (
            <Chip
              key={option.value}
              radius="md"
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
