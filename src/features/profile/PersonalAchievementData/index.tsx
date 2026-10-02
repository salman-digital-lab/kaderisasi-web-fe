"use client";
import {
  Alert,
  Button,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconDownload, IconEdit, IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import type { ReactElement } from "react";
import Link from "next/link";
import type { AchievementHistoryItem } from "@/types/api/profile-history";
import { useProfileHistory } from "../use-profile-history";
import { HistoryFeedback, HistoryPagination } from "../HistoryFeedback";
import { ACHIEVEMENT_STATUS_ENUM as Status } from "@/types/constants/achievement";
import {
  ACHIEVEMENT_STATUS_RENDER,
  ACHIEVEMENT_STATUS_COLOR,
  ACHIEVEMENT_TYPE_RENDER,
} from "@/constants/render/leaderboard";
import { handleDownloadFile } from "@/functions/common/handler";
import HistoryCard from "../HistoryCard";
import HistoryPanelHeader from "../HistoryPanelHeader";
import classes from "../profile.module.css";

function AchievementDetails({
  achievement,
}: {
  achievement: AchievementHistoryItem;
}): ReactElement {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function download(): Promise<void> {
    setLoading(true);
    setError("");
    try {
      await handleDownloadFile(
        achievement.proof,
        `bukti-prestasi-${achievement.name}.pdf`,
      );
    } catch {
      setError("Bukti belum dapat diunduh. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <Stack gap="md">
      <Text className={classes.description}>{achievement.description}</Text>
      <Text c="dimmed">
        Tanggal prestasi:{" "}
        {new Date(achievement.achievement_date).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </Text>
      {error && (
        <Text role="alert" c="red">
          {error}
        </Text>
      )}
      <div className={classes.actions}>
        {achievement.proof ? (
          <Button
            variant="light"
            loading={loading}
            leftSection={<IconDownload size={16} aria-hidden />}
            onClick={download}
          >
            Unduh bukti
          </Button>
        ) : (
          <Text c="dimmed">Bukti belum tersedia.</Text>
        )}
      </div>
    </Stack>
  );
}
export default function PersonalAchievementData({
  active,
}: {
  active: boolean;
}): ReactElement {
  const history = useProfileHistory("achievements", active);
  const {
    data,
    search: query,
    status,
    setSearch: setQuery,
    setStatus,
  } = history;
  const filtered = data?.items ?? [];
  const summary = data
    ? [
        `${data.summary.total} prestasi`,
        `${data.summary.points} poin disetujui`,
        ...(data.summary.pending
          ? [`${data.summary.pending} menunggu persetujuan`]
          : []),
      ].join(" · ")
    : "Riwayat prestasi dan poin Anda.";
  return (
    <Stack gap="lg" aria-busy={history.pending}>
      <HistoryPanelHeader
        title="Prestasi saya"
        summary={summary}
        action={{ href: "/leaderboard/submit", label: "Tambah prestasi" }}
      />
      <HistoryFeedback {...history} />
      {data && data.summary.total > 0 ? (
        <>
          <div className={classes.toolbar}>
            <TextInput
              label="Cari prestasi"
              placeholder="Nama prestasi"
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
              leftSection={<IconSearch size={16} aria-hidden />}
            />
            <Select
              label="Status prestasi"
              value={status}
              onChange={(value) => setStatus(value ?? "all")}
              allowDeselect={false}
              data={[
                { value: "all", label: "Semua status" },
                ...Object.entries(ACHIEVEMENT_STATUS_RENDER).map(
                  ([value, label]) => ({ value, label }),
                ),
              ]}
            />
          </div>
          <Text c="dimmed" role="status">
            Menampilkan {data.meta.total} dari {data.summary.total} prestasi
          </Text>
          <Stack gap="md">
            {filtered.map((item) => (
              <HistoryCard
                key={item.id}
                title={item.name}
                status={{
                  label: ACHIEVEMENT_STATUS_RENDER[item.status],
                  color: ACHIEVEMENT_STATUS_COLOR[item.status],
                }}
                meta={[
                  ACHIEVEMENT_TYPE_RENDER[item.type],
                  item.status === Status.APPROVED
                    ? `${item.score} poin`
                    : item.status === Status.REJECTED
                      ? "Tidak menambah poin"
                      : `${item.score} poin jika disetujui`,
                ]}
                notice={
                  item.status === Status.REJECTED && (
                    <Alert color="red" title="Alasan penolakan" role="note">
                      {item.remark || "Alasan belum tersedia."}
                    </Alert>
                  )
                }
                actions={
                  (item.status === Status.PENDING ||
                    item.status === Status.REJECTED) && (
                    <Button
                      component={Link}
                      href={`/leaderboard/edit/${item.id}`}
                      variant="outline"
                      leftSection={<IconEdit size={16} aria-hidden />}
                    >
                      Ubah prestasi
                    </Button>
                  )
                }
                details={<AchievementDetails achievement={item} />}
              />
            ))}
          </Stack>
          {!filtered.length && !history.pending && (
            <Paper withBorder className={classes.empty}>
              <Text fw={600}>Tidak ada prestasi yang sesuai</Text>
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
            label="Halaman prestasi saya"
          />
        </>
      ) : data && !history.pending && !history.error ? (
        <Paper withBorder className={classes.empty}>
          <Text fw={600}>Belum ada prestasi</Text>
          <Text c="dimmed" mt="xs">
            Tambahkan prestasi beserta buktinya untuk ditinjau.
          </Text>
        </Paper>
      ) : null}
    </Stack>
  );
}
