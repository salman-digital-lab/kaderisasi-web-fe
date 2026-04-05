"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Alert, Container, Paper, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useLocalStorage } from "@mantine/hooks";

import checkOnboardingEmail from "@/functions/server/checkOnboardingEmail";
import showNotif from "@/functions/common/notification";
import login from "@/functions/server/login";
import submitOnboarding from "@/functions/server/submitOnboarding";
import { getCitiesByProvince } from "@/services/profile";
import type { City } from "@/types/model/city";
import {
  getVisibleStepIds,
  ONBOARDING_DRAFT_VERSION,
  ONBOARDING_STORAGE_KEY,
  onboardingFormBaseSchema,
  onboardingInitialValues,
  type OnboardingDraft,
  type OnboardingFormValues,
} from "@/features/onboarding/schema";

import { stepSchemas } from "./config";
import {
  AddressStep,
  ContactStep,
  CredentialsStep,
  ModeStep,
  NoAccountSuccessState,
  OnboardingActionBar,
  OnboardingHeader,
  OnboardingProgress,
  PersonalStep,
  ProfileStep,
  ReviewStep,
  SalmanStep,
} from "./sections";
import type { OnboardingFormProps, StepId } from "./types";
import {
  buildPrefilledValues,
  getStepIndexForField,
  getSubmissionReadyValues,
  getSubmitMessageTitle,
  hydrateDraftValues,
  mergeWithPrefilledValues,
  pathToKey,
  serializeDraftValues,
} from "./utils";
import classes from "./index.module.css";

export default function OnboardingForm({
  provinceData,
  countryData,
  profileData,
}: OnboardingFormProps) {
  const router = useRouter();
  const pageTopRef = useRef<HTMLDivElement | null>(null);
  const lastContextKeyRef = useRef<string | null>(null);
  const lastLoadedAccountIdRef = useRef<number | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submissionMode, setSubmissionMode] =
    useState<OnboardingFormValues["mode"] | null>(null);
  const [editingEducationIndex, setEditingEducationIndex] = useState<
    number | null
  >(null);
  const [editingWorkIndex, setEditingWorkIndex] = useState<number | null>(null);
  const [educationSnapshot, setEducationSnapshot] = useState<
    OnboardingFormValues["educationHistory"][number] | null
  >(null);
  const [workSnapshot, setWorkSnapshot] = useState<
    OnboardingFormValues["workHistory"][number] | null
  >(null);
  const [currentCities, setCurrentCities] = useState<City[]>([]);
  const [originCities, setOriginCities] = useState<City[]>([]);
  const [isCredentialPending, setIsCredentialPending] = useState(false);
  const [isSubmitPending, setIsSubmitPending] = useState(false);
  const [draft, setDraft, removeDraft] = useLocalStorage<OnboardingDraft>({
    key: ONBOARDING_STORAGE_KEY,
    defaultValue: {
      version: ONBOARDING_DRAFT_VERSION,
      currentStep: 0,
      values: onboardingInitialValues,
    },
  });
  const [isRedirectPending, startRedirectTransition] = useTransition();

  const prefilledValues = useMemo(
    () => buildPrefilledValues(profileData),
    [profileData],
  );
  const isExistingAccountLoggedIn = Boolean(profileData?.userData.id);

  const form = useForm<OnboardingFormValues>({
    mode: "controlled",
    initialValues: onboardingInitialValues,
  });

  const visibleStepIds = useMemo<StepId[]>(
    () => getVisibleStepIds(form.values.mode) as StepId[],
    [form.values.mode],
  );
  const activeStepId = visibleStepIds[currentStep] ?? "review";
  const isLastStep = currentStep === visibleStepIds.length - 1;
  const progressValue = ((currentStep + 1) / visibleStepIds.length) * 100;
  const isIndonesia = form.values.country === "ID";
  const submitMessageTitle = getSubmitMessageTitle(activeStepId, submitMessage);

  useEffect(() => {
    if (isHydrated) {
      return;
    }

    if (
      draft?.version === ONBOARDING_DRAFT_VERSION &&
      draft.values &&
      typeof draft.currentStep === "number"
    ) {
      const hydratedDraft = hydrateDraftValues(
        draft.values as unknown as ReturnType<typeof serializeDraftValues>,
      );
      form.setValues(mergeWithPrefilledValues(prefilledValues, hydratedDraft));
      setCurrentStep(
        Math.min(
          Math.max(draft.currentStep, 0),
          getVisibleStepIds(draft.values.mode).length - 1,
        ),
      );
    } else {
      form.setValues(prefilledValues);
      setCurrentStep(prefilledValues.mode === "login" ? 2 : 0);
    }

    setIsHydrated(true);
  }, [draft, form, isHydrated, prefilledValues]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    setDraft({
      version: ONBOARDING_DRAFT_VERSION,
      currentStep,
      values: serializeDraftValues(form.values) as unknown as OnboardingFormValues,
    });
  }, [currentStep, form.values, isHydrated, setDraft]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const nextAccountId = profileData?.userData.id ?? null;

    if (lastLoadedAccountIdRef.current === nextAccountId) {
      return;
    }

    lastLoadedAccountIdRef.current = nextAccountId;

    if (nextAccountId === null) {
      return;
    }

    form.setValues(prefilledValues);
    setCurrentStep((value) => Math.max(value, 2));
  }, [form, isHydrated, prefilledValues, profileData?.userData.id]);

  useEffect(() => {
    const maxStep = visibleStepIds.length - 1;
    if (currentStep > maxStep) {
      setCurrentStep(maxStep);
    }
  }, [currentStep, visibleStepIds.length]);

  useEffect(() => {
    const nextContextKey = [
      currentStep,
      form.values.mode,
      isExistingAccountLoggedIn ? "logged-in" : "guest",
    ].join(":");

    if (lastContextKeyRef.current === nextContextKey) {
      return;
    }

    lastContextKeyRef.current = nextContextKey;

    if (Object.keys(form.errors).length > 0) {
      form.clearErrors();
    }

    setSubmitMessage(null);
  }, [currentStep, form.errors, form.values.mode, isExistingAccountLoggedIn]);

  useEffect(() => {
    if (form.values.country === "" || isIndonesia) {
      return;
    }

    if (form.values.provinceId !== "" || form.values.cityId !== "") {
      form.setValues((currentValues) => ({
        ...currentValues,
        provinceId: "",
        cityId: "",
      }));
    }
  }, [form, form.values.cityId, form.values.country, form.values.provinceId, isIndonesia]);

  useEffect(() => {
    const provinceId = Number(form.values.provinceId);

    if (!Number.isNaN(provinceId) && form.values.provinceId !== "") {
      getCitiesByProvince(provinceId)
        .then(setCurrentCities)
        .catch(() => setCurrentCities([]));
      return;
    }

    setCurrentCities([]);
  }, [form.values.provinceId]);

  useEffect(() => {
    const provinceId = Number(form.values.originProvinceId);

    if (!Number.isNaN(provinceId) && form.values.originProvinceId !== "") {
      getCitiesByProvince(provinceId)
        .then(setOriginCities)
        .catch(() => setOriginCities([]));
      return;
    }

    setOriginCities([]);
  }, [form.values.originProvinceId]);

  function focusFirstError(errors: Record<string, string>) {
    const firstErrorField = Object.keys(errors)[0];
    if (!firstErrorField) {
      return;
    }

    pageTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    requestAnimationFrame(() => {
      const selector = `[name="${CSS.escape(firstErrorField)}"]`;
      const element = document.querySelector<HTMLElement>(selector);
      element?.focus();
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  function setIssuesAsErrors(
    issues: Array<{ path: readonly PropertyKey[]; message: string }>,
  ) {
    const nextErrors = issues.reduce<Record<string, string>>((accumulator, issue) => {
      const key = pathToKey(issue.path);
      if (!accumulator[key]) {
        accumulator[key] = issue.message;
      }
      return accumulator;
    }, {});

    form.setErrors(nextErrors);
    focusFirstError(nextErrors);
    return nextErrors;
  }

  function validateStep(stepId: StepId) {
    const schema = stepSchemas[stepId];
    const result = schema.safeParse(
      getSubmissionReadyValues(form.values, isExistingAccountLoggedIn),
    );

    if (result.success) {
      form.clearErrors();
      return {
        success: true,
        firstMessage: null,
      };
    }

    const nextErrors = setIssuesAsErrors(result.error.issues);
    return {
      success: false,
      firstMessage: Object.values(nextErrors)[0] ?? null,
    };
  }

  function validateListItem(
    index: number,
    kind: "educationHistory" | "workHistory",
  ) {
    const schema = onboardingFormBaseSchema.shape[kind].element;
    const item = form.values[kind][index];
    const result = schema.safeParse(item);

    if (result.success) {
      Object.keys(form.errors)
        .filter((field) => field.startsWith(`${kind}.${index}.`))
        .forEach((field) => form.clearFieldError(field));
      return true;
    }

    const nextErrors = result.error.issues.reduce<Record<string, string>>(
      (accumulator, issue) => {
        const issueKey = `${kind}.${index}.${pathToKey(issue.path)}`;
        if (!accumulator[issueKey]) {
          accumulator[issueKey] = issue.message;
        }
        return accumulator;
      },
      {},
    );

    form.setErrors({
      ...form.errors,
      ...nextErrors,
    });
    focusFirstError(nextErrors);
    return false;
  }

  async function handleNextStep() {
    const stepValidation = validateStep(activeStepId);

    if (!stepValidation.success) {
      return;
    }

    if (activeStepId === "credentials" && form.values.mode === "account") {
      setIsCredentialPending(true);
      const emailCheckResult = await checkOnboardingEmail(form.values.email);
      setIsCredentialPending(false);

      if (!emailCheckResult.success) {
        setSubmitMessage(emailCheckResult.message);
        showNotif(emailCheckResult.message, true);
        return;
      }

      if (emailCheckResult.data?.exists) {
        form.setValues((currentValues) => ({
          ...currentValues,
          mode: "login",
          password: "",
          confirmPassword: "",
        }));
        form.setErrors({
          email:
            "Email ini sudah terdaftar. Silakan login terlebih dahulu untuk melanjutkan.",
        });
        setSubmitMessage(
          "Email ini sudah terdaftar. Silakan login terlebih dahulu untuk melanjutkan onboarding.",
        );
        pageTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        showNotif(
          "Email ini sudah terdaftar. Silakan login terlebih dahulu.",
          true,
        );
        return;
      }
    }

    if (
      activeStepId === "credentials" &&
      form.values.mode === "login" &&
      !isExistingAccountLoggedIn
    ) {
      await handleExistingAccountLogin();
      return;
    }

    setCurrentStep((value) => Math.min(value + 1, visibleStepIds.length - 1));
  }

  function handlePrevStep() {
    setCurrentStep((value) => Math.max(value - 1, 0));
  }

  async function handleSubmit() {
    if (!validateStep("review")) {
      const firstErrorField = Object.keys(form.errors)[0];
      const firstErrorMessage = firstErrorField
        ? String(form.errors[firstErrorField] ?? "")
        : "";
      const targetStepIndex = firstErrorField
        ? getStepIndexForField(firstErrorField, visibleStepIds)
        : null;

      if (targetStepIndex !== null && targetStepIndex >= 0) {
        setCurrentStep(targetStepIndex);
      }

      showNotif(firstErrorMessage || "Mohon periksa kembali data Anda", true);
      return;
    }

    setSubmitMessage(null);
    setIsSubmitPending(true);
    let result;

    try {
      result = await submitOnboarding(
        getSubmissionReadyValues(form.values, isExistingAccountLoggedIn),
      );
    } finally {
      setIsSubmitPending(false);
    }

    if (!result.success) {
      setSubmitMessage(result.message);
      showNotif(result.message, true);
      return;
    }

    removeDraft();
    showNotif(result.message);

    if (result.data?.redirectTo) {
      startRedirectTransition(() => {
        router.push(result.data?.redirectTo || "/profile");
      });
      return;
    }

    setSubmissionMode(result.data?.mode || "no_account");
    setSubmitMessage(result.message);
  }

  async function handleExistingAccountLogin() {
    const result = await login({
      email: form.values.email.trim().toLowerCase(),
      password: form.values.password,
    });

    if (!result.success) {
      setSubmitMessage(result.message);
      showNotif(result.message, true);
      return;
    }

    const nextStep = Math.min(currentStep + 1, visibleStepIds.length - 1);
    setDraft({
      version: ONBOARDING_DRAFT_VERSION,
      currentStep: nextStep,
      values: serializeDraftValues(form.values) as unknown as OnboardingFormValues,
    });

    showNotif("Login berhasil. Data profil dimuat.");
    router.refresh();
  }

  function handleSwitchAccount() {
    setSubmitMessage(null);
    router.push("/api/logout?redirect=/onboarding");
  }

  function addEducationEntry() {
    form.insertListItem("educationHistory", {
      degree: "bachelor",
      institution: "",
      major: "",
      intakeYear: null,
    });
    setEducationSnapshot(null);
    setEditingEducationIndex(form.values.educationHistory.length);
  }

  function addWorkEntry() {
    form.insertListItem("workHistory", {
      jobTitle: "",
      company: "",
      startYear: null,
      endYear: null,
    });
    setWorkSnapshot(null);
    setEditingWorkIndex(form.values.workHistory.length);
  }

  function startEditEducation(index: number) {
    setEducationSnapshot({
      ...(form.values.educationHistory[index] ?? {
        degree: "bachelor",
        institution: "",
        major: "",
        intakeYear: null,
      }),
    });
    setEditingEducationIndex(index);
  }

  function cancelEditEducation(index: number) {
    if (educationSnapshot) {
      form.replaceListItem("educationHistory", index, educationSnapshot);
    } else {
      form.removeListItem("educationHistory", index);
    }
    setEducationSnapshot(null);
    setEditingEducationIndex(null);
  }

  function saveEditEducation() {
    if (editingEducationIndex === null) {
      return;
    }

    if (!validateListItem(
      editingEducationIndex,
      "educationHistory",
    )) {
      return;
    }

    setEducationSnapshot(null);
    setEditingEducationIndex(null);
  }

  function deleteEducation(index: number) {
    form.removeListItem("educationHistory", index);
    setEducationSnapshot(null);
    setEditingEducationIndex((currentValue) => {
      if (currentValue === index) {
        return null;
      }
      if (currentValue !== null && currentValue > index) {
        return currentValue - 1;
      }
      return currentValue;
    });
  }

  function startEditWork(index: number) {
    setWorkSnapshot({
      ...(form.values.workHistory[index] ?? {
        jobTitle: "",
        company: "",
        startYear: null,
        endYear: null,
      }),
    });
    setEditingWorkIndex(index);
  }

  function cancelEditWork(index: number) {
    if (workSnapshot) {
      form.replaceListItem("workHistory", index, workSnapshot);
    } else {
      form.removeListItem("workHistory", index);
    }
    setWorkSnapshot(null);
    setEditingWorkIndex(null);
  }

  function saveEditWork() {
    if (editingWorkIndex === null) {
      return;
    }

    if (!validateListItem(
      editingWorkIndex,
      "workHistory",
    )) {
      return;
    }

    setWorkSnapshot(null);
    setEditingWorkIndex(null);
  }

  function deleteWork(index: number) {
    form.removeListItem("workHistory", index);
    setWorkSnapshot(null);
    setEditingWorkIndex((currentValue) => {
      if (currentValue === index) {
        return null;
      }
      if (currentValue !== null && currentValue > index) {
        return currentValue - 1;
      }
      return currentValue;
    });
  }

  function renderActiveStep() {
    switch (activeStepId) {
      case "mode":
        return <ModeStep form={form} />;
      case "credentials":
        return (
          <CredentialsStep
            form={form}
            profileData={profileData}
            isExistingAccountLoggedIn={isExistingAccountLoggedIn}
            onSwitchAccount={handleSwitchAccount}
          />
        );
      case "personal":
        return <PersonalStep form={form} />;
      case "contact":
        return <ContactStep form={form} />;
      case "address":
        return (
          <AddressStep
            form={form}
            countryData={countryData}
            provinceData={provinceData}
            currentCities={currentCities}
            originCities={originCities}
            isIndonesia={isIndonesia}
          />
        );
      case "education":
        return (
          <ProfileStep
            form={form}
            editingEducationIndex={editingEducationIndex}
            editingWorkIndex={editingWorkIndex}
            onAddEducation={addEducationEntry}
            onAddWork={addWorkEntry}
            onEditEducation={startEditEducation}
            onCancelEducation={cancelEditEducation}
            onSaveEducation={saveEditEducation}
            onDeleteEducation={deleteEducation}
            onEditWork={startEditWork}
            onCancelWork={cancelEditWork}
            onSaveWork={saveEditWork}
            onDeleteWork={deleteWork}
          />
        );
      case "salman":
        return <SalmanStep form={form} />;
      case "review":
      default:
        return (
          <ReviewStep
            form={form}
            profileData={profileData}
            countryData={countryData}
            provinceData={provinceData}
            currentCities={currentCities}
            originCities={originCities}
          />
        );
    }
  }

  if (submissionMode === "no_account") {
    return (
      <Container size={640} className={classes.shell} px={0}>
        <NoAccountSuccessState onLogin={() => router.push("/login")} />
      </Container>
    );
  }

  return (
    <Container size="lg" className={classes.shell} px={0}>
      <div>
        <div ref={pageTopRef} />
        <OnboardingHeader />

        <Paper withBorder p={{ base: "sm", sm: "lg" }} mt="md" radius="md">
          <Stack gap="lg">
            <OnboardingProgress
              currentStep={currentStep}
              visibleStepIds={visibleStepIds}
              progressValue={progressValue}
              activeStepId={activeStepId}
            />

            {submitMessage ? (
              <Alert color="red" variant="light" title={submitMessageTitle}>
                {submitMessage}
              </Alert>
            ) : null}

            <form
              onSubmit={(event) => {
                event.preventDefault();

                if (isLastStep) {
                  void handleSubmit();
                  return;
                }

                void handleNextStep();
              }}
            >
              <Stack gap="xl">
                {renderActiveStep()}
                <OnboardingActionBar
                  currentStep={currentStep}
                  isLastStep={isLastStep}
                  activeStepId={activeStepId}
                  mode={form.values.mode}
                  isExistingAccountLoggedIn={isExistingAccountLoggedIn}
                  isCredentialPending={isCredentialPending}
                  isSubmitPending={isSubmitPending}
                  isRedirectPending={isRedirectPending}
                  onPrev={handlePrevStep}
                />
              </Stack>
            </form>
          </Stack>
        </Paper>
      </div>
    </Container>
  );
}
