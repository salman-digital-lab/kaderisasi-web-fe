"use client";

import showNotif from "@/functions/common/notification";
import { postActivity, putActivity } from "@/services/activity";
import { Questionnaire, Registrant } from "@/types/model/activity";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ActivityFormUpdateProps = {
  token: string;
  formSchemas: Questionnaire[];
  slug: string;
  registrationData: Registrant;
};

const renderForm = (
  schema: Questionnaire,
  form: UseFormReturnType<Record<string, string>>,
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

    case "textarea":
      return (
        <Textarea
          key={form.key(schema.name)}
          {...form.getInputProps(schema.name)}
          name={schema.name}
          label={schema.label}
          placeholder={schema.label}
          required={schema.required}
          resize="vertical"
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

export default function ActivityFormUpdate({
  token,
  slug,
  formSchemas,
  registrationData,
}: ActivityFormUpdateProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: registrationData.questionnaire_answer,
  });

  const handleActivityRegister = async (val: Record<string, any>) => {
    try {
      setLoading(true);
      const resp = await putActivity(token, {
        slug,
        data: { questionnaire_answer: val },
      });
      if (resp) {
        showNotif(resp.message);
        router.push(`/profile?tab=activity`);
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
        <Title order={3}>Ubah Form Pendaftaran Kegiatan </Title>
        {formSchemas?.map((item) => renderForm(item, form))}
        <Group>
          <Link href="/profile?tab=activity" style={{ flex: 1, textDecoration: 'none' }}>
            <Button flex="1" fullWidth>
              Kembali
            </Button>
          </Link>
          <Button type="submit" flex="1" loading={loading}>
            Ubah Formulir
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
