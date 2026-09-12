"use client";

import { useState, useRef, useEffect } from "react";
import {
  Stack,
  Title,
  Text,
  Stepper,
  Button,
  Paper,
  Group,
  Alert,
} from "@mantine/core";
import { useFormRoute } from "../use-form-route";
import { customSections } from "../form-routing";
import type { CustomForm } from "@/types/api/customForm";
import type { Registrant } from "@/types/model/activity";
import CustomFormFieldsRenderer from "../CustomFormFieldsRenderer";
import showNotif from "@/functions/common/notification";
import updateActivityCustomForm from "@/functions/server/updateActivityCustomForm";
import { useRouter } from "next/navigation";

type CustomFormContentEditProps = {
  customForm: CustomForm;
  registrationData: Pick<Registrant, "questionnaire_answer">;
  slug: string;
};

const paperProps = {
  radius: "md" as const,
  withBorder: true,
  p: { base: "md", sm: "xl" } as const,
};

export default function CustomFormContentEdit({
  customForm,
  registrationData,
  slug,
}: CustomFormContentEditProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const flow = useFormRoute(
    customForm.form_schema,
    null,
    false,
    registrationData.questionnaire_answer || {},
  );
  const accumulatedData = flow.answers;
  const currentStep = flow.history.length;
  const customFormSections = customSections(customForm.form_schema);
  const totalSteps = customFormSections.length;
  const isLastSection = flow.isLast;
  const currentSection = flow.currentSection;
  useEffect(() => {
    formRef.current
      ?.querySelector<HTMLElement>("[data-form-section-title]")
      ?.focus();
  }, [flow.currentId]);

  if (flow.configurationError)
    return (
      <Alert color="red" title="Formulir tidak tersedia">
        {flow.configurationError}
      </Alert>
    );

  if (totalSteps === 0) {
    return (
      <Stack gap="md">
        <Paper {...paperProps}>
          <Title order={3} mb="xs">
            {customForm.form_name}
          </Title>
          <Text size="md" c="dimmed">
            Tidak ada formulir tambahan untuk diubah.
          </Text>
        </Paper>
      </Stack>
    );
  }

  if (!currentSection) return null;

  const handleSectionSubmit = async (data: Record<string, any>) => {
    const allFormData = flow.advance(data);
    if (!allFormData) return;

    try {
      setLoading(true);
      const response = await updateActivityCustomForm(slug, allFormData);
      if (!response.success) {
        showNotif(response.message, true);
        return;
      }
      showNotif(response.message);
      router.push(`/profile?tab=activity`);
    } catch {
      showNotif("Terjadi kesalahan jaringan. Silakan coba lagi.", true);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 0) router.push(`/profile?tab=activity`);
    else flow.back();
  };

  return (
    <Stack gap="md">
      {/* Header card */}
      <Paper {...paperProps}>
        <Title order={3} mb="xs">
          Ubah Formulir: {customForm.form_name}
        </Title>
        {totalSteps > 1 && (
          <>
            <Text size="md" c="dimmed" hiddenFrom="sm" mt="md">
              Langkah {currentStep + 1}: {currentSection.section_name}
            </Text>
            <Stepper
              active={currentStep}
              size="md"
              mt="lg"
              iconSize={32}
              visibleFrom="sm"
            >
              {customFormSections
                .filter(
                  (section) =>
                    flow.history.includes(section.id) ||
                    currentSection.id === section.id,
                )
                .map((section, idx) => (
                  <Stepper.Step
                    allowStepClick={false}
                    key={idx}
                    label={section.section_name}
                    description={`Bagian ${idx + 1}`}
                  />
                ))}
            </Stepper>
          </>
        )}
      </Paper>

      {/* Form card */}
      <Paper {...paperProps}>
        <CustomFormFieldsRenderer
          key={currentSection.id}
          formRef={formRef}
          section={currentSection}
          formData={accumulatedData}
          onSubmit={handleSectionSubmit}
          onChange={flow.updateAnswers}
          loading={loading}
          isLastSection={isLastSection}
        />
      </Paper>

      {/* Navigation buttons */}
      <Group justify="space-between">
        <Button
          type="button"
          variant="default"
          onClick={handleBack}
          disabled={loading}
          style={{ flex: "0 1 auto", minWidth: "100px" }}
        >
          Kembali
        </Button>
        <Button
          type="button"
          loading={loading}
          onClick={() => formRef.current?.requestSubmit()}
          style={{ flex: "1 1 auto", minWidth: "120px" }}
        >
          {isLastSection ? "Simpan" : "Lanjutkan"}
        </Button>
      </Group>
    </Stack>
  );
}
