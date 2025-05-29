"use client";

import { useState } from "react";
import {
  Button,
  FileInput,
  Select,
  Stack,
  TextInput,
  Textarea,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import showNotif from "@/functions/common/notification";
import { ACHIEVEMENT_TYPE_OPTIONS } from "@/constants/form/achievement";
import { editAchievement } from "@/services/leaderboard";
import { DateInput } from "@mantine/dates";
import { Achievement } from "@/types/model/achievement";
import { IconAlertCircle } from "@tabler/icons-react";
import { ACHIEVEMENT_STATUS_ENUM } from "@/types/constants/achievement";

type EditAchievementFormProps = {
  token: string;
  achievement: Achievement;
};

export default function EditAchievementForm({
  token,
  achievement,
}: EditAchievementFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      name: achievement.name,
      description: achievement.description,
      achievement_date: achievement.achievement_date,
      type: String(achievement.type),
      proof: null as File | null,
    },
    validate: {
      name: (value) => (value ? null : "Nama prestasi harus diisi"),
      description: (value) => (value ? null : "Deskripsi prestasi harus diisi"),
      achievement_date: (value) =>
        value ? null : "Tanggal prestasi harus diisi",
      type: (value) => (value ? null : "Jenis prestasi harus diisi"),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setLoading(true);

      await editAchievement(
        achievement.id,
        {
          name: values.name,
          description: values.description,
          achievement_date: values.achievement_date || "",
          type: values.type,
          proof: values.proof || undefined,
        },
        token,
      );

      showNotif("Prestasi berhasil diperbarui");
      router.push("/leaderboard");
      router.refresh();
    } catch (error) {
      if (error instanceof Error) showNotif(error.message, true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        {achievement.status === ACHIEVEMENT_STATUS_ENUM.REJECTED && (
          <Alert
            variant="light"
            color="red"
            title="Alasan Penolakan Sebelumnya"
            icon={<IconAlertCircle size={16} />}
          >
            {achievement.remark}
          </Alert>
        )}
        <TextInput
          label="Nama Prestasi"
          placeholder="Masukkan nama prestasi"
          required
          {...form.getInputProps("name")}
        />
        <DateInput
          label="Tanggal Prestasi"
          placeholder="Pilih tanggal prestasi"
          required
          {...form.getInputProps("achievement_date")}
        />
        <Textarea
          label="Deskripsi Prestasi"
          placeholder="Jelaskan prestasi anda sedetil mungkin, jangan lupa sebutkan skala(Kampus, Nasional, Internasional) dari prestasi anda"
          required
          minRows={3}
          {...form.getInputProps("description")}
        />
        <Select
          label="Jenis Prestasi"
          placeholder="Pilih jenis prestasi"
          data={ACHIEVEMENT_TYPE_OPTIONS}
          required
          {...form.getInputProps("type")}
        />
        <FileInput
          label="Bukti Prestasi Baru (Opsional)"
          placeholder="Unggah bukti prestasi baru jika diperlukan"
          accept="image/png,image/jpeg,image/jpg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          {...form.getInputProps("proof")}
        />
        <Button type="submit" loading={loading}>
          Perbarui Prestasi
        </Button>
      </Stack>
    </form>
  );
}
