"use client";

import { useState, useRef } from "react";
import { Stack, Title, Text, Stepper, Button, Paper, Group } from "@mantine/core";
import type { CustomForm } from "@/types/api/customForm";
import type { Registrant } from "@/types/model/activity";
import CustomFormFieldsRenderer from "../CustomFormFieldsRenderer";
import showNotif from "@/functions/common/notification";
import updateActivityCustomForm from "@/functions/server/updateActivityCustomForm";
import { useRouter } from "next/navigation";

type CustomFormContentEditProps = {
  customForm: CustomForm;
  registrationData: Registrant;
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
  const [currentStep, setCurrentStep] = useState(0);
  const [accumulatedData, setAccumulatedData] = useState<Record<string, any>>(
    registrationData.questionnaire_answer || {},
  );

  const customFormSections = customForm.form_schema.fields.slice(1);
  const totalSteps = customFormSections.length;
  const isLastSection = currentStep === totalSteps - 1;
  const currentSection = customFormSections[currentStep];

  if (totalSteps === 0) {
    return (
      <Stack gap="md">
        <Paper {...paperProps}>
          <Title order={3} mb="xs">{customForm.form_name}</Title>
          <Text size="sm" c="dimmed">Tidak ada formulir tambahan untuk diubah.</Text>
        </Paper>
      </Stack>
    );
  }

  if (!currentSection) return null;

  const handleSectionSubmit = async (data: Record<string, any>) => {
    const allFormData = { ...accumulatedData, ...data };
    setAccumulatedData(allFormData);

    if (!isLastSection) {
      setCurrentStep(currentStep + 1);
      return;
    }

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
    else setCurrentStep(currentStep - 1);
  };

  return (
    <Stack gap="md">
      {/* Header card */}
      <Paper {...paperProps}>
        <Title order={3} mb="xs">Ubah Formulir — {customForm.form_name}</Title>
        {totalSteps > 1 && (
          <>
            <Text size="sm" c="dimmed" hiddenFrom="sm" mt="md">
              Langkah {currentStep + 1} dari {totalSteps}: {currentSection.section_name}
            </Text>
            <Stepper active={currentStep} size="sm" mt="lg" iconSize={32} visibleFrom="sm">
              {customFormSections.map((section, idx) => (
                <Stepper.Step key={idx} label={section.section_name} description={`Bagian ${idx + 1}`} />
              ))}
            </Stepper>
          </>
        )}
      </Paper>

      {/* Form card */}
      <Paper {...paperProps}>
        <CustomFormFieldsRenderer
          key={currentStep}
          formRef={formRef}
          section={currentSection}
          formData={accumulatedData}
          onSubmit={handleSectionSubmit}
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
