"use client";
import {
  Button,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import type { ReactElement } from "react";
import Link from "next/link";
import { useProfileHistory } from "../use-profile-history";
import { HistoryFeedback, HistoryPagination } from "../HistoryFeedback";
import { PROBLEM_STATUS_RENDER } from "@/constants/render/ruangcurhat";
import RuangCurhatCard from "@/components/common/RuangCurhatCard";
import classes from "../profile.module.css";

export default function RuangCurhatList({
  active,
}: {
  active: boolean;
}): ReactElement {
  const history = useProfileHistory("consultations", active);
  const {
    data,
    search: query,
    status,
    setSearch: setQuery,
    setStatus,
  } = history;
  const filtered = data?.items ?? [];
  return (
    <Stack gap="lg" aria-busy={history.pending}>
      <div className={classes.sectionHeader}>
        <div>
          <Title order={2} size="h3">
            Sesi Ruang Curhat saya
          </Title>
          <Text c="dimmed" mt={4}>
            Lihat status pengajuan dan informasi konselor Anda.
          </Text>
        </div>
        <Button
          component={Link}
          href="/consultation"
          variant="light"
          leftSection={<IconPlus size={16} aria-hidden />}
        >
          Ajukan sesi baru
        </Button>
      </div>
      <HistoryFeedback {...history} />
      {data && data.summary.total > 0 ? (
        <>
          <div className={classes.toolbar}>
            <TextInput
              label="Cari sesi Ruang Curhat"
              placeholder="Kategori, deskripsi, atau metode"
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
              leftSection={<IconSearch size={16} aria-hidden />}
            />
            <Select
              label="Status sesi"
              value={status}
              allowDeselect={false}
              onChange={(value) => setStatus(value ?? "all")}
              data={[
                { value: "all", label: "Semua status" },
                ...Object.entries(PROBLEM_STATUS_RENDER).map(
                  ([value, label]) => ({ value, label }),
                ),
              ]}
            />
          </div>
          <Text c="dimmed" role="status">
            Menampilkan {data.meta.total} dari {data.summary.total} sesi
          </Text>
          <Stack gap="md">
            {filtered.map((item) => (
              <RuangCurhatCard key={item.id} data={item} />
            ))}
          </Stack>
          {!filtered.length && !history.pending && (
            <Paper withBorder className={classes.empty}>
              <Text fw={600}>Tidak ada sesi yang sesuai</Text>
              <Button variant="light" mt="sm" onClick={history.clear}>
                Hapus pencarian
              </Button>
            </Paper>
          )}
          <HistoryPagination
            total={data.meta.last_page}
            page={history.page}
            pending={history.pending}
            onChange={history.setPage}
            label="Halaman sesi Ruang Curhat"
          />
        </>
      ) : data && !history.pending && !history.error ? (
        <Paper withBorder className={classes.empty}>
          <Text fw={600}>Belum ada sesi Ruang Curhat</Text>
          <Text c="dimmed" mt="xs">
            Riwayat sesi akan muncul setelah Anda mengajukan konseling.
          </Text>
        </Paper>
      ) : null}
    </Stack>
  );
}
