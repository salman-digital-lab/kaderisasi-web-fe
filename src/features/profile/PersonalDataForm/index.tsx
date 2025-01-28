"use client";

import {
  Button,
  Fieldset,
  NumberInput,
  Paper,
  Select,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";

import { GENDER_OPTION } from "@/constants/form/profile";
import showNotif from "@/functions/common/notification";
import editProfile from "@/functions/server/editProfile";
import { PublicUser } from "@/types/model/members";
import { Member } from "@/types/model/members";
import { Province } from "@/types/model/province";
import { University } from "@/types/model/university";
import UniversitySelect from "@/components/common/UniversitySelect";

type PersonalDataFormProps = {
  provinces?: Province[];
  profileData?: {
    userData: PublicUser;
    profile: Member;
  };
};

export default function PersonalDataForm({
  provinces,
  profileData,
}: PersonalDataFormProps) {
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
      province_id: rawFormData.province_id
        ? Number(rawFormData.province_id)
        : undefined,
      university_id: rawFormData.university_id
        ? Number(rawFormData.university_id)
        : undefined,
    };

    try {
      const resp = await editProfile(finalFormData);
      if (resp) showNotif(resp.message);
    } catch (error: unknown) {
      if (error instanceof Error) showNotif(error.message, true);
    }
  };

  return (
    <Paper radius="md" withBorder p="lg">
      <form onSubmit={form.onSubmit((val) => handleEditProfile(val))}>
        <Fieldset legend="Personal">
          <TextInput
            {...form.getInputProps("name")}
            key={form.key("name")}
            label="Nama Lengkap"
            placeholder="Nama Lengkap"
          />
          <Select
            {...form.getInputProps("gender")}
            key={form.key("gender")}
            label="Jenis Kelamin"
            placeholder="Pilih Jenis Kelamin"
            data={GENDER_OPTION}
            mt="md"
          />
          <TextInput
            {...form.getInputProps("email")}
            key={form.key("email")}
            disabled
            label="Alamat Email"
            placeholder="Alamat Email"
            mt="md"
          />
          <TextInput
            {...form.getInputProps("personal_id")}
            key={form.key("personal_id")}
            label="Nomor Identitas"
            placeholder="Nomor Identitas"
            mt="md"
          />
        </Fieldset>
        <Fieldset legend="Domisili" mt="md">
          <Select
            {...form.getInputProps("province_id")}
            key={form.key("province_id")}
            label="Provinsi"
            placeholder="Pilih Provinsi Anda"
            data={provinces?.map((province) => ({
              label: province.name,
              value: province.id.toString(),
            }))}
            mt="md"
            searchable
          />
        </Fieldset>
        <Fieldset legend="Sosial Media" mt="md">
          <TextInput
            {...form.getInputProps("line")}
            key={form.key("line")}
            label="ID Line"
            placeholder="ID Line"
          />
          <TextInput
            {...form.getInputProps("whatsapp")}
            key={form.key("whatsapp")}
            label="Nomor Whatsapp"
            placeholder="Nomor Whatsapp"
            mt="md"
          />
          <TextInput
            {...form.getInputProps("linkedin")}
            key={form.key("linkedin")}
            label="Akun Linkedin"
            placeholder="Akun Linkedin"
            mt="md"
          />
          <TextInput
            {...form.getInputProps("instagram")}
            key={form.key("instagram")}
            label="Akun Instagram"
            placeholder="Akun Instagram"
            mt="md"
          />
          <TextInput
            {...form.getInputProps("tiktok")}
            key={form.key("tiktok")}
            label="Akun Tiktok"
            placeholder="Akun Tiktok"
            mt="md"
          />
        </Fieldset>
        <Fieldset legend="Pendidikan" mt="md">
          <UniversitySelect
            {...form.getInputProps("university_id")}
            key={form.key("university_id")}
            label="Universitas"
            placeholder="Pilih Universitas Anda"
          />
          <TextInput
            {...form.getInputProps("major")}
            key={form.key("major")}
            label="Jurusan"
            placeholder="Jurusan"
            mt="md"
          />
          <NumberInput
            {...form.getInputProps("intake_year")}
            key={form.key("intake_year")}
            label="Angkatan"
            placeholder="Angkatan"
            mt="md"
          />
        </Fieldset>

        <Button type="submit" mt="md" loading={form.submitting}>
          Ubah Data Diri
        </Button>
      </form>
    </Paper>
  );
}
