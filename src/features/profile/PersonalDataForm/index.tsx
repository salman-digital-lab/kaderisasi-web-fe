"use client";

import {
  Button,
  Fieldset,
  NumberInput,
  Select,
  TextInput,
  Paper,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";

import { GENDER_OPTION } from "@/constants/form/profile";
import showNotif from "@/functions/common/notification";
import editProfile from "@/functions/server/editProfile";
import { PublicUser } from "@/types/model/members";
import { Member } from "@/types/model/members";
import { Province } from "@/types/model/province";
import UniversitySelect from "@/components/common/UniversitySelect";
import { toISODateString } from "@/utils/dateUtils";

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
      birth_date: profileData?.profile.birth_date
        ? new Date(profileData.profile.birth_date)
        : undefined,
    },
  });

  const handleEditProfile = async (
    rawFormData: Partial<
      Omit<Member, "province_id" | "university_id" | "birth_date"> & {
        province_id: string;
        university_id: string;
        birth_date: Date | undefined;
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
      birth_date: toISODateString(rawFormData.birth_date),
    };

    try {
      const resp = await editProfile(finalFormData);
      if (resp) showNotif(resp.message);
    } catch (error: unknown) {
      if (error instanceof Error) showNotif(error.message, true);
    }
  };

  return (
    <Paper p={{ base: "md", sm: "lg" }} radius="md" withBorder>
      <form onSubmit={form.onSubmit((val) => handleEditProfile(val))}>
        <Fieldset
          legend="Personal"
          mb="xl"
          p="md"
          style={{ border: "1px solid #e9ecef", borderRadius: "8px" }}
        >
          <TextInput
            {...form.getInputProps("name")}
            key={form.key("name")}
            label="Nama Lengkap"
            placeholder="Nama Lengkap"
            radius="md"
          />
          <Select
            {...form.getInputProps("gender")}
            key={form.key("gender")}
            label="Jenis Kelamin"
            placeholder="Pilih Jenis Kelamin"
            data={GENDER_OPTION}
            mt="md"
            radius="md"
          />
          <TextInput
            {...form.getInputProps("email")}
            key={form.key("email")}
            disabled
            label="Alamat Email"
            placeholder="Alamat Email"
            mt="md"
            radius="md"
          />
          <TextInput
            {...form.getInputProps("personal_id")}
            key={form.key("personal_id")}
            label="Nomor Identitas"
            placeholder="Nomor Identitas"
            mt="md"
            radius="md"
          />
          <DateInput
            {...form.getInputProps("birth_date")}
            key={form.key("birth_date")}
            label="Tanggal Lahir"
            placeholder="Pilih tanggal lahir"
            valueFormat="YYYY-MM-DD"
            mt="md"
            radius="md"
          />
        </Fieldset>

        <Fieldset
          legend="Domisili"
          mb="xl"
          p="md"
          style={{ border: "1px solid #e9ecef", borderRadius: "8px" }}
        >
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
            radius="md"
          />
        </Fieldset>

        <Fieldset
          legend="Sosial Media"
          mb="xl"
          p="md"
          style={{ border: "1px solid #e9ecef", borderRadius: "8px" }}
        >
          <TextInput
            {...form.getInputProps("line")}
            key={form.key("line")}
            label="ID Line"
            placeholder="ID Line"
            radius="md"
          />
          <TextInput
            {...form.getInputProps("whatsapp")}
            key={form.key("whatsapp")}
            label="Nomor Whatsapp Aktif "
            description="Cth: 6281234567890. Pastikan nomor whatsapp kamu aktif."
            placeholder="Cth: 6281234567890"
            mt="md"
            radius="md"
          />
          <TextInput
            {...form.getInputProps("linkedin")}
            key={form.key("linkedin")}
            label="Akun Linkedin"
            placeholder="Akun Linkedin"
            mt="md"
            radius="md"
          />
          <TextInput
            {...form.getInputProps("instagram")}
            key={form.key("instagram")}
            label="Akun Instagram"
            placeholder="Akun Instagram"
            mt="md"
            radius="md"
          />
          <TextInput
            {...form.getInputProps("tiktok")}
            key={form.key("tiktok")}
            label="Akun Tiktok"
            placeholder="Akun Tiktok"
            mt="md"
            radius="md"
          />
        </Fieldset>

        <Fieldset
          legend="Pendidikan"
          mb="xl"
          p="md"
          style={{ border: "1px solid #e9ecef", borderRadius: "8px" }}
        >
          <UniversitySelect
            {...form.getInputProps("university_id")}
            key={form.key("university_id")}
            label="Universitas"
            placeholder="Pilih Universitas Anda"
            showedValue={profileData?.profile.university?.name}
          />
          <TextInput
            {...form.getInputProps("major")}
            key={form.key("major")}
            label="Jurusan"
            placeholder="Jurusan"
            mt="md"
            radius="md"
          />
          <NumberInput
            {...form.getInputProps("intake_year")}
            key={form.key("intake_year")}
            label="Angkatan"
            placeholder="Angkatan"
            mt="md"
            radius="md"
          />
        </Fieldset>

        <Button
          type="submit"
          size="md"
          radius="md"
          loading={form.submitting}
          fullWidth
          style={{ marginTop: "1rem" }}
        >
          Ubah Data Diri
        </Button>
      </form>
    </Paper>
  );
}
