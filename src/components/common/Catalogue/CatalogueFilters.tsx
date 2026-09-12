import { Group } from "@mantine/core";
import type { ReactElement } from "react";
import LinkButton from "@/components/common/LinkButton";
import CatalogueSearch from "./CatalogueSearch";

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
      <CatalogueSearch
        action={action}
        search={search}
        searchLabel={searchLabel}
        maxLength={maxLength}
      >
        <input type="hidden" name={filterName} value={filterValue} />
      </CatalogueSearch>
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
