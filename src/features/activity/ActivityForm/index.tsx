"use client";

import showNotif from "@/functions/common/notification";
import { postActivity } from "@/services/activity";
import { Questionnaire } from "@/types/model/activity";
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

type ActivityFormProps = {
  token: string;
  formSchemas: Questionnaire[];
  slug: string;
};

export default function ActivityForm({
  token,
  slug,
  formSchemas,
}: ActivityFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const localStorageKey = `activity-form-${slug}`;

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

  // Helper function to render labels with newlines
  const renderLabel = (label: string) => {
    const lines = label.split('\n');
    if (lines.length === 1) return label;
    
    return (
      <>
        {lines.map((line, index) => (
          <span key={index}>
            {line}
            {index < lines.length - 1 && <br />}
          </span>
        ))}
      </>
    );
  };

  // Moved renderForm inside the component to access localStorageKey
  const renderForm = (
    schema: Questionnaire,
    form: UseFormReturnType<Record<string, unknown>>,
  ) => {
    const inputProps = {
      ...form.getInputProps(schema.name),
      onChange: (value: any) => {
        form.getInputProps(schema.name).onChange(value);
        handleSyncLocalStorage();
      },
    };

    switch (schema.type) {
      case "text":
        return (
          <TextInput
            key={form.key(schema.name)}
            {...inputProps}
            name={schema.name}
            label={renderLabel(schema.label)}
            placeholder={schema.label}
            required={schema.required}
          />
        );

      case "textarea":
        return (
          <Textarea
            key={form.key(schema.name)}
            {...inputProps}
            name={schema.name}
            label={renderLabel(schema.label)}
            placeholder={schema.label}
            required={schema.required}
            resize="vertical"
          />
        );

      case "number":
        return (
          <NumberInput
            key={form.key(schema.name)}
            {...inputProps}
            name={schema.name}
            label={renderLabel(schema.label)}
            placeholder={schema.label}
            required={schema.required}
          />
        );

      case "dropdown":
        return (
          <Select
            key={form.key(schema.name)}
            {...inputProps}
            name={schema.name}
            label={renderLabel(schema.label)}
            placeholder={schema.label}
            required={schema.required}
            data={schema.data}
            searchable
          />
        );

      default:
        break;
    }
  };

  const handleActivityRegister = async (val: Record<string, any>) => {
    try {
      setLoading(true);
      const resp = await postActivity(token, {
        slug,
        data: { questionnaire_answer: val },
      });
      if (resp) {
        // Clear saved form data on successful submission
        localStorage.removeItem(localStorageKey);
        showNotif(resp.message);
        router.push(`/activity/register/${slug}/finish-form`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) showNotif(error.message, true);
      if (typeof error === "string") showNotif(error, true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleActivityRegister)}>
      <Stack gap="lg">
        <Title order={3}>Form Pendaftaran Kegiatan </Title>
        {formSchemas?.map((item) => renderForm(item, form))}
        <Group>
          <Button
            component={Link}
            flex="1"
            href={`/activity/register/${slug}/profile-data`}
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
