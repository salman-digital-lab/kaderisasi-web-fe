"use client";

import { useState, useEffect, useRef } from "react";
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
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import type { CustomForm } from "@/types/api/customForm";
import type { Member, PublicUser } from "@/types/model/members";
import type { Province } from "@/types/model/province";
import type { Country } from "@/types/model/country";
import CustomFormProfileSection from "../CustomFormProfileSection";
import CustomFormGuestSection from "../CustomFormGuestSection";
import CustomFormFieldsRenderer from "../CustomFormFieldsRenderer";
import showNotif from "@/functions/common/notification";
import registerCustomForm from "@/functions/server/registerCustomForm";
import { postGuestActivity } from "@/services/activity";
import { FetcherError } from "@/functions/common/fetcher";
import { useRouter } from "next/navigation";
import { useFormRoute } from "../use-form-route";
import { customSections } from "../form-routing";

type CustomFormContentProps = {
  customForm: CustomForm;
  profileData?: { userData: PublicUser; profile: Member };
  provinceData?: Province[];
  countryData?: Country[];
  featureType:
    "activity_registration" | "club_registration" | "independent_form";
  featureId?: number;
  isGuest?: boolean;
  activitySlug?: string;
  resetOnMount?: boolean;
};

const GUEST_FIELD_LABELS: Record<string, string> = {
  "guest_data.name": "Nama",
  "guest_data.email": "Email",
  "guest_data.whatsapp": "WhatsApp",
  name: "Nama",
  email: "Email",
  whatsapp: "WhatsApp",
};

const GUEST_BACKEND_ERRORS: Record<string, string> = {
  GUEST_REGISTRATION_NOT_ALLOWED:
    "Pendaftaran tamu tidak diizinkan untuk kegiatan ini.",
  REGISTRATION_CLOSED: "Pendaftaran sudah ditutup.",
  ALREADY_REGISTERED: "Kamu sudah terdaftar di kegiatan ini.",
};

function translateGuestError(message: string): string {
  if (message in GUEST_BACKEND_ERRORS) return GUEST_BACKEND_ERRORS[message]!;

  const requiredField = message.match(/The (.+) field must be defined/)?.[1];
  if (requiredField) {
    return `${GUEST_FIELD_LABELS[requiredField] ?? requiredField} wajib diisi.`;
  }

  const invalidField = message.match(/The (.+) field format is invalid/)?.[1];
  if (invalidField) {
    return `Format ${GUEST_FIELD_LABELS[invalidField] ?? invalidField} tidak valid.`;
  }

  return "Terjadi kesalahan. Periksa kembali data Anda.";
}

const paperProps = {
  radius: "md" as const,
  withBorder: true,
  p: { base: "md", sm: "xl" } as const,
};

export default function CustomFormContent({
  customForm,
  profileData,
  provinceData,
  countryData,
  featureType,
  featureId,
  isGuest = false,
  activitySlug,
  resetOnMount = false,
}: CustomFormContentProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const storageKey = `customForm:v2:${isGuest ? "guest" : profileData?.userData.id}:${customForm.id}`;
  const flow = useFormRoute(
    customForm.form_schema,
    storageKey,
    true,
    {},
    resetOnMount,
  );
  const {
    answers: customFormData,
    currentSection,
    isLast: isLastStep,
    isLoaded,
  } = flow;
  const currentStep = flow.history.length;
  const isProfileStep = flow.isProfileStep;

  // Strip the reset param from the URL so a page refresh doesn't re-reset
  useEffect(() => {
    if (!resetOnMount) return;
    const url = new URL(window.location.href);
    url.searchParams.delete("reset");
    router.replace(url.pathname + url.search, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [loading, setLoading] = useState(false);
  const [savedProfileData, setSavedProfileData] = useState(profileData);

  const profileFields =
    customForm.form_schema.fields.find(
      (section) => section.section_name === "profile_data",
    )?.fields ?? [];
  const customFormSections = customSections(customForm.form_schema);
  const hasCustomSections = customFormSections.length > 0;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    formRef.current
      ?.querySelector<HTMLElement>("[data-form-section-title]")
      ?.focus({ preventScroll: true });
  }, [flow.currentId, isLoaded]);

  const getSuccessUrl = () => {
    const typeMap = {
      activity_registration: "activity",
      club_registration: "club",
      independent_form: "independent",
    } as const;
    return `/custom-form/${typeMap[featureType]}/${featureId || "0"}/success`;
  };

  const buildGuestPayload = (formData: Record<string, unknown>) => {
    const profileFieldKeys = new Set([
      ...profileFields.map((f) => f.key),
      "name",
      "email",
    ]);
    const guestData: Record<string, unknown> = {};
    const questionnaireAnswer: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(formData)) {
      if (profileFieldKeys.has(key)) guestData[key] = value;
      else questionnaireAnswer[key] = value;
    }
    return { guestData, questionnaireAnswer };
  };

  const submitGuestRegistration = async (formData: Record<string, unknown>) => {
    const { guestData, questionnaireAnswer } = buildGuestPayload(formData);
    try {
      const resp = await postGuestActivity({
        slug: activitySlug!,
        data: {
          guest_data: guestData,
          questionnaire_answer: questionnaireAnswer,
        },
      });
      return !!resp;
    } catch (error) {
      showNotif(
        error instanceof FetcherError
          ? translateGuestError(error.message)
          : "Terjadi kesalahan jaringan. Silakan coba lagi.",
        true,
      );
      return false;
    }
  };

  const finishAndRedirect = async (formData: Record<string, unknown>) => {
    try {
      setLoading(true);
      if (isGuest) {
        if (!(await submitGuestRegistration(formData))) return;
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
      flow.clear();
      if (featureType === "club_registration") {
        router.replace(getSuccessUrl());
      } else {
        router.push(getSuccessUrl());
      }
    } catch {
      showNotif("Terjadi kesalahan jaringan. Silakan coba lagi.", true);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (data?: Record<string, unknown>) => {
    const submission = flow.advance(isGuest ? (data ?? {}) : {});
    if (submission) await finishAndRedirect(submission);
  };

  const handleSectionSubmit = async (data: Record<string, unknown>) => {
    const submission = flow.advance(data);
    if (submission) await finishAndRedirect(submission);
  };

  const activityBackUrl =
    featureType === "activity_registration" && activitySlug
      ? isGuest
        ? `/activity/${activitySlug}/join`
        : `/activity/${activitySlug}`
      : null;
  const backUrl =
    activityBackUrl ??
    (featureType === "club_registration" && featureId
      ? `/clubs/${featureId}`
      : null);
  const backLabel =
    featureType === "club_registration"
      ? "Kembali ke Klub"
      : "Kembali ke Kegiatan";

  if (flow.configurationError)
    return (
      <Alert color="red" title="Formulir tidak tersedia">
        {flow.configurationError} Hubungi pengelola.
      </Alert>
    );

  if (!isLoaded) {
    return (
      <Stack gap="md">
        <Paper {...paperProps}>
          <Title order={1} size="h2" mb="xs">
            {customForm.form_name}
          </Title>
          <Text size="md" c="dimmed">
            Memuat formulir...
          </Text>
        </Paper>
      </Stack>
    );
  }

  return (
    <Stack gap="md">
      {flow.notice && <Alert title="Draf formulir">{flow.notice}</Alert>}
      {backUrl && (
        <Button
          component={Link}
          href={backUrl}
          variant="subtle"
          leftSection={<IconArrowLeft size={16} aria-hidden="true" />}
          mb="xs"
          px={0}
          style={{ alignSelf: "flex-start" }}
        >
          {backLabel}
        </Button>
      )}

      {/* Header card: title, description, stepper */}
      <Paper {...paperProps}>
        <Title order={1} size="h2" mb="xs">
          {customForm.form_name}
        </Title>
        {currentStep === 0 && customForm.form_description && (
          <Text size="md" style={{ whiteSpace: "pre-wrap" }}>
            {customForm.form_description}
          </Text>
        )}
        {hasCustomSections && (
          <>
            <Text size="md" c="dimmed" hiddenFrom="sm" mt="md">
              Langkah {currentStep + 1}:{" "}
              {currentStep === 0 ? "Data Diri" : currentSection?.section_name}
            </Text>
            <Stepper
              active={currentStep}
              size="md"
              mt="lg"
              iconSize={32}
              visibleFrom="sm"
            >
              <Stepper.Step
                allowStepClick={false}
                label="Data Diri"
                description="Lengkapi data diri"
              />
              {customFormSections
                .filter(
                  (section) =>
                    flow.history.includes(section.id) ||
                    currentSection?.id === section.id,
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
        {isProfileStep ? (
          isGuest ? (
            <CustomFormGuestSection
              formRef={formRef}
              profileFields={profileFields}
              provinceData={provinceData}
              onSubmit={handleProfileSubmit}
              loading={loading}
              isSingleSection={!hasCustomSections}
              initialData={customFormData}
            />
          ) : (
            <CustomFormProfileSection
              formRef={formRef}
              profileFields={profileFields}
              profileData={savedProfileData}
              onProfileSaved={(profile) => {
                setSavedProfileData((previous) =>
                  previous ? { ...previous, profile } : previous,
                );
              }}
              provinceData={provinceData}
              countryData={countryData}
              onSubmit={handleProfileSubmit}
              onLoadingChange={setLoading}
              loading={loading}
              isSingleSection={!hasCustomSections}
            />
          )
        ) : currentSection ? (
          <CustomFormFieldsRenderer
            key={currentSection.id}
            formRef={formRef}
            section={currentSection}
            formData={customFormData}
            onSubmit={handleSectionSubmit}
            onChange={flow.updateAnswers}
            loading={loading}
            isLastSection={isLastStep}
          />
        ) : null}
      </Paper>

      {/* Navigation buttons */}
      <Group justify={currentStep === 0 ? "flex-end" : "space-between"}>
        {currentStep > 0 && (
          <Button
            type="button"
            variant="default"
            onClick={flow.back}
            disabled={loading}
            style={{ flex: "0 1 auto", minWidth: "100px" }}
          >
            Kembali
          </Button>
        )}
        <Button
          type="button"
          loading={loading}
          onClick={() => formRef.current?.requestSubmit()}
          style={{ flex: "1 1 auto", minWidth: "120px" }}
        >
          {isLastStep ? "Kirim" : "Lanjutkan"}
        </Button>
      </Group>
    </Stack>
  );
}
