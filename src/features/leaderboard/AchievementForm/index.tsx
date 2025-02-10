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

type AchievementFormProps = {
  token: string;
};

const ACHIEVEMENT_TYPES = [
  { value: "1", label: "Academic" },
  { value: "2", label: "Non-Academic" },
  { value: "3", label: "Organization" },
  { value: "4", label: "Competition" },
  { value: "5", label: "Research" },
  { value: "6", label: "Community Service" },
];

export default function AchievementForm({ token }: AchievementFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      type: "",
      proof: null as File | null,
    },
    validate: {
      name: (value) => (value ? null : "Achievement name is required"),
      description: (value) =>
        value ? null : "Achievement description is required",
      type: (value) => (value ? null : "Achievement type is required"),
      proof: (value) => (value ? null : "Achievement proof is required"),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("type", values.type);
      if (values.proof) {
        formData.append("proof", values.proof);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BE_API}/v2/achievements`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit achievement");
      }

      showNotif("Achievement submitted successfully");
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
          label="Nama Prestasi"
          placeholder="Masukkan nama prestasi"
          required
          {...form.getInputProps("name")}
        />
        <Textarea
          label="Deskripsi Prestasi"
          placeholder="Deskripsi prestasi"
          required
          minRows={3}
          {...form.getInputProps("description")}
        />
        <Select
          label="Jenis Prestasi"
          placeholder="Pilih jenis prestasi"
          data={ACHIEVEMENT_TYPES}
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
