import {
  ActionIcon,
  Button,
  Group,
  NumberInput,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconPencil, IconTrash, IconPlus } from "@tabler/icons-react";
import type { UseFormReturnType } from "@mantine/form";
import { useState } from "react";
import type { ReactElement } from "react";
import UniversityNameSelect from "@/components/common/UniversityNameSelect";
import type { EducationEntry, WorkEntry } from "@/types/model/members";
import type { ProfileFormValues } from "./form-values";
import { educationEntrySchema, workEntrySchema } from "./history-schema";
import classes from "./PersonalDataForm/index.module.css";

const DEGREES = [
  { value: "bachelor", label: "S1" },
  { value: "master", label: "S2" },
  { value: "doctoral", label: "S3" },
];
type HistoryFieldsProps = {
  form: UseFormReturnType<ProfileFormValues>;
  kind: "education_history" | "work_history";
};
export default function HistoryFields({
  form,
  kind,
}: HistoryFieldsProps): ReactElement {
  const [editing, setEditing] = useState<number | null>(null);
  const [snapshot, setSnapshot] = useState<EducationEntry | WorkEntry | null>(
    null,
  );
  const education = kind === "education_history";
  const label = education ? "pendidikan" : "pekerjaan";
  const values = form.getValues()[kind];
  const [invalidEditors, setInvalidEditors] = useState<number[]>([]);
  const newlyInvalid = values.flatMap((_, index) =>
    hasErrors(index) && !invalidEditors.includes(index) ? [index] : [],
  );
  if (newlyInvalid.length)
    setInvalidEditors([...invalidEditors, ...newlyInvalid]);
  function hasErrors(index: number): boolean {
    return Object.keys(form.errors).some((key) =>
      key.startsWith(`${kind}.${index}.`),
    );
  }
  function clearEntryErrors(index: number): void {
    Object.keys(form.errors)
      .filter((key) => key.startsWith(`${kind}.${index}.`))
      .forEach((key) => form.clearFieldError(key));
  }
  function cancel(index: number): void {
    if (snapshot) form.replaceListItem(kind, index, snapshot);
    else form.removeListItem(kind, index);
    clearEntryErrors(index);
    setInvalidEditors((indices) => indices.filter((value) => value !== index));
    setEditing(null);
    setSnapshot(null);
  }
  function finish(index: number): void {
    clearEntryErrors(index);
    const entry = form.getValues()[kind][index];
    const result = education
      ? educationEntrySchema.safeParse(entry)
      : workEntrySchema.safeParse(entry);
    if (!result.success) {
      for (const issue of result.error.issues)
        form.setFieldError(
          `${kind}.${index}.${issue.path.join(".")}`,
          issue.message,
        );
      const first = result.error.issues[0];
      if (first)
        requestAnimationFrame(() =>
          form
            .getInputNode(`${kind}.${index}.${first.path.join(".")}`)
            ?.focus(),
        );
      return;
    }
    form.replaceListItem(kind, index, result.data);
    clearEntryErrors(index);
    setInvalidEditors((indices) => indices.filter((value) => value !== index));
    setEditing(null);
    setSnapshot(null);
  }
  function add(): void {
    const index = form.getValues()[kind].length;
    form.insertListItem(
      kind,
      education
        ? {
            degree: "bachelor",
            institution: "",
            faculty: "",
            major: "",
            intake_year: undefined,
          }
        : {
            job_title: "",
            company: "",
            start_year: undefined,
            end_year: undefined,
          },
    );
    setSnapshot(null);
    setEditing(index);
    requestAnimationFrame(() =>
      form
        .getInputNode(`${kind}.${index}.${education ? "degree" : "job_title"}`)
        ?.focus(),
    );
  }
  function summary(index: number): string {
    if (education) {
      const item = form.getValues().education_history[index];
      if (!item) return "Data belum lengkap";
      return (
        [
          DEGREES.find((degree) => degree.value === item.degree)?.label,
          item.institution,
          item.faculty,
          item.major,
          item.intake_year,
        ]
          .filter(Boolean)
          .join(" · ") || "Data belum lengkap"
      );
    }
    const item = form.getValues().work_history[index];
    if (!item) return "Data belum lengkap";
    return (
      [
        item.job_title,
        item.company,
        item.start_year
          ? `${item.start_year} - ${item.end_year ?? "Sekarang"}`
          : "",
      ]
        .filter(Boolean)
        .join(" · ") || "Data belum lengkap"
    );
  }
  return (
    <Stack gap="md">
      <Text c="dimmed" size="sm">
        Selesaikan isian, lalu pilih Simpan perubahan untuk menyimpan riwayat.
      </Text>
      {!values.length && <Text c="dimmed">Belum ada riwayat {label}.</Text>}
      {values.map((_, index) => (
        <Paper key={index} withBorder p="md">
          <Group justify="space-between" wrap="wrap" mb="sm">
            <Text fw={600}>
              {education ? "Pendidikan" : "Pekerjaan / aktivitas"} {index + 1}
            </Text>
            {editing !== index && !invalidEditors.includes(index) && (
              <Group gap="xs">
                <ActionIcon
                  variant="subtle"
                  aria-label={`Edit ${label} ${index + 1}`}
                  disabled={editing !== null || invalidEditors.length > 0}
                  onClick={() => {
                    const entry = form.getValues()[kind][index];
                    if (entry) {
                      setSnapshot({ ...entry });
                      setEditing(index);
                    }
                  }}
                >
                  <IconPencil size={18} aria-hidden />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  aria-label={`Hapus ${label} ${index + 1}`}
                  disabled={editing !== null || invalidEditors.length > 0}
                  onClick={() => form.removeListItem(kind, index)}
                >
                  <IconTrash size={18} aria-hidden />
                </ActionIcon>
              </Group>
            )}
          </Group>
          {editing !== index && !invalidEditors.includes(index) ? (
            <Text className={classes.summary}>{summary(index)}</Text>
          ) : (
            <Stack gap="md">
              <div className={classes.fields}>
                {education ? (
                  <>
                    <Select
                      {...form.getInputProps(`${kind}.${index}.degree`)}
                      key={form.key(`${kind}.${index}.degree`)}
                      label="Jenjang"
                      data={DEGREES}
                    />
                    <UniversityNameSelect
                      {...form.getInputProps(`${kind}.${index}.institution`)}
                      key={form.key(`${kind}.${index}.institution`)}
                      label="Institusi"
                      placeholder="Cari universitas"
                    />
                    <TextInput
                      {...form.getInputProps(`${kind}.${index}.faculty`)}
                      key={form.key(`${kind}.${index}.faculty`)}
                      label="Fakultas"
                    />
                    <TextInput
                      {...form.getInputProps(`${kind}.${index}.major`)}
                      key={form.key(`${kind}.${index}.major`)}
                      label="Jurusan"
                    />
                    <NumberInput
                      {...form.getInputProps(`${kind}.${index}.intake_year`)}
                      key={form.key(`${kind}.${index}.intake_year`)}
                      label="Tahun masuk"
                      min={1900}
                      max={new Date().getFullYear() + 10}
                    />
                  </>
                ) : (
                  <>
                    <TextInput
                      {...form.getInputProps(`${kind}.${index}.job_title`)}
                      key={form.key(`${kind}.${index}.job_title`)}
                      label="Posisi / jabatan"
                    />
                    <TextInput
                      {...form.getInputProps(`${kind}.${index}.company`)}
                      key={form.key(`${kind}.${index}.company`)}
                      label="Perusahaan / organisasi"
                    />
                    <NumberInput
                      {...form.getInputProps(`${kind}.${index}.start_year`)}
                      key={form.key(`${kind}.${index}.start_year`)}
                      label="Tahun mulai"
                      min={1900}
                      max={new Date().getFullYear() + 10}
                    />
                    <NumberInput
                      {...form.getInputProps(`${kind}.${index}.end_year`)}
                      key={form.key(`${kind}.${index}.end_year`)}
                      label="Tahun selesai"
                      description="Kosongkan jika masih aktif."
                      min={1900}
                      max={new Date().getFullYear() + 10}
                    />
                  </>
                )}
              </div>
              <Group justify="end">
                {editing === index && (
                  <Button variant="subtle" onClick={() => cancel(index)}>
                    Batal
                  </Button>
                )}
                <Button variant="light" onClick={() => finish(index)}>
                  Selesai
                </Button>
              </Group>
            </Stack>
          )}
        </Paper>
      ))}
      <Button
        variant="light"
        className={classes.addButton}
        disabled={editing !== null || invalidEditors.length > 0}
        leftSection={<IconPlus size={16} aria-hidden />}
        onClick={add}
      >
        Tambah {education ? "pendidikan" : "pekerjaan / aktivitas"}
      </Button>
    </Stack>
  );
}
