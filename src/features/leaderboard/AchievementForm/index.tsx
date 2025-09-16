"use client";

import { useState } from "react";
import {
  Button,
  FileInput,
  Select,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import showNotif from "@/functions/common/notification";
import { ACHIEVEMENT_TYPE_OPTIONS } from "@/constants/form/achievement";
import { submitAchievement } from "@/services/leaderboard";
import { DateInput } from "@mantine/dates";
import UniversitySelect from "@/components/common/UniversitySelect";
import editProfile from "@/functions/server/editProfile";

type AchievementFormProps = {
  token: string;
  whatsapp?: string;
  university_id?: string;
};

export default function AchievementForm({ token, whatsapp, university_id }: AchievementFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      whatsapp: whatsapp || "",
      name: "",
      description: "",
      achievement_date: null as string | null,
      type: "",
      proof: null as File | null,
      university_id: university_id || "",
    },
    validate: {
      whatsapp: (value) => (value ? null : "Nomor WhatsApp harus diisi"),
      name: (value) => (value ? null : "Nama prestasi harus diisi"),
      description: (value) => (value ? null : "Deskripsi prestasi harus diisi"),
      achievement_date: (value) =>
        value ? null : "Tanggal prestasi harus diisi",
      type: (value) => (value ? null : "Jenis prestasi harus diisi"),
      proof: (value) => (value ? null : "Bukti prestasi harus diisi"),
      university_id: (value) => (value ? null : "Universitas harus diisi"),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setLoading(true);
      if (!values.proof) {
        throw new Error("Bukti prestasi harus diisi");
      }

      await editProfile({ whatsapp: values.whatsapp, university_id: Number(values.university_id) });

      await submitAchievement(
        {
          name: values.name,
          description: values.description,
          achievement_date: values.achievement_date || "",
          type: values.type,
          proof: values.proof,
        },
        token,
      );

      showNotif("Prestasi berhasil dikirim");
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
        <TextInput
          label="Nomor Whatsapp"
          placeholder="Cth: 6281234567890"
          description="Cth: 6281234567890. Pastikan nomor whatsapp kamu aktif. Jangan khawatir, datamu aman."
          required
          {...form.getInputProps("whatsapp")}
        />
        <UniversitySelect
          label="Universitas"
          placeholder="Pilih Universitas Anda"
          required
          {...form.getInputProps("university_id")}
        />
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
          label="Bukti Prestasi"
          placeholder="Unggah bukti prestasi"
          accept="image/png,image/jpeg,image/jpg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          required
          {...form.getInputProps("proof")}
        />
        <Button type="submit" loading={loading}>
          Submit Achievement
        </Button>
      </Stack>
    </form>
  );
}
