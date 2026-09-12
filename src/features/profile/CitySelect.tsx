"use client";
import { Button, Loader, Select, Stack } from "@mantine/core";
import type { SelectProps } from "@mantine/core";
import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { getCitiesByProvince } from "@/services/profile";
import type { City } from "@/types/model/city";

type CitySelectProps = Omit<SelectProps, "data"> & {
  provinceId: string | null;
};
export default function CitySelect({
  provinceId,
  ...props
}: CitySelectProps): ReactElement {
  const [result, setResult] = useState<{
    provinceId: string | null;
    data: City[];
    error: string;
  }>({ provinceId: null, data: [], error: "" });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!provinceId) return;
    let active = true;
    getCitiesByProvince(Number(provinceId))
      .then((data) => {
        if (active) setResult({ provinceId, data, error: "" });
      })
      .catch(() => {
        if (active)
          setResult({
            provinceId,
            data: [],
            error: "Daftar kota belum dapat dimuat.",
          });
      });
    return () => {
      active = false;
    };
  }, [provinceId, attempt]);
  const loading = Boolean(provinceId && result.provinceId !== provinceId);
  const error = result.provinceId === provinceId ? result.error : "";
  return (
    <Stack gap="xs">
      <Select
        {...props}
        searchable
        allowDeselect={false}
        disabled={!provinceId || loading || Boolean(error)}
        data={
          result.provinceId === provinceId
            ? result.data.map((city) => ({
                value: String(city.id),
                label: city.name,
              }))
            : []
        }
        placeholder={
          !provinceId
            ? "Pilih provinsi terlebih dahulu"
            : loading
              ? "Memuat daftar kota..."
              : "Pilih kota / kabupaten"
        }
        rightSection={loading ? <Loader size={16} /> : undefined}
        error={error || props.error}
      />
      {error && (
        <Button
          variant="subtle"
          onClick={() => {
            setResult({ provinceId: null, data: [], error: "" });
            setAttempt((value) => value + 1);
          }}
        >
          Muat ulang kota
        </Button>
      )}
    </Stack>
  );
}
