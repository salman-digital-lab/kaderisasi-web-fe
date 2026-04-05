import type { Member, PublicUser } from "@/types/model/members";
import type { Country } from "@/types/model/country";
import type { Province } from "@/types/model/province";

import type { OnboardingFormValues } from "@/features/onboarding/schema";

export type OnboardingFormProps = {
  provinceData: Province[];
  countryData: Country[];
  profileData?: {
    userData: PublicUser;
    profile: Member;
  };
};

export type DraftValues = Omit<OnboardingFormValues, "birthDate"> & {
  birthDate: string | null;
};

export type StepId =
  | "mode"
  | "credentials"
  | "personal"
  | "contact"
  | "address"
  | "education"
  | "salman"
  | "review";
