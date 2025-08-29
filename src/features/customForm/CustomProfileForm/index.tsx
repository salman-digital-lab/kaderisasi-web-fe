"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Select, Stack, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";

import { GENDER_OPTION } from "@/constants/form/profile";
import showNotif from "@/functions/common/notification";
import editProfile from "@/functions/server/editProfile";
import { Member, PublicUser } from "@/types/model/members";
import { Province } from "@/types/model/province";
import { University } from "@/types/model/university";
import UniversitySelect from "@/components/common/UniversitySelect";
import { CustomForm } from "@/types/api/customForm";

type CustomProfileFormProps = {
  provinces?: Province[];
  profileData?: {
    userData: PublicUser;
    profile: Member;
  };
  customForm: CustomForm;
  featureType: 'activity_registration' | 'club_registration';
  featureId: number;
};

export default function CustomProfileForm({
  provinces,
  profileData,
  customForm,
  featureType,
  featureId,
}: CustomProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Get profile fields from profile_data section
  const getProfileFields = () => {
    // Find the profile_data section
    const profileSection = customForm.form_schema.fields.find(
      (section) => section.section_name === "profile_data"
    );

    return profileSection?.fields || [];
  };

  const profileFields = getProfileFields();

  // Create initial values dynamically from profile_data fields
  const getInitialValues = () => {
    const initialValues: Record<string, any> = {};

    profileFields.forEach((field) => {
      const fieldKey = field.key;
      // Map field key to profile data if it exists
      switch (fieldKey) {
        case "name":
          initialValues[fieldKey] = profileData?.profile.name;
          break;
        case "gender":
          initialValues[fieldKey] = profileData?.profile.gender;
          break;
        case "personal_id":
          initialValues[fieldKey] = profileData?.profile.personal_id;
          break;
        case "province_id":
          initialValues[fieldKey] = profileData?.profile.province_id?.toString();
          break;
        case "line":
          initialValues[fieldKey] = profileData?.profile.line;
          break;
        case "instagram":
          initialValues[fieldKey] = profileData?.profile.instagram;
          break;
        case "tiktok":
          initialValues[fieldKey] = profileData?.profile.tiktok;
          break;
        case "linkedin":
          initialValues[fieldKey] = profileData?.profile.linkedin;
          break;
        case "whatsapp":
          initialValues[fieldKey] = profileData?.profile.whatsapp;
          break;
        case "university_id":
          initialValues[fieldKey] = profileData?.profile.university_id?.toString();
          break;
        case "major":
          initialValues[fieldKey] = profileData?.profile.major;
          break;
        case "intake_year":
          initialValues[fieldKey] = profileData?.profile.intake_year;
          break;
        default:
          initialValues[fieldKey] = "";
      }
    });

    return initialValues;
  };

  const form = useForm({
    mode: "uncontrolled",
    initialValues: getInitialValues(),
  });

  const renderField = (field: any) => {
    const fieldKey = field.key;
    const isRequired = field.required || false;

    switch (field.type) {
      case "text_input":
        return (
          <TextInput
            {...form.getInputProps(fieldKey)}
            key={form.key(fieldKey)}
            label={field.label}
            placeholder={field.placeholder || ""}
            required={isRequired}
            disabled={field.disabled || false}
            hidden={field.hidden || false}
          />
        );
      case "select":
        // Handle gender select with predefined options
        if (fieldKey === "gender") {
          return (
            <Select
              {...form.getInputProps(fieldKey)}
              key={form.key(fieldKey)}
              label={field.label}
              placeholder="Pilih jenis kelamin"
              data={GENDER_OPTION}
              required={isRequired}
              disabled={field.disabled || false}
              hidden={field.hidden || false}
            />
          );
        }
        // Handle other select types with options from schema
        return (
          <Select
            {...form.getInputProps(fieldKey)}
            key={form.key(fieldKey)}
            label={field.label}
            placeholder={field.placeholder || ""}
            data={field.options || []}
            required={isRequired}
            disabled={field.disabled || false}
            hidden={field.hidden || false}
          />
        );
      default:
        return null;
    }
  };

  const handleEditProfile = async (
    rawFormData: Partial<
      Omit<Member, "province_id" | "university_id"> & {
        province_id: string;
        university_id: string;
      }
    >,
  ) => {
    const finalFormData = {
      ...rawFormData,
      province_id: Number(rawFormData.province_id),
      university_id: Number(rawFormData.university_id),
    };

    try {
      setLoading(true);
      const resp = await editProfile(finalFormData);
      if (resp) {
        showNotif(resp.message);
        router.push(`/custom-form/register/${featureType}/${featureId}/custom-form`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) showNotif(error.message, true);
      if (typeof error === "string") showNotif(error, true);
    } finally {
      setLoading(false);
    }
  };



  return (
    <form onSubmit={form.onSubmit((val) => handleEditProfile(val))}>
      <Stack gap="lg">
        <Title order={3}>Form Data Diri </Title>
        {profileFields.map((field) => renderField(field))}
        <Button type="submit" loading={loading} disabled={loading}>
          Selanjutnya
        </Button>
      </Stack>
    </form>
  );
}
