"use client";
import { Button, Paper, Select, Stack, Text, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import type { ReactElement } from "react";
import { useProfileHistory } from "../use-profile-history";
import { HistoryFeedback, HistoryPagination } from "../HistoryFeedback";
import {
  PROBLEM_STATUS_RENDER,
  PROBLEM_STATUS_RENDER_COLOR,
} from "@/constants/render/ruangcurhat";
import { PROBLEM_OWNER_ENUM } from "@/types/constants/ruangcurhat";
import type { ConsultationHistoryItem } from "@/types/api/profile-history";
import HistoryCard from "../HistoryCard";
import HistoryPanelHeader from "../HistoryPanelHeader";
import classes from "../profile.module.css";

const formatDate = (value: string): string =>
  new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

function ConsultationDetails({
  item,
}: {
  item: ConsultationHistoryItem;
}): ReactElement {
  return (
    <Stack gap="sm">
      <div>
        <Text fw={600} size="sm">
          Deskripsi
        </Text>
        <Text className={classes.description}>{item.problem_description}</Text>
      </div>
      <div>
        <Text fw={600} size="sm">
          Konselor
        </Text>
        <Text>
          {item.adminUser?.display_name || "Konselor belum ditetapkan."}
        </Text>
        {item.adminUser?.email && (
          <Text c="dimmed" size="sm" className={classes.description}>
            {item.adminUser.email}
          </Text>
        )}
      </div>
    </Stack>
  );
}

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
      <HistoryPanelHeader
        title="Sesi Ruang Curhat saya"
        summary={
          data
            ? `${data.summary.total} sesi`
            : "Status pengajuan dan informasi konselor Anda."
        }
        action={{ href: "/consultation", label: "Ajukan sesi baru" }}
      />
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
              <HistoryCard
                key={item.id}
                title={item.problem_category}
                status={{
                  label: PROBLEM_STATUS_RENDER[item.status],
                  color: PROBLEM_STATUS_RENDER_COLOR[item.status],
                }}
                meta={[
                  `Diajukan ${formatDate(item.created_at)}`,
                  item.handling_technic,
                  item.problem_ownership === PROBLEM_OWNER_ENUM.TEMAN
                    ? `Untuk ${item.owner_name || "teman"}`
                    : "Untuk diri sendiri",
                ]}
                details={<ConsultationDetails item={item} />}
              />
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
