"use client";

import { useState, useEffect } from "react";
import { Stack, Title, Text, Stepper, Box, Alert } from "@mantine/core";
import { CustomForm } from "@/types/api/customForm";
import { Member, PublicUser } from "@/types/model/members";
import { Province } from "@/types/model/province";
import CustomFormProfileSection from "../CustomFormProfileSection";
import CustomFormFieldsRenderer from "../CustomFormFieldsRenderer";
import showNotif from "@/functions/common/notification";
import registerCustomForm from "@/functions/server/registerCustomForm";
import { useRouter } from "next/navigation";
import { useFormLocalStorage } from "@/hooks/useFormLocalStorage";

type CustomFormContentProps = {
  customForm: CustomForm;
  profileData?: {
    userData: PublicUser;
    profile: Member;
  };
  provinceData?: Province[];
  featureType:
    | "activity_registration"
    | "club_registration"
    | "independent_form";
  featureId?: number;
};

export default function CustomFormContent({
  customForm,
  profileData,
  provinceData,
  featureType,
  featureId,
}: CustomFormContentProps) {
  const router = useRouter();

  // Create a unique storage key for this form
  const storageKey = `customForm_${featureType}_${featureId || "independent"}`;

  // Use localStorage hook to persist form data
  const {
    formData: customFormData,
    setFormData: setCustomFormData,
    currentStep,
    setCurrentStep,
    clearStorage,
    isLoaded,
  } = useFormLocalStorage(storageKey);

  const [loading, setLoading] = useState(false);

  // Extract profile fields from first section
  const firstSection = customForm.form_schema.fields[0];
  const profileFields = firstSection?.fields || [];

  // Rest of the sections are custom form sections
  const customFormSections = customForm.form_schema.fields.slice(1);

  const hasCustomSections = customFormSections.length > 0;
  const totalSteps = hasCustomSections ? customFormSections.length + 1 : 1; // profile + custom sections

  // Show notification when data is restored from localStorage
  useEffect(() => {
    if (isLoaded && currentStep > 0) {
      showNotif("Data formulir Anda telah dipulihkan", false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  const handleProfileSubmit = async () => {
    // If there are no custom sections, submit the form directly
    if (!hasCustomSections) {
      try {
        setLoading(true);

        await registerCustomForm({
          feature_type: featureType,
          feature_id: featureId,
          custom_form_data: {},
        });

        // Clear localStorage after successful submission
        clearStorage();

        // Redirect to success page
        const typeMap = {
          activity_registration: "activity",
          club_registration: "club",
          independent_form: "independent",
        } as const;

        const type = typeMap[featureType];
        const successUrl = `/custom-form/${type}/${featureId || "0"}/success`;

        router.push(successUrl);
      } catch (error) {
        if (error instanceof Error) showNotif(error.message, true);
        if (typeof error === "string") showNotif(error, true);
      } finally {
        setLoading(false);
      }
      return;
    }

    // If there are custom sections, move to the next step
    setCurrentStep(1);
  };

  const handleCustomFormSubmit = async (data: Record<string, any>) => {
    // Merge all section data into single level
    const allFormData = { ...customFormData, ...data };
    setCustomFormData(allFormData);

    // Submit the form
    try {
      setLoading(true);

      await registerCustomForm({
        feature_type: featureType,
        feature_id: featureId,
        custom_form_data: allFormData,
      });

      // Clear localStorage after successful submission
      clearStorage();

      // Redirect to success page to show post-submission info
      const typeMap = {
        activity_registration: "activity",
        club_registration: "club",
        independent_form: "independent",
      } as const;

      const type = typeMap[featureType];
      const successUrl = `/custom-form/${type}/${featureId || "0"}/success`;

      router.push(successUrl);
    } catch (error) {
      if (error instanceof Error) showNotif(error.message, true);
      if (typeof error === "string") showNotif(error, true);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while data is being loaded
  if (!isLoaded) {
    return (
      <Stack gap="lg">
        <Box>
          <Title order={3} mb="xs">
            {customForm.form_name}
          </Title>
          <Text size="sm" c="dimmed">
            Memuat formulir...
          </Text>
        </Box>
      </Stack>
    );
  }

  // Profile data step
  if (currentStep === 0) {
    return (
      <Stack gap="lg">
        <Box>
          <Title order={3} mb="xs">
            {customForm.form_name}
          </Title>
          {customForm.form_description && (
            <Text size="sm" pb="md" style={{ whiteSpace: "pre-wrap" }}>
              {customForm.form_description}
            </Text>
          )}
          {hasCustomSections && (
            <Text size="sm" c="dimmed" hiddenFrom="sm" mt="md">
              Langkah 1 dari {totalSteps}: Data Diri
            </Text>
          )}
        </Box>

        {hasCustomSections && (
          <Stepper active={0} size="sm" mb="lg" iconSize={32} visibleFrom="sm">
            <Stepper.Step label="Data Diri" description="Lengkapi data diri" />
            {customFormSections.map((section, idx) => (
              <Stepper.Step
                key={idx}
                label={section.section_name}
                description={`Bagian ${idx + 1}`}
              />
            ))}
          </Stepper>
        )}

        <CustomFormProfileSection
          profileFields={profileFields}
          profileData={profileData}
          provinceData={provinceData}
          onSubmit={handleProfileSubmit}
          loading={loading}
          isSingleSection={!hasCustomSections}
        />
      </Stack>
    );
  }

  // Custom form sections
  const sectionIndex = currentStep - 1;
  const currentSection = customFormSections[sectionIndex];
  const isLastSection = sectionIndex === customFormSections.length - 1;

  return (
    <Stack gap="lg">
      <Box>
        <Title order={3} mb="xs">
          {customForm.form_name}
        </Title>
        <Text size="sm" c="dimmed" hiddenFrom="sm">
          Langkah {currentStep + 1} dari {totalSteps}:{" "}
          {currentSection.section_name}
        </Text>
      </Box>

      <Stepper
        active={currentStep}
        size="sm"
        mb="lg"
        iconSize={32}
        visibleFrom="sm"
      >
        <Stepper.Step label="Data Diri" description="Lengkapi data diri" />
        {customFormSections.map((section, idx) => (
          <Stepper.Step
            key={idx}
            label={section.section_name}
            description={`Bagian ${idx + 1}`}
          />
        ))}
      </Stepper>

      <CustomFormFieldsRenderer
        section={currentSection}
        sections={customFormSections}
        currentSectionIndex={sectionIndex}
        formData={customFormData}
        onSubmit={(data) => {
          if (isLastSection) {
            handleCustomFormSubmit(data);
          } else {
            // Merge current section data with previous data
            setCustomFormData({ ...customFormData, ...data });
            setCurrentStep(currentStep + 1);
          }
        }}
        onBack={() => {
          if (sectionIndex === 0) {
            setCurrentStep(0);
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
