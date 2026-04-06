import type { Country } from "@/types/model/country";
import type { Member, PublicUser } from "@/types/model/members";
import { USER_LEVEL_ENUM } from "@/types/constants/profile";

import {
  currentActivityFocusOptions,
  degreeOptions,
  kaderisasiParticipationOptions,
  onboardingInitialValues,
  salmanActivityHistoryOptions,
  type OnboardingFormValues,
} from "@/features/onboarding/schema";

import type { DraftValues, StepId } from "./types";

export function serializeDraftValues(values: OnboardingFormValues): DraftValues {
  return {
    ...values,
    birthDate: values.birthDate ? values.birthDate.toISOString() : null,
  };
}

export function hydrateDraftValues(values: DraftValues): OnboardingFormValues {
  return {
    ...onboardingInitialValues,
    ...values,
    birthDate: values.birthDate ? new Date(values.birthDate) : null,
  };
}

export function pathToKey(path: readonly PropertyKey[]) {
  return path
    .filter((segment): segment is string | number => typeof segment !== "symbol")
    .join(".");
}

export function getLocationLabel(
  id: string,
  items: Array<{ id: number; name: string }>,
): string {
  return items.find((item) => item.id.toString() === id)?.name || "-";
}

export function getCountryLabel(value: string, items: Country[]) {
  return items.find((item) => item.code === value)?.name || value || "-";
}

export function getEducationSummary(
  entry: OnboardingFormValues["educationHistory"][number],
) {
  const primary = [entry.institution, entry.faculty, entry.major].filter(Boolean).join(" / ");
  const degreeLabel =
    degreeOptions.find((option) => option.value === entry.degree)?.label || "-";
  const intakeYear = entry.intakeYear ? String(entry.intakeYear) : "-";

  return [degreeLabel, primary || "Data belum lengkap", intakeYear].join(" • ");
}

export function getWorkSummary(
  entry: OnboardingFormValues["workHistory"][number],
) {
  const primary = [entry.jobTitle, entry.company].filter(Boolean).join(" - ");
  const years =
    entry.startYear || entry.endYear
      ? `${entry.startYear ?? "?"} - ${entry.endYear ?? "Sekarang"}`
      : "Tahun belum diisi";

  return [primary || "Data belum lengkap", years].join(" • ");
}

export function getFocusLabel(value: string) {
  return (
    currentActivityFocusOptions.find((option) => option.value === value)?.label ||
    value
  );
}

export function getSalmanHistoryLabel(value: string) {
  return (
    salmanActivityHistoryOptions.find((option) => option.value === value)?.label ||
    value
  );
}

export function getKaderisasiParticipationLabel(value: string) {
  return (
    kaderisasiParticipationOptions.find((option) => option.value === value)?.label ||
    value
  );
}

export function getSubmissionReadyValues(
  values: OnboardingFormValues,
  isExistingAccountLoggedIn: boolean,
): OnboardingFormValues {
  if (values.mode === "login" && isExistingAccountLoggedIn) {
    return {
      ...values,
      password: "__authenticated__",
      confirmPassword: "__authenticated__",
    };
  }

  return values;
}

export function getStepIndexForField(
  fieldKey: string,
  visibleSteps: StepId[],
): number | null {
  if (
    fieldKey.startsWith("email") ||
    fieldKey.startsWith("password") ||
    fieldKey.startsWith("confirmPassword")
  ) {
    return visibleSteps.indexOf("credentials");
  }

  if (
    fieldKey.startsWith("name") ||
    fieldKey.startsWith("preferredName") ||
    fieldKey.startsWith("gender") ||
    fieldKey.startsWith("birthDate")
  ) {
    return visibleSteps.indexOf("personal");
  }

  if (
    fieldKey.startsWith("whatsapp") ||
    fieldKey.startsWith("instagram") ||
    fieldKey.startsWith("tiktok") ||
    fieldKey.startsWith("linkedin")
  ) {
    return visibleSteps.indexOf("contact");
  }

  if (
    fieldKey.startsWith("country") ||
    fieldKey.startsWith("provinceId") ||
    fieldKey.startsWith("cityId") ||
    fieldKey.startsWith("originProvinceId") ||
    fieldKey.startsWith("originCityId")
  ) {
    return visibleSteps.indexOf("address");
  }

  if (
    fieldKey.startsWith("educationHistory") ||
    fieldKey.startsWith("workHistory") ||
    fieldKey.startsWith("currentActivityFocus")
  ) {
    return visibleSteps.indexOf("education");
  }

  if (fieldKey.startsWith("salmanActivityHistory")) {
    return visibleSteps.indexOf("salman");
  }

  if (
    fieldKey.startsWith("kaderisasiParticipation") ||
    fieldKey.startsWith("sscGeneration") ||
    fieldKey.startsWith("lmdGeneration") ||
    fieldKey.startsWith("spectraGeneration")
  ) {
    return visibleSteps.indexOf("kaderisasi");
  }

  return null;
}

export function buildPrefilledValues(profileData?: {
  userData: PublicUser;
  profile: Member;
}): OnboardingFormValues {
  if (!profileData) {
    return onboardingInitialValues;
  }

  const history = profileData.profile.education_history ?? [];

  const kaderisasiPath = profileData.profile.extra_data?.kaderisasi_path;
  const parsedBadges = profileData.profile.badges ?? [];
  const findBadgeNumber = (prefix: "SSC" | "LMD" | "SPECTRA") => {
    const badge = parsedBadges.find((item) => item === prefix || item.startsWith(`${prefix}-`));
    if (!badge) return null;
    const parts = badge.split("-");
    return parts[1] ? Number(parts[1]) || null : null;
  };
  const sscGeneration = kaderisasiPath?.ssc ?? findBadgeNumber("SSC");
  const lmdGeneration = kaderisasiPath?.lmd ?? findBadgeNumber("LMD");
  const spectraGeneration = kaderisasiPath?.spectra ?? findBadgeNumber("SPECTRA");
  const hasSscBadge = parsedBadges.some((item) => item === "SSC" || item.startsWith("SSC-"));
  const hasLmdBadge = parsedBadges.some((item) => item === "LMD" || item.startsWith("LMD-"));
  const hasSpectraBadge = parsedBadges.some(
    (item) => item === "SPECTRA" || item.startsWith("SPECTRA-"),
  );

  const inferredFromLevel = {
    ssc:
      profileData.profile.level !== undefined &&
      profileData.profile.level >= USER_LEVEL_ENUM.AKTIVIS,
    lmd:
      profileData.profile.level !== undefined &&
      profileData.profile.level >= USER_LEVEL_ENUM.KADER,
    spectra:
      profileData.profile.level !== undefined &&
      profileData.profile.level >= USER_LEVEL_ENUM.KADER_LANJUT,
  };

  const kaderisasiParticipation: OnboardingFormValues["kaderisasiParticipation"] = [
    ...(
      sscGeneration !== undefined &&
      sscGeneration !== null
        ? (["ssc"] as const)
        : hasSscBadge || inferredFromLevel.ssc
          ? (["ssc"] as const)
          : []
    ),
    ...(
      lmdGeneration !== undefined &&
      lmdGeneration !== null
        ? (["lmd"] as const)
        : hasLmdBadge || inferredFromLevel.lmd
          ? (["lmd"] as const)
          : []
    ),
    ...(
      spectraGeneration !== undefined &&
      spectraGeneration !== null
        ? (["spectra"] as const)
        : hasSpectraBadge || inferredFromLevel.spectra
          ? (["spectra"] as const)
          : []
    ),
  ];

  return {
    ...onboardingInitialValues,
    mode: "login",
    email: profileData.userData.email ?? "",
    name: profileData.profile.name ?? "",
    preferredName: profileData.profile.extra_data?.preferred_name ?? "",
    gender: profileData.profile.gender ?? onboardingInitialValues.gender,
    whatsapp: profileData.profile.whatsapp ?? "",
    instagram: profileData.profile.instagram ?? "",
    tiktok: profileData.profile.tiktok ?? "",
    linkedin: profileData.profile.linkedin ?? "",
    birthDate: profileData.profile.birth_date
      ? new Date(profileData.profile.birth_date)
      : null,
    provinceId: profileData.profile.province_id?.toString() ?? "",
    cityId: profileData.profile.city_id?.toString() ?? "",
    originProvinceId: profileData.profile.origin_province_id?.toString() ?? "",
    originCityId: profileData.profile.origin_city_id?.toString() ?? "",
    country: profileData.profile.country ?? "",
    educationHistory: history.map((entry) => ({
      degree: entry.degree,
      institution: entry.institution,
      faculty: entry.faculty,
      major: entry.major,
      intakeYear: entry.intake_year,
    })),
    workHistory: (profileData.profile.work_history ?? []).map((entry) => ({
      jobTitle: entry.job_title ?? "",
      company: entry.company ?? "",
      startYear: entry.start_year ?? null,
      endYear: entry.end_year ?? null,
    })),
    salmanActivityHistory:
      profileData.profile.extra_data?.salman_activity_history ?? [],
    currentActivityFocus:
      (profileData.profile.extra_data?.current_activity_focus as Array<
        OnboardingFormValues["currentActivityFocus"][number]
      >) ?? [],
    kaderisasiParticipation,
    sscGeneration,
    lmdGeneration,
    spectraGeneration,
  };
}

export function mergeWithPrefilledValues(
  prefilledValues: OnboardingFormValues,
  draftValues: OnboardingFormValues,
): OnboardingFormValues {
  return {
    ...prefilledValues,
    ...draftValues,
    email: draftValues.email || prefilledValues.email,
    name: draftValues.name || prefilledValues.name,
    preferredName: draftValues.preferredName || prefilledValues.preferredName,
    whatsapp: draftValues.whatsapp || prefilledValues.whatsapp,
    instagram: draftValues.instagram || prefilledValues.instagram,
    tiktok: draftValues.tiktok || prefilledValues.tiktok,
    linkedin: draftValues.linkedin || prefilledValues.linkedin,
    provinceId: draftValues.provinceId || prefilledValues.provinceId,
    cityId: draftValues.cityId || prefilledValues.cityId,
    originProvinceId:
      draftValues.originProvinceId || prefilledValues.originProvinceId,
    originCityId: draftValues.originCityId || prefilledValues.originCityId,
    country: draftValues.country || prefilledValues.country,
    birthDate: draftValues.birthDate || prefilledValues.birthDate,
    educationHistory:
      draftValues.educationHistory.length > 0
        ? draftValues.educationHistory
        : prefilledValues.educationHistory,
    workHistory:
      draftValues.workHistory.length > 0
        ? draftValues.workHistory
        : prefilledValues.workHistory,
    salmanActivityHistory:
      draftValues.salmanActivityHistory.length > 0
        ? draftValues.salmanActivityHistory
        : prefilledValues.salmanActivityHistory,
    currentActivityFocus:
      draftValues.currentActivityFocus.length > 0
        ? draftValues.currentActivityFocus
        : prefilledValues.currentActivityFocus,
  };
}

export function getSubmitMessageTitle(
  activeStepId: StepId,
  submitMessage: string | null,
) {
  if (
    activeStepId === "credentials" ||
    submitMessage?.includes("login terlebih dahulu") ||
    submitMessage?.includes("sudah terdaftar") ||
    submitMessage?.includes("Email")
  ) {
    return "Periksa akun Anda";
  }

  return "Belum berhasil";
}
