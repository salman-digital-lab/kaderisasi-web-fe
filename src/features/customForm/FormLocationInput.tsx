"use client";
import { useEffect, useState, type ReactElement } from "react";
import { Button, Select, Stack } from "@mantine/core";
import type { SelectProps } from "@mantine/core";
import { getCitiesByProvince, getCountries } from "@/services/profile";

export function FormLocationInput({
  kind,
  province,
  ...props
}: SelectProps & {
  kind: "city" | "country";
  province?: string;
}): ReactElement {
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setOptions([]);
    if (kind === "city" && !province) return;
    setLoading(true);
    setFailed(false);
    const request =
      kind === "country"
        ? getCountries()
        : getCitiesByProvince(Number(province));
    void request
      .then((rows) => {
        if (active)
          setOptions(
            rows.map((row) => ({
              label: row.name,
              value: kind === "country" ? row.name : String(row.id),
            })),
          );
      })
      .catch(() => {
        if (active) setFailed(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [kind, province, attempt]);
  return (
    <Stack gap="xs">
      <Select
        {...props}
        data={options}
        searchable
        disabled={props.disabled || loading || (kind === "city" && !province)}
        placeholder={
          loading
            ? "Memuat pilihan…"
            : kind === "city" && !province
              ? "Pilih provinsi terlebih dahulu"
              : "Pilih opsi"
        }
        error={failed ? "Pilihan belum dapat dimuat." : props.error}
      />
      {failed && (
        <Button variant="subtle" onClick={() => setAttempt(attempt + 1)}>
          Muat ulang pilihan
        </Button>
      )}
    </Stack>
  );
}
