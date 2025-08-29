"use client";

import showNotif from "@/functions/common/notification";
import { registerWithCustomForm } from "@/services/customForm";
import { CustomForm, CustomFormField } from "@/types/api/customForm";
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

type CustomFieldsFormProps = {
  token: string;
  customForm: CustomForm;
  featureType: 'activity_registration' | 'club_registration';
  featureId: number;
};

export default function CustomFieldsForm({
  token,
  customForm,
  featureType,
  featureId,
}: CustomFieldsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const localStorageKey = `custom-form-${featureType}-${featureId}`;

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

  const renderField = (
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
      case "email":
      case "url":
        return (
          <TextInput
            key={form.key(field.key)}
            {...inputProps}
            name={field.key}
            label={field.label}
            placeholder={field.placeholder || field.label}
            description={field.description}
            required={field.required}
            disabled={field.disabled}
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
            disabled={field.disabled}
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
            min={field.validation?.min}
            max={field.validation?.max}
            disabled={field.disabled}
          />
        );

      case "dropdown":
      case "select":
        return (
          <Select
            key={form.key(field.key)}
            {...inputProps}
            name={field.key}
            label={field.label}
            placeholder={field.placeholder || field.label}
            description={field.description}
            required={field.required}
            data={field.options?.map((option) => ({
              label: option.label,
              value: option.value?.toString() || "",
              disabled: option.disabled,
            })) || []}
            searchable
            disabled={field.disabled}
          />
        );

      default:
        return (
          <TextInput
            key={form.key(field.key)}
            {...inputProps}
            name={field.key}
            label={field.label}
            placeholder={field.placeholder || field.label}
            description={field.description}
            required={field.required}
            disabled={field.disabled}
          />
        );
    }
  };

  const handleCustomFormSubmit = async (val: Record<string, any>) => {
    try {
      setLoading(true);
      const resp = await registerWithCustomForm(token, {
        feature_type: featureType,
        feature_id: featureId,
        profile_data: {}, // Profile data is handled in step 1
        custom_form_data: val,
      });
      if (resp) {
        // Clear saved form data on successful submission
        localStorage.removeItem(localStorageKey);
        showNotif(resp.message);
        router.push(`/custom-form/register/${featureType}/${featureId}/finish-form`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) showNotif(error.message, true);
      if (typeof error === "string") showNotif(error, true);
    } finally {
      setLoading(false);
    }
  };

  // Find the custom_form section
  const customFormSection = customForm.form_schema.fields.find(
    (section) => section.section_name === "custom_form"
  );

  if (!customFormSection) {
    return (
      <Stack gap="lg">
        <Title order={4}></Title>
        <p>Tidak ada field custom yang perlu diisi.</p>
        <Group>
          <Button
            component={Link}
            flex="1"
            href={`/custom-form/register/${featureType}/${featureId}/profile-data`}
          >
            Sebelumnya
          </Button>
          <Button type="submit" flex="1" loading={loading}>
            Selanjutnya
          </Button>
        </Group>
      </Stack>
    );
  }

  return (
    <form onSubmit={form.onSubmit(handleCustomFormSubmit)}>
      <Stack gap="lg">
        <Title order={4}>Formulir Tambahan</Title>
        {customFormSection.fields.map((field) => renderField(field, form))}

        <Group>
          <Button
            component={Link}
            flex="1"
            href={`/custom-form/register/${featureType}/${featureId}/profile-data`}
          >
            Sebelumnya
          </Button>
          <Button type="submit" flex="1" loading={loading}>
            Selanjutnya
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
