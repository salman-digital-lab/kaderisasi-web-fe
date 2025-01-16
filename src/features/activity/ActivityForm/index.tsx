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
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, UseFormReturnType } from "@mantine/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ActivityFormProps = {
  token: string;
  formSchemas: Questionnaire[];
  slug: string;
};

const renderForm = (
  schema: Questionnaire,
  form: UseFormReturnType<Record<string, unknown>>,
) => {
  switch (schema.type) {
    case "text":
      return (
        <TextInput
          key={form.key(schema.name)}
          {...form.getInputProps(schema.name)}
          name={schema.name}
          label={schema.label}
          placeholder={schema.label}
          required={schema.required}
        />
      );

    case "number":
      return (
        <NumberInput
          key={form.key(schema.name)}
          {...form.getInputProps(schema.name)}
          name={schema.name}
          label={schema.label}
          placeholder={schema.label}
          required={schema.required}
        />
      );

    case "dropdown":
      return (
        <Select
          key={form.key(schema.name)}
          {...form.getInputProps(schema.name)}
          name={schema.name}
          label={schema.label}
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

export default function ActivityForm({
  token,
  slug,
  formSchemas,
}: ActivityFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
  });

  const handleActivityRegister = async (val: Record<string, any>) => {
    try {
      setLoading(true);
      const resp = await postActivity(token, {
        slug,
        data: { questionnaire_answer: val },
      });
      if (resp) {
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
        <Title order={3}>Form Data Diri </Title>
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
