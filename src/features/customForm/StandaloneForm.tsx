"use client";
import { useRef, useState, type ReactElement } from "react";
import { Alert, Button, Group, Paper, Stack, Text, Title } from "@mantine/core";
import type { CustomForm } from "@/types/api/customForm";
import {
  FormUploadProvider,
  formErrorMessage,
  useFormUploads,
} from "./FormUploadContext";
import CustomFormFieldsRenderer from "./CustomFormFieldsRenderer";
import { useFormRoute } from "./use-form-route";
import CustomFormGuestSection from "./CustomFormGuestSection";
import type { Province } from "@/types/model/province";

function FormBody({
  form,
  provinces,
}: {
  form: CustomForm;
  provinces: Province[];
}): ReactElement {
  const uploads = useFormUploads()!;
  const schema = {
    ...form.form_schema,
    fields: form.form_schema.fields
      .filter(
        (section) =>
          section.fields.length || section.section_name !== "profile_data",
      )
      .map((section) =>
        section.section_name === "profile_data"
          ? { ...section, section_name: "Data diri" }
          : section,
      ),
  };
  const flow = useFormRoute(schema, null, false);
  const formRef = useRef<HTMLFormElement>(null);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");
  const [completed, setCompleted] = useState(false);
  const submit = async (values: Record<string, unknown>): Promise<void> => {
    if (uploads.pending || busy) return;
    const answers = flow.currentSection ? flow.advance(values) : {};
    if (!answers) return;
    setBusy(true);
    setFailure("");
    try {
      const token = await uploads.ensureSession();
      const response = await fetch(`/api/forms/${form.id}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_token: token, answers }),
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok)
        throw new Error(
          formErrorMessage(result.message ?? "Jawaban belum dapat dikirim."),
        );
      flow.clear();
      setCompleted(true);
    } catch (error) {
      setFailure(
        error instanceof Error ? error.message : "Jawaban belum dapat dikirim.",
      );
    } finally {
      setBusy(false);
    }
  };
  if (!form.is_active)
    return (
      <Alert title="Penerimaan respons ditutup">
        Formulir ini belum menerima jawaban. Hubungi pengelola jika Anda
        memerlukan bantuan.
      </Alert>
    );
  return (
    <Stack gap="lg">
      <Text size="sm" fw={600}>
        BMKA Salman • Formulir
      </Text>
      <Paper withBorder radius="md" p="xl">
        <Title order={1} size="h2">
          {form.form_name}
        </Title>
        {form.form_description && (
          <Text mt="md" style={{ whiteSpace: "pre-wrap" }}>
            {form.form_description}
          </Text>
        )}
      </Paper>
      {completed ? (
        <Paper withBorder radius="md" p="xl">
          <Title order={2} size="h3">
            Jawaban telah tersimpan
          </Title>
          <Text mt="sm">Terima kasih telah mengisi formulir ini.</Text>
          {form.post_submission_info && (
            <div
              style={{ marginTop: 16 }}
              dangerouslySetInnerHTML={{ __html: form.post_submission_info }}
            />
          )}
          <Button
            mt="lg"
            variant="default"
            onClick={() => window.location.reload()}
          >
            Kirim respons lain
          </Button>
        </Paper>
      ) : (
        <>
          {failure && (
            <Alert color="red" title="Jawaban belum terkirim">
              {failure}
            </Alert>
          )}
          {flow.notice && <Alert color="yellow">{flow.notice}</Alert>}
          {flow.configurationError ? (
            <Alert color="red">{flow.configurationError}</Alert>
          ) : (
            <Paper withBorder radius="md" p="xl">
              <Text size="sm" c="dimmed" mb="md">
                Langkah {flow.history.length + 1}
              </Text>
              {flow.currentSection &&
                (form.form_schema.fields.find(
                  (section) => section.id === flow.currentSection?.id,
                )?.section_name === "profile_data" ? (
                  <CustomFormGuestSection
                    key={flow.currentSection.id}
                    profileFields={flow.currentSection.fields}
                    provinceData={provinces}
                    requireGuestIdentity={false}
                    initialData={flow.answers}
                    onSubmit={(values) => void submit(values)}
                    loading={busy}
                    formRef={formRef}
                  />
                ) : (
                  <CustomFormFieldsRenderer
                    key={flow.currentSection.id}
                    section={flow.currentSection}
                    formData={flow.answers}
                    onChange={flow.updateAnswers}
                    onSubmit={(values) => void submit(values)}
                    loading={busy || uploads.pending > 0}
                    isLastSection={flow.isLast}
                    formRef={formRef}
                  />
                ))}
              <Group justify="space-between" mt="xl">
                <Button
                  variant="default"
                  disabled={!flow.history.length || busy || uploads.pending > 0}
                  onClick={flow.back}
                >
                  Kembali
                </Button>
                <Button
                  loading={busy}
                  disabled={uploads.pending > 0}
                  onClick={() =>
                    flow.currentSection
                      ? formRef.current?.requestSubmit()
                      : void submit({})
                  }
                >
                  {flow.isLast || !flow.currentSection
                    ? "Kirim jawaban"
                    : "Lanjutkan"}
                </Button>
              </Group>
              {uploads.pending > 0 && (
                <Text role="status" mt="sm">
                  Tunggu hingga berkas selesai diproses.
                </Text>
              )}
            </Paper>
          )}
        </>
      )}
    </Stack>
  );
}
export default function StandaloneForm({
  form,
  provinces,
}: {
  form: CustomForm;
  provinces: Province[];
}): ReactElement {
  return (
    <FormUploadProvider formId={form.id} schemaHash={form.schema_hash}>
      <FormBody form={form} provinces={provinces} />
    </FormUploadProvider>
  );
}
