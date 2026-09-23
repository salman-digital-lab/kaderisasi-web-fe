import { getCustomFormByFeature } from "@/services/customForm";
import { getProfile } from "@/services/profile";
import { getCountries, getProvinces } from "@/services/profile.cache";
import type { GetCustomFormByFeatureReq } from "@/types/api/customForm";

export async function loadRegistrationForm(
  feature: GetCustomFormByFeatureReq,
  session: string,
  isGuest: boolean,
): Promise<{
  customForm: Awaited<ReturnType<typeof getCustomFormByFeature>>;
  profileData: Awaited<ReturnType<typeof getProfile>> | undefined;
  provinceData: Awaited<ReturnType<typeof getProvinces>> | undefined;
  countryData: Awaited<ReturnType<typeof getCountries>> | undefined;
}> {
  const formData = async () => {
    const customForm = await getCustomFormByFeature(feature);
    const fields =
      customForm?.form_schema.fields.find(
        (section) => section.section_name === "profile_data",
      )?.fields ?? [];
    const needsProvinces = fields.some(
      (field) =>
        !field.hidden &&
        ["province_id", "origin_province_id"].includes(field.key),
    );
    const needsCountries =
      !isGuest &&
      fields.some((field) => !field.hidden && field.key === "country");
    const [provinceData, countryData] = await Promise.all([
      needsProvinces ? getProvinces() : undefined,
      needsCountries ? getCountries() : undefined,
    ]);
    return { customForm, provinceData, countryData };
  };

  // Observe both failures immediately, while retaining form-error precedence.
  const [form, profile] = await Promise.allSettled([
    formData(),
    isGuest ? undefined : getProfile(session),
  ]);
  if (form.status === "rejected") throw form.reason;
  if (!form.value.customForm) return { ...form.value, profileData: undefined };
  if (profile.status === "rejected") throw profile.reason;
  return { ...form.value, profileData: profile.value };
}
