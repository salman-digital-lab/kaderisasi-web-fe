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
import { useState } from "react";
import type { ReactElement } from "react";
import Link from "next/link";
import type { RuangCurhatData } from "@/types/model/ruangcurhat";
import { PROBLEM_STATUS_RENDER } from "@/constants/render/ruangcurhat";
import RuangCurhatCard from "@/components/common/RuangCurhatCard";
import classes from "../profile.module.css";

export default function RuangCurhatList({
  data,
}: {
  data: RuangCurhatData[];
}): ReactElement {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const filtered = data.filter(
    (item) =>
      (status === "all" || String(item.status) === status) &&
      [
        item.problem_category,
        item.problem_description,
        item.handling_technic,
        item.owner_name,
      ].some((value) =>
        value
          ?.toLocaleLowerCase("id")
          .includes(query.trim().toLocaleLowerCase("id")),
      ),
  );
  return (
    <Stack gap="lg">
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
      {data.length ? (
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
            Menampilkan {filtered.length} dari {data.length} sesi
          </Text>
          <Stack gap="md">
            {filtered.map((item) => (
              <RuangCurhatCard key={item.id} data={item} />
            ))}
          </Stack>
          {!filtered.length && (
            <Paper withBorder className={classes.empty}>
              <Text fw={600}>Tidak ada sesi yang sesuai</Text>
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
          <Text fw={600}>Belum ada sesi Ruang Curhat</Text>
          <Text c="dimmed" mt="xs">
            Riwayat sesi akan muncul setelah Anda mengajukan konseling.
          </Text>
        </Paper>
      )}
    </Stack>
  );
}
