"use client";
import {
  Accordion,
  Alert,
  Badge,
  Button,
  Group,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconDownload,
  IconEdit,
  IconPlus,
  IconSearch,
} from "@tabler/icons-react";
import { useState } from "react";
import type { ReactElement } from "react";
import Link from "next/link";
import type { Achievement } from "@/types/model/achievement";
import { ACHIEVEMENT_STATUS_ENUM as Status } from "@/types/constants/achievement";
import {
  ACHIEVEMENT_STATUS_RENDER,
  ACHIEVEMENT_STATUS_COLOR,
  ACHIEVEMENT_TYPE_RENDER,
} from "@/constants/render/leaderboard";
import { handleDownloadFile } from "@/functions/common/handler";
import classes from "../profile.module.css";

function AchievementDetails({
  achievement,
}: {
  achievement: Achievement;
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
      {achievement.status === Status.REJECTED && (
        <Alert title="Alasan penolakan" color="red">
          {achievement.remark || "Alasan belum tersedia."}
        </Alert>
      )}
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
        {(achievement.status === Status.PENDING ||
          achievement.status === Status.REJECTED) && (
          <Button
            component={Link}
            href={`/leaderboard/edit/${achievement.id}`}
            variant="outline"
            leftSection={<IconEdit size={16} aria-hidden />}
          >
            Edit prestasi
          </Button>
        )}
      </div>
    </Stack>
  );
}
export default function PersonalAchievementData({
  achievements,
}: {
  achievements: Achievement[];
}): ReactElement {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const totalScore = achievements.reduce((sum, item) => sum + item.score, 0);
  const filtered = achievements.filter(
    (item) =>
      (status === "all" || String(item.status) === status) &&
      item.name
        .toLocaleLowerCase("id")
        .includes(query.trim().toLocaleLowerCase("id")),
  );
  return (
    <Stack gap="lg">
      <div className={classes.sectionHeader}>
        <div>
          <Title order={2} size="h3">
            Prestasi saya
          </Title>
          <Text c="dimmed" mt={4}>
            {achievements.length} prestasi · {totalScore} total poin
          </Text>
        </div>
        <Button
          component={Link}
          href="/leaderboard/submit"
          variant="light"
          leftSection={<IconPlus size={16} aria-hidden />}
        >
          Tambah prestasi
        </Button>
      </div>
      {achievements.length ? (
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
            Menampilkan {filtered.length} dari {achievements.length} prestasi
          </Text>
          <Accordion variant="separated" radius="md">
            {filtered.map((item) => (
              <Accordion.Item key={item.id} value={String(item.id)}>
                <Accordion.Control>
                  <Stack gap="xs">
                    <Text fw={600} size="lg" className={classes.description}>
                      {item.name}
                    </Text>
                    <Group gap="sm">
                      <Text size="sm" c="dimmed">
                        {ACHIEVEMENT_TYPE_RENDER[item.type]}
                      </Text>
                      <Badge
                        tt="none"
                        variant="light"
                        color={ACHIEVEMENT_STATUS_COLOR[item.status]}
                        className={classes.badge}
                      >
                        {ACHIEVEMENT_STATUS_RENDER[item.status]}
                      </Badge>
                      <Text size="sm" fw={600}>
                        {item.score} poin
                      </Text>
                    </Group>
                  </Stack>
                </Accordion.Control>
                <Accordion.Panel>
                  <AchievementDetails achievement={item} />
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
          {!filtered.length && (
            <Paper withBorder className={classes.empty}>
              <Text fw={600}>Tidak ada prestasi yang sesuai</Text>
              <Button
                variant="light"
                mt="sm"
                onClick={() => {
                  setQuery("");
                  setStatus("all");
                }}
              >
                Hapus pencarian
              </Button>
            </Paper>
          )}
        </>
      ) : (
        <Paper withBorder className={classes.empty}>
          <Text fw={600}>Belum ada prestasi</Text>
          <Text c="dimmed" mt="xs">
            Tambahkan prestasi beserta buktinya untuk ditinjau.
          </Text>
        </Paper>
      )}
    </Stack>
  );
}
