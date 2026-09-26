"use client";

import { Alert, Button, Group, Pagination, Stack, Text } from "@mantine/core";
import type { ReactElement } from "react";
import classes from "./profile.module.css";

export function HistoryFeedback({
  pending,
  error,
  retry,
}: {
  pending: boolean;
  error: string;
  retry: () => void;
}): ReactElement | null {
  if (!pending && !error) return null;
  return (
    <Stack gap="sm" aria-live="polite">
      {pending && (
        <Text c="dimmed" role="status">
          Memuat riwayat…
        </Text>
      )}
      {error && (
        <Alert color="red" title="Riwayat belum tersedia">
          <Text>{error}</Text>
          <Button mt="sm" variant="light" onClick={retry}>
            Coba lagi
          </Button>
        </Alert>
      )}
    </Stack>
  );
}

export function HistoryPagination({
  total,
  page,
  pending,
  onChange,
  label,
}: {
  total: number;
  page: number;
  pending: boolean;
  onChange: (value: number) => void;
  label: string;
}): ReactElement | null {
  return total > 1 ? (
    <Group justify="center">
      <Pagination
        classNames={{ control: classes.paginationControl }}
        aria-label={label}
        total={total}
        value={page}
        disabled={pending}
        onChange={onChange}
        getItemProps={(value) => ({ "aria-label": `Halaman ${value}` })}
      />
    </Group>
  ) : null;
}
