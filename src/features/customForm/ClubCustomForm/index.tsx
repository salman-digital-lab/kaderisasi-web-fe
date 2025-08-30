"use client";

import showNotif from "@/functions/common/notification";
import { registerWithCustomForm } from "@/services/customForm";
import { CustomFormSchema, CustomFormField } from "@/types/api/customForm";
import {
  Button,
  Group,
  NumberInput,
  Select,
  Stack,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, UseFormReturnType } from "@mantine/form";
import { useDebouncedCallback } from "@mantine/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ClubCustomFormProps = {
  token: string;
  clubId: string;
  formId: string;
  formSchema: CustomFormSchema;
};

export default function ClubCustomForm({
  token,
  clubId,
  formId,
  formSchema,
}: ClubCustomFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const localStorageKey = `club-form-${clubId}-${formId}`;

  // Initialize form with previous values from localStorage if they exist
  const form = useForm({
    mode: "uncontrolled",
    initialValues: getSavedFormValues(),
  });

  // Function to get saved form values from localStorage
  function getSavedFormValues() {
    if (typeof window !== "undefined") {
      const savedValues = localStorage.getItem(localStorageKey);
      if (savedValues) {
        try {
          return JSON.parse(savedValues);
        } catch (e) {
          console.error("Error parsing saved form values:", e);
        }
      }
    }
    return {};
  }

  const handleSyncLocalStorage = useDebouncedCallback(async () => {
    setTimeout(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem(localStorageKey, JSON.stringify(form.getValues()));
      }
    }, 50);
  }, 500);

  // Render form fields based on schema
  const renderForm = (
    field: CustomFormField,
    form: UseFormReturnType<Record<string, unknown>>,
  ) => {
    const inputProps = {
      ...form.getInputProps(field.key),
      onChange: (value: any) => {
        form.getInputProps(field.key).onChange(value);
        handleSyncLocalStorage();
      },
    };

    switch (field.type) {
      case "text":
        return (
          <TextInput
            key={form.key(field.key)}
            {...inputProps}
            name={field.key}
            label={field.label}
            placeholder={field.placeholder || field.label}
            description={field.description}
            required={field.required}
          />
        );

      case "textarea":
        return (
          <Textarea
            key={form.key(field.key)}
            {...inputProps}
            name={field.key}
            label={field.label}
            placeholder={field.placeholder || field.label}
            description={field.description}
            required={field.required}
            resize="vertical"
          />
        );

      case "number":
        return (
          <NumberInput
            key={form.key(field.key)}
            {...inputProps}
            name={field.key}
            label={field.label}
            placeholder={field.placeholder || field.label}
            description={field.description}
            required={field.required}
          />
        );

      case "dropdown":
        return (
          <Select
            key={form.key(field.key)}
            {...inputProps}
            name={field.key}
            label={field.label}
            placeholder={field.placeholder || field.label}
            description={field.description}
            required={field.required}
            data={field.options?.map(option => ({
              value: option.value?.toString() || '',
              label: option.label,
              disabled: option.disabled
            })) || []}
            searchable
          />
        );

      default:
        return null;
    }
  };

  const handleClubRegister = async (val: Record<string, any>) => {
    try {
      setLoading(true);
      const resp = await registerWithCustomForm(token, {
        feature_type: 'club_registration',
        feature_id: parseInt(clubId),
        profile_data: {}, // Will be filled from previous step
        custom_form_data: val,
      });

      if (resp) {
        // Clear saved form data on successful submission
        localStorage.removeItem(localStorageKey);
        showNotif("Pendaftaran berhasil!");
        router.push(`/custom-form/register/club/${clubId}/${formId}/finish-form`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) showNotif(error.message, true);
      if (typeof error === "string") showNotif(error, true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleClubRegister)}>
      <Stack gap="lg">
        <Title order={3}>Formulir Pendaftaran Klub</Title>

        {formSchema && formSchema.fields && formSchema.fields.length > 0 ? (
          formSchema.fields.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {section.section_name && (
                <Title order={4} mb="md">{section.section_name}</Title>
              )}
              <Stack gap="md">
                {section.fields.map((field) => renderForm(field, form))}
              </Stack>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Title order={4} c="dimmed">Tidak ada formulir tambahan</Title>
            <p style={{ color: 'var(--mantine-color-dimmed)' }}>
              Formulir pendaftaran telah selesai. Klik tombol &ldquo;Selesai&rdquo; untuk melanjutkan.
            </p>
          </div>
        )}

        <Group>
          <Button
            component={Link}
            flex="1"
            href={`/custom-form/register/club/${clubId}/${formId}/profile-data`}
          >
            Sebelumnya
          </Button>
          <Button type="submit" flex="1" loading={loading}>
            Selesai
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
