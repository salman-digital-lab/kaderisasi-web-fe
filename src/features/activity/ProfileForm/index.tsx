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
import { MandatoryProfileData } from "@/types/model/activity";
import UniversitySelect from "@/components/common/UniversitySelect";

type ProfileFormProps = {
  provinces?: Province[];
  profileData?: {
    userData: PublicUser;
    profile: Member;
  };
  mandatoryProfileData: MandatoryProfileData[];
  slug: string;
};

export default function ProfileForm({
  provinces,
  profileData,
  mandatoryProfileData,
  slug,
}: ProfileFormProps) {
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

  const renderForm = (type: { name: string; required: boolean }) => {
    switch (type.name) {
      case "gender":
        return (
          <Select
            {...form.getInputProps("gender")}
            key={form.key("gender")}
            label="Jenis Kelamin"
            placeholder="Pilih Jenis Kelamin"
            data={GENDER_OPTION}
            required={type.required}
          />
        );
      case "personal_id":
        return (
          <TextInput
            {...form.getInputProps("personal_id")}
            key={form.key("personal_id")}
            label="Nomor Identitas (KTP/NIM)"
            placeholder="Cth: 1234567890123456"
            required={type.required}
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
            required={type.required}
          />
        );
      case "line":
        return (
          <TextInput
            {...form.getInputProps("line")}
            key={form.key("line")}
            label="ID Line"
            placeholder="ID Line"
            required={type.required}
          />
        );
      case "whatsapp":
        return (
          <TextInput
            {...form.getInputProps("whatsapp")}
            key={form.key("whatsapp")}
            label="Nomor Whatsapp"
            placeholder="Nomor Whatsapp"
            required={type.required}
          />
        );
      case "linkedin":
        return (
          <TextInput
            {...form.getInputProps("linkedin")}
            key={form.key("linkedin")}
            label="Akun Linkedin"
            placeholder="Akun Linkedin"
            required={type.required}
          />
        );
      case "instagram":
        return (
          <TextInput
            {...form.getInputProps("instagram")}
            key={form.key("instagram")}
            label="Akun Instagram"
            placeholder="Akun Instagram"
            required={type.required}
          />
        );
      case "tiktok":
        return (
          <TextInput
            {...form.getInputProps("tiktok")}
            key={form.key("tiktok")}
            label="Akun Tiktok"
            placeholder="Akun Tiktok"
            required={type.required}
          />
        );

      case "university_id":
        return (
          <UniversitySelect
            {...form.getInputProps("university_id")}
            key={form.key("university_id")}
            label="Universitas"
            placeholder="Pilih Universitas Anda"
            required={type.required}
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
            placeholder="Jurusan"
            required={type.required}
          />
        );
      case "intake_year":
        return (
          <TextInput
            {...form.getInputProps("intake_year")}
            key={form.key("intake_year")}
            label="Angkatan"
            placeholder="Angkatan"
            required={type.required}
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
        router.push(`/activity/register/${slug}/activity-form`);
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
        <TextInput
          {...form.getInputProps("name")}
          key={form.key("name")}
          label="Nama Lengkap"
          placeholder="Nama Lengkap"
          required
        />
        {mandatoryProfileData.map((item) => renderForm(item))}
        <Button type="submit" loading={loading} disabled={loading}>
          Selanjutnya
        </Button>
      </Stack>
    </form>
  );
}
