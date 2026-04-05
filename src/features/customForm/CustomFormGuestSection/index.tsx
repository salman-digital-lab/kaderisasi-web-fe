"use client";

import { useState, type RefObject } from "react";
import {
  ActionIcon,
  Button,
  Group,
  Modal,
  NumberInput,
  Paper,
  Stack,
  Text,
  TextInput,
  Select,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import type { CustomFormField } from "@/types/api/customForm";
import type { EducationEntry } from "@/types/model/members";
import type { Province } from "@/types/model/province";
import { GENDER_OPTION } from "@/constants/form/profile";
import { toISODateString } from "@/utils/dateUtils";
import UniversityNameSelect from "@/components/common/UniversityNameSelect";

const DEGREE_OPTIONS = [
  { value: "bachelor", label: "S1 (Sarjana)" },
  { value: "master", label: "S2 (Magister)" },
  { value: "doctoral", label: "S3 (Doktor)" },
];

type FormValues = Record<string, unknown>;

type CustomFormGuestSectionProps = {
  profileFields: CustomFormField[];
  provinceData?: Province[];
  onSubmit: (data: FormValues) => void;
  loading?: boolean;
  isSingleSection?: boolean;
  initialData?: FormValues;
  formRef?: RefObject<HTMLFormElement | null>;
};

export default function CustomFormGuestSection({
  profileFields,
  provinceData,
  onSubmit,
  loading = false,
  isSingleSection = false,
  initialData = {},
  formRef,
}: CustomFormGuestSectionProps) {
  const [confirmModalOpened, setConfirmModalOpened] = useState(false);
  const [pendingValues, setPendingValues] = useState<FormValues | null>(null);

  const hasNameField = profileFields.some((f) => f.key === "name");
  const hasEmailField = profileFields.some((f) => f.key === "email");

  const resolveInitialValue = (key: string, fallback: unknown): unknown => {
    const stored = initialData[key];
    if (stored === undefined || stored === null || stored === "") return fallback ?? "";
    // DateInput requires a Date object; stored value is an ISO string after processValues
    if (key === "birth_date" && typeof stored === "string") {
      const parsed = new Date(stored);
      return isNaN(parsed.getTime()) ? (fallback ?? "") : parsed;
    }
    return stored;
  };

  const initialValues: FormValues = {};
  profileFields.forEach((field) => {
    if (field.key === "education_history") {
      const stored = initialData["education_history"];
      initialValues[field.key] = Array.isArray(stored) ? stored : [];
    } else if (field.key === "current_education") {
      const stored = initialData["current_education"];
      initialValues[field.key] = stored && typeof stored === "object"
        ? stored
        : { degree: "bachelor", institution: "", major: "", intake_year: new Date().getFullYear() };
    } else {
      initialValues[field.key] = resolveInitialValue(field.key, field.defaultValue as unknown);
    }
  });
  if (!hasNameField) initialValues["name"] = resolveInitialValue("name", "");
  if (!hasEmailField) initialValues["email"] = resolveInitialValue("email", "");

  const form = useForm<FormValues>({
    mode: "uncontrolled",
    initialValues,
    validate: (values) => {
      const errors: Record<string, string> = {};
      const name = values["name"];
      const email = values["email"];

      if (!String(name ?? "").trim()) {
        errors["name"] = "Nama wajib diisi";
      }
      if (!String(email ?? "").trim()) {
        errors["email"] = "Email wajib diisi";
      } else if (!/^\S+@\S+\.\S+$/.test(String(email))) {
        errors["email"] = "Format email tidak valid";
      }

      profileFields.forEach((field) => {
        if (field.key === "name" || field.key === "email") return;

        const val = values[field.key];

        const isEmpty =
          field.key === "education_history"
            ? !Array.isArray(val) || (val as unknown[]).length === 0
            : field.key === "current_education"
            ? !(val as any)?.institution
            : !val;
        if (field.required && isEmpty) {
          errors[field.key] = `${field.label} wajib diisi`;
          return;
        }

        const { validation } = field;
        if (!validation || !val) return;
        const str = String(val);

        if (validation.minLength && str.length < validation.minLength) {
          errors[field.key] =
            validation.customMessage ?? `Minimal ${validation.minLength} karakter`;
        } else if (validation.maxLength && str.length > validation.maxLength) {
          errors[field.key] =
            validation.customMessage ?? `Maksimal ${validation.maxLength} karakter`;
        } else if (validation.pattern && !new RegExp(validation.pattern).test(str)) {
          errors[field.key] =
            validation.customMessage ?? `Format ${field.label} tidak valid`;
        }
      });

      return errors;
    },
  });

  const renderField = (field: CustomFormField) => {
    const fieldKey = form.key(field.key);
    const inputProps = {
      ...form.getInputProps(field.key),
      label: field.label,
      description: field.helpText,
      required: field.required,
      disabled: field.disabled,
      size: "md" as const,
    };

    switch (field.key) {
      case "email":
        return (
          <TextInput
            key={fieldKey}
            {...inputProps}
            placeholder="Isi di sini"
            type="email"
            required
          />
        );

      case "gender":
        return (
          <Select
            key={fieldKey}
            {...inputProps}
            placeholder="Pilih opsi"
            data={GENDER_OPTION}
          />
        );

      case "province_id":
        return (
          <Select
            key={fieldKey}
            {...inputProps}
            placeholder="Pilih opsi"
            data={
              provinceData?.map((p) => ({
                label: p.name,
                value: p.id.toString(),
              })) ?? []
            }
            searchable
          />
        );

      case "whatsapp":
        return (
          <TextInput
            key={fieldKey}
            {...inputProps}
            placeholder="Isi di sini"
            type="tel"
            inputMode="numeric"
            onKeyDown={(e) => {
              const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
              if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) {
                e.preventDefault();
              }
            }}
          />
        );

      case "birth_date":
        return (
          <DateInput
            key={fieldKey}
            {...inputProps}
            placeholder="Isi di sini"
            valueFormat="YYYY-MM-DD"
          />
        );

      case "education_history": {
        const entries = (form.getValues().education_history as EducationEntry[]) ?? [];
        const educationError = form.errors["education_history"];
        return (
          <Stack key={fieldKey} gap="xs">
            <Text fw={500} size="md">
              {field.label}
              {field.required && <span style={{ color: "red" }}> *</span>}
            </Text>
            {field.helpText && (
              <Text size="sm" c="dimmed">
                {field.helpText}
              </Text>
            )}
            {educationError && (
              <Text size="md" c="red">
                {educationError}
              </Text>
            )}
            {entries.map((_, index) => (
              <Paper key={index} withBorder p="sm" radius="md">
                <Group justify="space-between" mb="xs">
                  <Text size="md" fw={500}>
                    Pendidikan {index + 1}
                  </Text>
                  <ActionIcon
                    color="red"
                    variant="subtle"
                    size="sm"
                    onClick={() => form.removeListItem("education_history", index)}
                  >
                    ×
                  </ActionIcon>
                </Group>
                <Select
                  {...form.getInputProps(`education_history.${index}.degree`)}
                  key={form.key(`education_history.${index}.degree`)}
                  label="Jenjang"
                  data={DEGREE_OPTIONS}
                  radius="md"
                />
                <UniversityNameSelect
                  {...form.getInputProps(`education_history.${index}.institution`)}
                  key={form.key(`education_history.${index}.institution`)}
                  label="Institusi"
                  placeholder="Cari universitas"
                  mt="xs"
                  radius="md"
                />
                <TextInput
                  {...form.getInputProps(`education_history.${index}.major`)}
                  key={form.key(`education_history.${index}.major`)}
                  label="Jurusan"
                  placeholder="Jurusan"
                  mt="xs"
                  radius="md"
                />
                <NumberInput
                  {...form.getInputProps(`education_history.${index}.intake_year`)}
                  key={form.key(`education_history.${index}.intake_year`)}
                  label="Tahun Masuk"
                  placeholder="Tahun masuk"
                  mt="xs"
                  radius="md"
                />
              </Paper>
            ))}
            <Button
              variant="light"
              size="md"
              mt="xs"
              onClick={() =>
                form.insertListItem("education_history", {
                  degree: "bachelor",
                  institution: "",
                  major: "",
                  intake_year: new Date().getFullYear(),
                })
              }
            >
              + Tambah Pendidikan
            </Button>
          </Stack>
        );
      }

      case "current_education": {
        const ceError = form.errors["current_education"];
        return (
          <Stack key={fieldKey} gap="xs">
            <Text fw={500} size="md">
              {field.label}
              {field.required && <span style={{ color: "red" }}> *</span>}
            </Text>
            {field.helpText && (
              <Text size="sm" c="dimmed">
                {field.helpText}
              </Text>
            )}
            {ceError && (
              <Text size="md" c="red">
                {ceError}
              </Text>
            )}
            <Paper withBorder p="sm" radius="md">
              <Select
                {...form.getInputProps("current_education.degree")}
                key={form.key("current_education.degree")}
                label="Jenjang"
                data={DEGREE_OPTIONS}
                radius="md"
              />
              <UniversityNameSelect
                {...form.getInputProps("current_education.institution")}
                key={form.key("current_education.institution")}
                label="Institusi"
                placeholder="Cari universitas"
                mt="xs"
                radius="md"
              />
              <TextInput
                {...form.getInputProps("current_education.major")}
                key={form.key("current_education.major")}
                label="Jurusan"
                placeholder="Jurusan"
                mt="xs"
                radius="md"
              />
              <NumberInput
                {...form.getInputProps("current_education.intake_year")}
                key={form.key("current_education.intake_year")}
                label="Tahun Masuk"
                placeholder="Tahun masuk"
                mt="xs"
                radius="md"
              />
            </Paper>
          </Stack>
        );
      }

      default:
        return <TextInput key={fieldKey} {...inputProps} placeholder="Isi di sini" />;
    }
  };

  const processValues = (values: FormValues): FormValues => {
    const processed: FormValues = {};

    profileFields.forEach((field) => {
      processed[field.key] =
        field.key === "birth_date" && values[field.key]
          ? toISODateString(values[field.key] as Parameters<typeof toISODateString>[0])
          : values[field.key];
    });

    // Carry name/email even when not part of the schema fields
    if (!hasNameField) processed["name"] = values["name"];
    if (!hasEmailField) processed["email"] = values["email"];

    return processed;
  };

  const handleFormSubmit = (values: FormValues) => {
    const processed = processValues(values);
    if (isSingleSection) {
      setPendingValues(processed);
      setConfirmModalOpened(true);
    } else {
      onSubmit(processed);
    }
  };

  return (
    <>
      <form ref={formRef} onSubmit={form.onSubmit(handleFormSubmit)}>
        <Stack gap="xl">
          <Title order={4}>Data Diri</Title>

          {!hasNameField && (
            <TextInput
              {...form.getInputProps("name")}
              key={form.key("name")}
              label="Nama Lengkap"
              placeholder="Isi di sini"
              required
            />
          )}

          {!hasEmailField && (
            <TextInput
              {...form.getInputProps("email")}
              key={form.key("email")}
              label="Email"
              placeholder="Isi di sini"
              type="email"
              required
            />
          )}

          {profileFields
            .filter((f) => !f.hidden)
            .map((field) => renderField(field))}
        </Stack>
      </form>

      <Modal
        opened={confirmModalOpened}
        onClose={() => setConfirmModalOpened(false)}
        title="Konfirmasi Pengiriman"
        centered
      >
        <Stack gap="md">
          <Text size="md">
            Apakah Anda yakin ingin mengirim formulir ini? Pastikan semua data
            yang Anda masukkan sudah benar.
          </Text>
          <Group justify="flex-end" mt="md">
            <Button
              variant="default"
              onClick={() => setConfirmModalOpened(false)}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              loading={loading}
              onClick={() => {
                setConfirmModalOpened(false);
                if (pendingValues) onSubmit(pendingValues);
              }}
            >
              Ya, Kirim
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
