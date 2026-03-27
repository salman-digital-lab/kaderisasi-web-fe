"use client";

import { useState, type RefObject } from "react";
import {
  Button,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Select,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import type { CustomFormField } from "@/types/api/customForm";
import type { Province } from "@/types/model/province";
import { GENDER_OPTION } from "@/constants/form/profile";
import UniversitySelect from "@/components/common/UniversitySelect";
import { toISODateString } from "@/utils/dateUtils";

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
    initialValues[field.key] = resolveInitialValue(field.key, field.defaultValue as unknown);
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

        if (field.required && !val) {
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
    const inputProps = {
      ...form.getInputProps(field.key),
      key: form.key(field.key),
      label: field.label,
      placeholder: field.placeholder ?? field.label,
      description: field.helpText,
      required: field.required,
      disabled: field.disabled,
    };

    switch (field.key) {
      case "email":
        return <TextInput {...inputProps} type="email" required />;

      case "gender":
        return <Select {...inputProps} data={GENDER_OPTION} />;

      case "province_id":
        return (
          <Select
            {...inputProps}
            data={
              provinceData?.map((p) => ({
                label: p.name,
                value: p.id.toString(),
              })) ?? []
            }
            searchable
          />
        );

      case "university_id":
        return <UniversitySelect {...inputProps} allowDeselect={false} />;

      case "whatsapp":
        return (
          <TextInput
            {...inputProps}
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
        return <DateInput {...inputProps} valueFormat="YYYY-MM-DD" />;

      default:
        return <TextInput {...inputProps} />;
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
        <Stack gap="md">
          <Title order={4}>Data Diri</Title>

          {!hasNameField && (
            <TextInput
              {...form.getInputProps("name")}
              key={form.key("name")}
              label="Nama Lengkap"
              placeholder="Nama Lengkap"
              required
            />
          )}

          {!hasEmailField && (
            <TextInput
              {...form.getInputProps("email")}
              key={form.key("email")}
              label="Email"
              placeholder="email@contoh.com"
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
          <Text>
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
