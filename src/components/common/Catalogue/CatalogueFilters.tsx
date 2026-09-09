import Form from "next/form";
import { Button, Group, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import type { ReactElement } from "react";
import LinkButton from "@/components/common/LinkButton";
import classes from "./Catalogue.module.css";

type CatalogueFiltersProps = {
  action: string;
  search: string;
  searchLabel: string;
  maxLength?: number;
  filterLabel: string;
  filterName: string;
  filterValue: string;
  options: { label: string; href: string; active: boolean }[];
};

export default function CatalogueFilters({
  action,
  search,
  searchLabel,
  maxLength,
  filterLabel,
  filterName,
  filterValue,
  options,
}: CatalogueFiltersProps): ReactElement {
  return (
    <div>
      <Form
        action={action}
        role="search"
        aria-label={searchLabel}
        className={classes.searchForm}
      >
        <TextInput
          key={search}
          name="search"
          aria-label={searchLabel}
          placeholder={searchLabel}
          defaultValue={search}
          maxLength={maxLength}
          leftSection={<IconSearch size={18} aria-hidden />}
          className={classes.searchInput}
        />
        <input type="hidden" name={filterName} value={filterValue} />
        <Button type="submit" className={classes.searchButton}>
          Cari
        </Button>
      </Form>
      <Group mt="md" gap="xs" role="group" aria-label={filterLabel}>
        {options.map((option) => (
          <LinkButton
            key={option.href}
            href={option.href}
            variant={option.active ? "filled" : "light"}
            color={option.active ? undefined : "gray"}
            aria-current={option.active ? "page" : undefined}
          >
            {option.label}
          </LinkButton>
        ))}
      </Group>
    </div>
  );
}
