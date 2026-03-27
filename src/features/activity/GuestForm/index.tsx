"use client";

import showNotif from "@/functions/common/notification";
import { postGuestActivity } from "@/services/activity";
import { Questionnaire } from "@/types/model/activity";
import {
  Button,
  Divider,
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

type GuestFormProps = {
  formSchemas: Questionnaire[];
  slug: string;
};

export default function GuestForm({ slug, formSchemas }: GuestFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      email: "",
      whatsapp: "",
    },
  });

  const questionnaireForm = useForm({
    mode: "uncontrolled",
    initialValues: {},
  });

  const renderQuestionField = (
    schema: Questionnaire,
    form: UseFormReturnType<Record<string, unknown>>,
  ) => {
    switch (schema.type) {
      case "text":
        return (
          <TextInput
            key={questionnaireForm.key(schema.name)}
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
            key={questionnaireForm.key(schema.name)}
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
            key={questionnaireForm.key(schema.name)}
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
            key={questionnaireForm.key(schema.name)}
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
        return null;
    }
  };

  const handleSubmit = async (guestData: {
    name: string;
    email: string;
    whatsapp: string;
  }) => {
    try {
      setLoading(true);
      const questionnaireAnswer = questionnaireForm.getValues();
      const resp = await postGuestActivity({
        slug,
        data: {
          guest_data: {
            name: guestData.name,
            email: guestData.email,
            whatsapp: guestData.whatsapp || undefined,
          },
          questionnaire_answer: questionnaireAnswer,
        },
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
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="lg">
        <Title order={3}>Data Diri</Title>
        <TextInput
          {...form.getInputProps("name")}
          key={form.key("name")}
          label="Nama Lengkap"
          placeholder="Nama Lengkap"
          required
        />
        <TextInput
          {...form.getInputProps("email")}
          key={form.key("email")}
          label="Email"
          placeholder="email@contoh.com"
          type="email"
          required
        />
        <TextInput
          {...form.getInputProps("whatsapp")}
          key={form.key("whatsapp")}
          label="Nomor WhatsApp"
          description="Cth: 6281234567890"
          placeholder="6281234567890"
          type="tel"
          inputMode="numeric"
        />

        {formSchemas.length > 0 && (
          <>
            <Divider />
            <Title order={3}>Formulir Pendaftaran</Title>
            {formSchemas.map((item) =>
              renderQuestionField(
                item,
                questionnaireForm as UseFormReturnType<Record<string, unknown>>,
              ),
            )}
          </>
        )}

        <Group>
          <Link
            href={`/activity/${slug}`}
            style={{ flex: 1, textDecoration: "none" }}
          >
            <Button flex="1" fullWidth variant="default">
              Kembali
            </Button>
          </Link>
          <Button type="submit" flex="1" loading={loading}>
            Daftar
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
