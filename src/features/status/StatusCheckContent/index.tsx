"use client";

import {
  Alert,
  Button,
  Pagination,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useRef } from "react";
import type { ReactElement } from "react";
import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import { ACTIVITY_REGISTRANT_STATUS_ENUM } from "@/types/constants/activity";
import StatusHeader from "../StatusHeader";
import StatusRegistrationCard from "../StatusRegistrationCard";
import { statusLabel } from "../status-utils";
import { useProfileHistory } from "@/features/profile/use-profile-history";
import StatusSkeleton from "../StatusSkeleton";
import classes from "../status.module.css";

const STATUS_OPTIONS = [
  { value: "all", label: "Semua status" },
  ...Object.values(ACTIVITY_REGISTRANT_STATUS_ENUM).map((value) => ({
    value,
    label: statusLabel(value),
  })),
];

export default function StatusCheckContent(): ReactElement {
  const history = useProfileHistory("activities", true, 6, "name");
  const {
    data,
    page,
    search: query,
    status,
    setPage,
    setSearch: setQuery,
    setStatus,
  } = history;
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const filtered = data?.items ?? [];
  const pages = data?.meta.last_page ?? 1;
  const currentPage = page;
  const hasFilters = query.length > 0 || status !== "all";

  function clearFilters(): void {
    history.clear();
    searchInput.current?.focus();
  }

  function changePage(value: number): void {
    setPage(value);
    resultsHeading.current?.focus();
    resultsHeading.current?.scrollIntoView({ block: "start" });
  }

  return (
    <PageContainer size="lg" className={classes.page}>
      <StatusHeader />
      {!data && history.pending && <StatusSkeleton />}
      {history.error && (
        <Alert color="red" title="Status kegiatan belum dapat dimuat" mb="md">
          <Text>Silakan coba lagi untuk memuat pendaftaran Anda.</Text>
          <Button mt="sm" onClick={history.retry}>
            Coba lagi
          </Button>
        </Alert>
      )}
      {data?.summary.total === 0 ? (
        <Paper withBorder className={classes.empty}>
          <Title order={2} size="h3">
            Belum ada kegiatan terdaftar
          </Title>
          <Text c="dimmed">
            Kegiatan yang Anda daftarkan akan muncul di sini.
          </Text>
          <Button component={Link} href="/activity">
            Cari kegiatan
          </Button>
        </Paper>
      ) : data ? (
        <Stack gap="lg" aria-busy={history.pending}>
          <div className={classes.toolbar}>
            <TextInput
              ref={searchInput}
              label="Cari kegiatan"
              placeholder="Nama kegiatan"
              inputMode="search"
              enterKeyHint="search"
              leftSection={<IconSearch size={18} aria-hidden />}
              value={query}
              onChange={(event) => {
                setQuery(event.currentTarget.value);
              }}
            />
            <Select
              label="Status kegiatan"
              value={status}
              data={STATUS_OPTIONS}
              allowDeselect={false}
              onChange={(value) => {
                setStatus(value ?? "all");
              }}
            />
          </div>
          <div className={classes.resultsHeader}>
            <div role="status">
              <Title
                order={2}
                size="h4"
                tabIndex={-1}
                ref={resultsHeading}
                className={classes.resultsHeading}
              >
                {hasFilters
                  ? `${data.meta.total} dari ${data.summary.total}`
                  : data.summary.total}{" "}
                pendaftaran
              </Title>
              <Text c="dimmed" size="sm">
                {history.pending
                  ? "Memuat status kegiatan..."
                  : "Pendaftaran terbaru"}
              </Text>
            </div>
            {hasFilters && (
              <Button variant="subtle" onClick={clearFilters}>
                Hapus filter
              </Button>
            )}
          </div>
          {filtered.length > 0 ? (
            <Stack gap="md">
              {filtered.map((registration) => (
                <StatusRegistrationCard
                  key={registration.id}
                  registration={registration}
                />
              ))}
            </Stack>
          ) : (
            <Paper withBorder className={classes.empty}>
              <Title order={3} size="h4">
                Tidak ada kegiatan yang sesuai
              </Title>
              <Text c="dimmed">
                Coba kata kunci lain atau hapus filter untuk melihat semua
                pendaftaran.
              </Text>
            </Paper>
          )}
          {pages > 1 && (
            <nav aria-label="Halaman pendaftaran kegiatan">
              <Pagination
                total={pages}
                value={currentPage}
                disabled={history.pending}
                onChange={changePage}
                layout="responsive"
                classNames={{
                  control: classes.paginationControl,
                  label: classes.paginationLabel,
                }}
                formatLabel={({ page: activePage, totalPages }) =>
                  `Halaman ${activePage} dari ${totalPages}`
                }
                getItemProps={(value) => ({ "aria-label": `Halaman ${value}` })}
              />
            </nav>
          )}
        </Stack>
      ) : null}
    </PageContainer>
  );
}
