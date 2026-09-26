"use client";

import {
  Button,
  Paper,
  Stack,
  Text,
  Title,
  TextInput,
  Select,
} from "@mantine/core";
import { IconSearch, IconPlus } from "@tabler/icons-react";
import type { ReactElement } from "react";
import Link from "next/link";
import ActivityPersonalCard from "@/components/common/ActivityPersonalCard";
import { useProfileHistory } from "../use-profile-history";
import { HistoryFeedback, HistoryPagination } from "../HistoryFeedback";
import { ACTIVITY_REGISTRANT_STATUS_ENUM } from "@/types/constants/activity";
import classes from "../profile.module.css";

export default function PersonalActivityData({
  active,
}: {
  active: boolean;
}): ReactElement {
  const history = useProfileHistory("activities", active);
  const {
    data,
    search: query,
    status,
    setSearch: setQuery,
    setStatus,
    setPage,
    clear,
  } = history;
  const activities = data?.items ?? [];
  return (
    <Stack gap="lg" aria-busy={history.pending}>
      <div className={classes.sectionHeader}>
        <div>
          <Title order={2} size="h3">
            Kegiatan saya
          </Title>
          <Text c="dimmed" mt={4}>
            Pendaftaran, hasil seleksi, dan sertifikat kegiatan Anda.
          </Text>
        </div>
        <Button
          component={Link}
          href="/activity"
          variant="light"
          leftSection={<IconPlus size={16} aria-hidden />}
        >
          Cari kegiatan
        </Button>
      </div>
      <HistoryFeedback {...history} />
      {data && data.summary.total > 0 ? (
        <>
          <div className={classes.toolbar}>
            <TextInput
              label="Cari kegiatan"
              placeholder="Nama kegiatan atau status"
              leftSection={<IconSearch size={16} aria-hidden />}
              value={query}
              onChange={(event) => {
                setQuery(event.currentTarget.value);
                setPage(1);
              }}
            />
            <Select
              label="Status pendaftaran"
              allowDeselect={false}
              value={status}
              onChange={(value) => {
                setStatus(value ?? "all");
                setPage(1);
              }}
              data={[
                { value: "all", label: "Semua status" },
                ...Object.values(ACTIVITY_REGISTRANT_STATUS_ENUM).map(
                  (value) => ({
                    value,
                    label: value.charAt(0) + value.slice(1).toLowerCase(),
                  }),
                ),
              ]}
            />
          </div>
          <Text c="dimmed" role="status">
            {data.meta.total} kegiatan sesuai dari {data.summary.total}{" "}
            pendaftaran
          </Text>
          <Stack gap="md">
            {activities.map((item) => (
              <ActivityPersonalCard
                key={item.id}
                activityName={item.activity_name}
                slug={item.activity_slug}
                registrationStatus={item.status}
                imageUrl={item.image_url ?? undefined}
                visibleAt={item.visible_at ?? undefined}
                registrationId={item.id}
                hasCertificate={item.has_certificate}
                certificateCode={item.certificate_code}
                certificateState={item.certificate_state}
              />
            ))}
          </Stack>
          {!activities.length && !history.pending && (
            <Paper withBorder className={classes.empty}>
              <Text fw={600}>Tidak ada kegiatan yang sesuai</Text>
              <Button mt="sm" variant="light" onClick={clear}>
                Hapus pencarian
              </Button>
            </Paper>
          )}
          <HistoryPagination
            total={data.meta.last_page}
            page={history.page}
            pending={history.pending}
            onChange={setPage}
            label="Halaman kegiatan saya"
          />
        </>
      ) : data && !history.pending && !history.error ? (
        <Paper withBorder className={classes.empty}>
          <Text fw={600}>Belum ada kegiatan</Text>
          <Text c="dimmed" mt="xs">
            Kegiatan yang Anda daftarkan akan muncul di sini.
          </Text>
        </Paper>
      ) : null}
    </Stack>
  );
}
