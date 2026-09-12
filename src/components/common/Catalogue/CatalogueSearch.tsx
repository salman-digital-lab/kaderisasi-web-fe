import Form from "next/form";
import { Button, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import type { ReactElement, ReactNode } from "react";
import classes from "./Catalogue.module.css";

export default function CatalogueSearch({
  action,
  search,
  searchLabel,
  maxLength,
  children,
}: {
  action: string;
  search: string;
  searchLabel: string;
  maxLength?: number;
  children?: ReactNode;
}): ReactElement {
  return (
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
      {children}
      <Button type="submit" className={classes.searchButton}>
        Cari
      </Button>
    </Form>
  );
}
