"use client";

import { useState } from "react";
import { Stack, Title, Text, Stepper, Box } from "@mantine/core";
import { CustomForm } from "@/types/api/customForm";
import CustomFormFieldsRenderer from "../CustomFormFieldsRenderer";
import showNotif from "@/functions/common/notification";
import updateActivityCustomForm from "@/functions/server/updateActivityCustomForm";
import { useRouter } from "next/navigation";
import { Registrant } from "@/types/model/activity";

type CustomFormContentEditProps = {
  customForm: CustomForm;
  registrationData: Registrant;
  slug: string;
};

export default function CustomFormContentEdit({
  customForm,
  registrationData,
  slug,
}: CustomFormContentEditProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Existing form data from registration
  const existingData = registrationData.questionnaire_answer || {};

  // Custom form sections (skip first section which is profile data)
  const customFormSections = customForm.form_schema.fields.slice(1);

  // For multi-section forms, track which section we're on
  const [currentStep, setCurrentStep] = useState(0);

  // Accumulated form data across sections
  const [accumulatedData, setAccumulatedData] =
    useState<Record<string, any>>(existingData);

  const handleCustomFormSubmit = async (data: Record<string, any>) => {
    const allFormData = { ...accumulatedData, ...data };

    try {
      setLoading(true);

      const response = await updateActivityCustomForm(slug, allFormData);

      if (!response.success) {
        showNotif(response.message, true);
        return;
      }

      showNotif(response.message);
      router.push(`/profile?tab=activity`);
    } catch (error) {
      showNotif("Terjadi kesalahan jaringan. Silakan coba lagi.", true);
    } finally {
      setLoading(false);
    }
  };

  // Guard: no custom sections
  if (customFormSections.length === 0) {
    return (
      <Stack gap="lg">
        <Box>
          <Title order={3} mb="xs">
            {customForm.form_name}
          </Title>
          <Text size="sm" c="dimmed">
            Tidak ada formulir tambahan untuk diubah.
          </Text>
        </Box>
      </Stack>
    );
  }

  const currentSection = customFormSections[currentStep];
  const isLastSection = currentStep === customFormSections.length - 1;
  const totalSteps = customFormSections.length;

  if (!currentSection) {
    return null;
  }

  return (
    <Stack gap="lg">
      <Box>
        <Title order={3} mb="xs">
          Ubah Formulir — {customForm.form_name}
        </Title>
        {totalSteps > 1 && (
          <Text size="sm" c="dimmed" hiddenFrom="sm">
            Langkah {currentStep + 1} dari {totalSteps}:{" "}
            {currentSection.section_name}
          </Text>
        )}
      </Box>

      {totalSteps > 1 && (
        <Stepper
          active={currentStep}
          size="sm"
          mb="lg"
          iconSize={32}
          visibleFrom="sm"
        >
          {customFormSections.map((section, idx) => (
            <Stepper.Step
              key={idx}
              label={section.section_name}
              description={`Bagian ${idx + 1}`}
            />
          ))}
        </Stepper>
      )}

      <CustomFormFieldsRenderer
        section={currentSection}
        sections={customFormSections}
        currentSectionIndex={currentStep}
        formData={accumulatedData}
        onSubmit={(data) => {
          if (isLastSection) {
            handleCustomFormSubmit(data);
          } else {
            setAccumulatedData({ ...accumulatedData, ...data });
            setCurrentStep(currentStep + 1);
          }
        }}
        onBack={() => {
          if (currentStep === 0) {
            router.push(`/profile?tab=activity`);
          } else {
            setCurrentStep(currentStep - 1);
          }
        }}
        loading={loading}
        isLastSection={isLastSection}
      />
    </Stack>
  );
}
