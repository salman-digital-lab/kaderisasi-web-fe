"use client";

import { useState, useEffect } from "react";
import { Stack, Title, Text, Stepper, Box } from "@mantine/core";
import { CustomForm } from "@/types/api/customForm";
import { Member, PublicUser } from "@/types/model/members";
import { Province } from "@/types/model/province";
import CustomFormProfileSection from "../CustomFormProfileSection";
import CustomFormGuestSection from "../CustomFormGuestSection";
import CustomFormFieldsRenderer from "../CustomFormFieldsRenderer";
import showNotif from "@/functions/common/notification";
import registerCustomForm from "@/functions/server/registerCustomForm";
import { postGuestActivity } from "@/services/activity";
import { FetcherError } from "@/functions/common/fetcher";
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
  isGuest?: boolean;
  activitySlug?: string;
};

const GUEST_FIELD_LABELS: Record<string, string> = {
  "guest_data.name": "Nama",
  "guest_data.email": "Email",
  "guest_data.whatsapp": "WhatsApp",
  "name": "Nama",
  "email": "Email",
  "whatsapp": "WhatsApp",
};

const GUEST_BACKEND_ERRORS: Record<string, string> = {
  GUEST_REGISTRATION_NOT_ALLOWED: "Pendaftaran tamu tidak diizinkan untuk kegiatan ini.",
  REGISTRATION_CLOSED: "Pendaftaran sudah ditutup.",
  ALREADY_REGISTERED: "Kamu sudah terdaftar di kegiatan ini.",
};

function translateGuestError(message: string): string {
  // Known business-logic error codes returned by the backend
  if (message in GUEST_BACKEND_ERRORS) {
    return GUEST_BACKEND_ERRORS[message]!; // `in` guard proves key exists
  }

  // VineJS: "The guest_data.email field must be defined"
  const requiredField = message.match(/The (.+) field must be defined/)?.[1];
  if (requiredField) {
    const label = GUEST_FIELD_LABELS[requiredField] ?? requiredField;
    return `${label} wajib diisi.`;
  }

  // VineJS: "The guest_data.email field format is invalid"
  const invalidField = message.match(/The (.+) field format is invalid/)?.[1];
  if (invalidField) {
    const label = GUEST_FIELD_LABELS[invalidField] ?? invalidField;
    return `Format ${label} tidak valid.`;
  }

  return "Terjadi kesalahan. Periksa kembali data Anda.";
}

export default function CustomFormContent({
  customForm,
  profileData,
  provinceData,
  featureType,
  featureId,
  isGuest = false,
  activitySlug,
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

  const getSuccessUrl = () => {
    const typeMap = {
      activity_registration: "activity",
      club_registration: "club",
      independent_form: "independent",
    } as const;
    const type = typeMap[featureType];
    return `/custom-form/${type}/${featureId || "0"}/success`;
  };

  // Splits merged form data into guest_data (profile fields) and questionnaire_answer (rest).
  // name and email are always routed to guest_data — CustomFormGuestSection injects them
  // even when they are absent from the form schema.
  const buildGuestPayload = (formData: Record<string, unknown>) => {
    const profileFieldKeys = new Set([
      ...profileFields.map((f) => f.key),
      "name",
      "email",
    ]);
    const guestData: Record<string, unknown> = {};
    const questionnaireAnswer: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(formData)) {
      if (profileFieldKeys.has(key)) {
        guestData[key] = value;
      } else {
        questionnaireAnswer[key] = value;
      }
    }

    return { guestData, questionnaireAnswer };
  };

  const submitGuestRegistration = async (formData: Record<string, unknown>) => {
    const { guestData, questionnaireAnswer } = buildGuestPayload(formData);
    try {
      const resp = await postGuestActivity({
        slug: activitySlug!,
        data: { guest_data: guestData, questionnaire_answer: questionnaireAnswer },
      });
      return !!resp;
    } catch (error) {
      const message =
        error instanceof FetcherError
          ? translateGuestError(error.message)
          : "Terjadi kesalahan jaringan. Silakan coba lagi.";
      showNotif(message, true);
      return false;
    }
  };

  const finishAndRedirect = async (formData: Record<string, unknown>) => {
    try {
      setLoading(true);

      if (isGuest) {
        const success = await submitGuestRegistration(formData);
        if (!success) return;
      } else {
        const response = await registerCustomForm({
          feature_type: featureType,
          feature_id: featureId,
          custom_form_data: formData,
        });
        if (!response.success) {
          showNotif(response.message, true);
          return;
        }
      }

      clearStorage();
      router.push(getSuccessUrl());
    } catch {
      showNotif("Terjadi kesalahan jaringan. Silakan coba lagi.", true);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (profileData?: Record<string, unknown>) => {
    if (!hasCustomSections) {
      // Single-section form: merge stored data with freshly submitted profile data.
      // profileData must take precedence — customFormData starts as {} so nullish
      // coalescing alone would discard profileData when customFormData is an empty object.
      await finishAndRedirect({ ...(customFormData ?? {}), ...(profileData ?? {}) });
      return;
    }

    // Multi-section form: persist profile data and advance to the first custom section
    if (isGuest && profileData) {
      setCustomFormData({ ...customFormData, ...profileData });
    }
    setCurrentStep(1);
  };

  const handleCustomFormSubmit = async (sectionData: Record<string, unknown>) => {
    const allFormData = { ...customFormData, ...sectionData };
    setCustomFormData(allFormData);
    await finishAndRedirect(allFormData);
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

        {isGuest ? (
          <CustomFormGuestSection
            profileFields={profileFields}
            provinceData={provinceData}
            onSubmit={handleProfileSubmit}
            loading={loading}
            isSingleSection={!hasCustomSections}
            initialData={customFormData}
          />
        ) : (
          <CustomFormProfileSection
            profileFields={profileFields}
            profileData={profileData}
            provinceData={provinceData}
            onSubmit={handleProfileSubmit}
            loading={loading}
            isSingleSection={!hasCustomSections}
          />
        )}
      </Stack>
    );
  }

  // Custom form sections
  const sectionIndex = currentStep - 1;
  const currentSection = customFormSections[sectionIndex];
  const isLastSection = sectionIndex === customFormSections.length - 1;

  // Guard against undefined section
  if (!currentSection) {
    return null;
  }

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
        key={sectionIndex}
        section={currentSection}
        sections={customFormSections}
        currentSectionIndex={sectionIndex}
        formData={customFormData}
        onSubmit={(data) => {
          if (isLastSection) {
            handleCustomFormSubmit(data);
          } else {
            setCustomFormData({ ...customFormData, ...data });
            setCurrentStep(currentStep + 1);
          }
        }}
        onBack={() => setCurrentStep(sectionIndex === 0 ? 0 : currentStep - 1)}
        loading={loading}
        isLastSection={isLastSection}
      />
    </Stack>
  );
}
