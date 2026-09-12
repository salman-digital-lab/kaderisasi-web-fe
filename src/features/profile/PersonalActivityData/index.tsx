"use client";

import {
  Button,
  Paper,
  Stack,
  Text,
  Title,
  TextInput,
  Select,
  Pagination,
  Group,
} from "@mantine/core";
import { IconSearch, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import type { ReactElement } from "react";
import Link from "next/link";
import ActivityPersonalCard from "@/components/common/ActivityPersonalCard";
import type { Activity, Registrant } from "@/types/model/activity";
import { ACTIVITY_REGISTRANT_STATUS_ENUM } from "@/types/constants/activity";
import classes from "../profile.module.css";

export default function PersonalActivityData({
  activities,
}: {
  activities: ({ activity: Activity } & Registrant)[];
}): ReactElement {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const filtered = activities.filter(
    (item) =>
      (status === "all" || item.status === status) &&
      [item.activity.name, item.activity.description, item.status].some(
        (value) =>
          value
            ?.toLocaleLowerCase("id")
            .includes(query.trim().toLocaleLowerCase("id")),
      ),
  );
  const pages = Math.ceil(filtered.length / 6);
  const currentPage = Math.max(1, Math.min(page, pages));
  function clear(): void {
    setQuery("");
    setStatus("all");
    setPage(1);
  }
  return (
    <Stack gap="lg">
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
      {activities.length ? (
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
            {filtered.length} kegiatan sesuai dari {activities.length}{" "}
            pendaftaran
          </Text>
          <Stack gap="md">
            {filtered
              .slice((currentPage - 1) * 6, currentPage * 6)
              .map((item) => (
                <ActivityPersonalCard
                  key={item.id}
                  activityName={item.activity.name}
                  slug={item.activity.slug}
                  registrationStatus={item.status}
                  imageUrl={item.activity.additional_config?.images?.[0]}
                  visibleAt={item.visible_at}
                  registrationId={item.id}
                  hasCertificate={
                    !!item.activity.additional_config?.certificate_template_id
                  }
                  certificateCode={item.certificate_code}
                  certificateState={item.certificate_state}
                />
              ))}
          </Stack>
          {!filtered.length && (
            <Paper withBorder className={classes.empty}>
              <Text fw={600}>Tidak ada kegiatan yang sesuai</Text>
              <Button mt="sm" variant="light" onClick={clear}>
                Hapus pencarian
              </Button>
            </Paper>
          )}
          {pages > 1 && (
            <Group justify="center">
              <Pagination
                classNames={{ control: classes.paginationControl }}
                aria-label="Halaman kegiatan saya"
                total={pages}
                value={currentPage}
                onChange={setPage}
                getItemProps={(value) => ({ "aria-label": `Halaman ${value}` })}
              />
            </Group>
          )}
        </>
      ) : (
        <Paper withBorder className={classes.empty}>
          <Text fw={600}>Belum ada kegiatan</Text>
          <Text c="dimmed" mt="xs">
            Kegiatan yang Anda daftarkan akan muncul di sini.
          </Text>
        </Paper>
      )}
    </Stack>
  );
}
