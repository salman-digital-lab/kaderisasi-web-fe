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
import UniversitySelect from "@/components/common/UniversitySelect";

type ClubProfileFormProps = {
  provinces?: Province[];
  profileData?: {
    userData: PublicUser;
    profile: Member;
  };
  mandatoryProfileData: string[]; // Simplified for clubs
  clubId: string;
  formId: string;
};

export default function ClubProfileForm({
  provinces,
  profileData,
  mandatoryProfileData,
  clubId,
  formId,
}: ClubProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: profileData?.profile.name,
      gender: profileData?.profile.gender,
      email: profileData?.userData.email,
      personal_id: profileData?.profile.personal_id,
      province_id: profileData?.profile.province_id?.toString(),
      line: profileData?.profile.line,
      instagram: profileData?.profile.instagram,
      tiktok: profileData?.profile.tiktok,
      linkedin: profileData?.profile.linkedin,
      whatsapp: profileData?.profile.whatsapp,
      university_id: profileData?.profile.university_id?.toString(),
      major: profileData?.profile.major,
      intake_year: profileData?.profile.intake_year,
    },
  });

  const renderForm = (fieldName: string) => {
    const isRequired = mandatoryProfileData.includes(fieldName);

    switch (fieldName) {
      case "personal_id":
        return (
          <TextInput
            {...form.getInputProps("personal_id")}
            key={form.key("personal_id")}
            label="Nomor Identitas (KTP/NIM)"
            placeholder="Cth: 1234567890123456"
            required={isRequired}
          />
        );
      case "province_id":
        return (
          <Select
            {...form.getInputProps("province_id")}
            key={form.key("province_id")}
            label="Provinsi"
            placeholder="Pilih Provinsi Anda"
            data={provinces?.map((province) => ({
              label: province.name,
              value: province.id.toString(),
            }))}
            searchable
            required={isRequired}
          />
        );
      case "line":
        return (
          <TextInput
            {...form.getInputProps("line")}
            key={form.key("line")}
            label="ID Line"
            placeholder="Cth: @salman_kaderisasi"
            required={isRequired}
          />
        );
      case "whatsapp":
        return (
          <TextInput
            {...form.getInputProps("whatsapp")}
            key={form.key("whatsapp")}
            label="Nomor Whatsapp Aktif"
            description="Cth: 6281234567890. Pastikan nomor whatsapp kamu aktif."
            placeholder="Cth: 6281234567890"
            required={isRequired}
          />
        );
      case "linkedin":
        return (
          <TextInput
            {...form.getInputProps("linkedin")}
            key={form.key("linkedin")}
            label="Akun Linkedin"
            placeholder="Akun Linkedin"
            required={isRequired}
          />
        );
      case "instagram":
        return (
          <TextInput
            {...form.getInputProps("instagram")}
            key={form.key("instagram")}
            label="Akun Instagram"
            placeholder="Cth: @salman_kaderisasi"
            required={isRequired}
          />
        );
      case "tiktok":
        return (
          <TextInput
            {...form.getInputProps("tiktok")}
            key={form.key("tiktok")}
            label="Akun Tiktok"
            placeholder="Cth: @salman_kaderisasi"
            required={isRequired}
          />
        );
      case "university_id":
        return (
          <UniversitySelect
            {...form.getInputProps("university_id")}
            key={form.key("university_id")}
            label="Universitas"
            placeholder="Pilih Universitas Anda"
            required={isRequired}
            showedValue={profileData?.profile.university?.name}
            allowDeselect={false}
          />
        );
      case "major":
        return (
          <TextInput
            {...form.getInputProps("major")}
            key={form.key("major")}
            label="Jurusan"
            placeholder="Cth: Teknik Informatika"
            required={isRequired}
          />
        );
      case "intake_year":
        return (
          <TextInput
            {...form.getInputProps("intake_year")}
            key={form.key("intake_year")}
            label="Angkatan"
            placeholder="Cth: 2024"
            required={isRequired}
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
      province_id: rawFormData.province_id ? Number(rawFormData.province_id) : undefined,
      university_id: rawFormData.university_id ? Number(rawFormData.university_id) : undefined,
    };

    try {
      setLoading(true);
      const resp = await editProfile(finalFormData);
      if (resp) {
        showNotif(resp.message);
        router.push(`/custom-form/register/club/${clubId}/${formId}/custom-form`);
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
        <Title order={3}>Form Data Diri</Title>

        <TextInput
          {...form.getInputProps("name")}
          key={form.key("name")}
          label="Nama Lengkap"
          placeholder="Nama Lengkap"
          required
        />

        <Select
          {...form.getInputProps("gender")}
          key={form.key("gender")}
          label="Jenis Kelamin"
          placeholder="Pilih Jenis Kelamin"
          data={GENDER_OPTION}
          required
        />

        {/* Render mandatory profile fields */}
        {mandatoryProfileData.map((fieldName) => renderForm(fieldName))}

        <Button type="submit" loading={loading} disabled={loading}>
          Selanjutnya
        </Button>
      </Stack>
    </form>
  );
}
