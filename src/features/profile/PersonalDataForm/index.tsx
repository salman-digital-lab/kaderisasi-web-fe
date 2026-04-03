"use client";

import {
  ActionIcon,
  Button,
  Divider,
  Group,
  MultiSelect,
  NumberInput,
  Paper,
  Select,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import { useState, useEffect } from "react";

import { GENDER_OPTION } from "@/constants/form/profile";
import showNotif from "@/functions/common/notification";
import editProfile from "@/functions/server/editProfile";
import { ExtraData, Member, PublicUser, WorkEntry, EducationEntry } from "@/types/model/members";
import { Province } from "@/types/model/province";
import type { City } from "@/types/model/city";
import type { Country } from "@/types/model/country";
import { toISODateString } from "@/utils/dateUtils";
import UniversityNameSelect from "@/components/common/UniversityNameSelect";
import { getCitiesByProvince } from "@/services/profile";

const CURRENT_ACTIVITY_FOCUS_OPTIONS = [
  { value: "professional", label: "Profesional" },
  { value: "academic", label: "Akademik" },
  { value: "social", label: "Sosial" },
  { value: "entrepreneur", label: "Wirausaha" },
  { value: "politics", label: "Politik" },
];

const DEGREE_OPTIONS = [
  { value: "bachelor", label: "S1" },
  { value: "master", label: "S2" },
  { value: "doctoral", label: "S3" },
];

type PersonalDataFormProps = {
  provinces?: Province[];
  countries?: Country[];
  profileData?: {
    userData: PublicUser;
    profile: Member;
  };
};

export default function PersonalDataForm({
  provinces,
  countries,
  profileData,
}: PersonalDataFormProps) {
  const [currentCities, setCurrentCities] = useState<City[]>([]);
  const [originCities, setOriginCities] = useState<City[]>([]);
  const [currentCityId, setCurrentCityId] = useState<string | null>(
    profileData?.profile.city_id?.toString() ?? null,
  );
  const [originCityId, setOriginCityId] = useState<string | null>(
    profileData?.profile.origin_city_id?.toString() ?? null,
  );

  useEffect(() => {
    if (profileData?.profile.province_id) {
      getCitiesByProvince(profileData.profile.province_id).then(setCurrentCities);
    }
    if (profileData?.profile.origin_province_id) {
      getCitiesByProvince(profileData.profile.origin_province_id).then(setOriginCities);
    }
  }, [profileData]);

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
      birth_date: profileData?.profile.birth_date
        ? new Date(profileData.profile.birth_date)
        : undefined,
      origin_province_id: profileData?.profile.origin_province_id?.toString(),
      country: profileData?.profile.country,
      education_history: (profileData?.profile.education_history ?? []) as EducationEntry[],
      work_history: (profileData?.profile.work_history ?? []) as WorkEntry[],
      extra_data: {
        preferred_name: profileData?.profile.extra_data?.preferred_name ?? "",
        salman_activity_history:
          profileData?.profile.extra_data?.salman_activity_history ?? [],
        current_activity_focus:
          profileData?.profile.extra_data?.current_activity_focus ?? [],
      } as ExtraData,
    },
  });

  const handleEditProfile = async (
    rawFormData: Partial<
      Omit<Member, "province_id" | "origin_province_id" | "birth_date"> & {
        province_id: string;
        origin_province_id: string;
        birth_date: Date | undefined;
      }
    >,
  ) => {
    const finalFormData = {
      ...rawFormData,
      province_id: rawFormData.province_id
        ? Number(rawFormData.province_id)
        : undefined,
      city_id: currentCityId ? Number(currentCityId) : undefined,
      origin_province_id: rawFormData.origin_province_id
        ? Number(rawFormData.origin_province_id)
        : undefined,
      origin_city_id: originCityId ? Number(originCityId) : undefined,
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
      {/* Personal */}
      <Title order={5} mb="sm">Personal</Title>
      <TextInput
        {...form.getInputProps("name")}
        key={form.key("name")}
        label="Nama Lengkap"
        placeholder="Nama Lengkap"
        radius="md"
      />
      <TextInput
        {...form.getInputProps("extra_data.preferred_name")}
        key={form.key("extra_data.preferred_name")}
        label="Nama Panggilan"
        placeholder="Nama yang sering dipakai"
        mt="md"
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

      <Divider my="xl" />

      {/* Domicile */}
      <Title order={5} mb="sm">Domisili Saat Ini</Title>
      <Select
        {...form.getInputProps("province_id")}
        key={form.key("province_id")}
        label="Provinsi"
        placeholder="Pilih Provinsi"
        data={provinces?.map((province) => ({
          label: province.name,
          value: province.id.toString(),
        }))}
        searchable
        radius="md"
        onChange={(val) => {
          form.getInputProps("province_id").onChange(val);
          setCurrentCityId(null);
          setCurrentCities([]);
          if (val) {
            getCitiesByProvince(Number(val)).then(setCurrentCities);
          }
        }}
      />
      <Select
        label="Kota / Kabupaten"
        placeholder="Pilih Kota / Kabupaten"
        data={currentCities.map((c) => ({ label: c.name, value: c.id.toString() }))}
        value={currentCityId}
        onChange={setCurrentCityId}
        searchable
        disabled={currentCities.length === 0}
        mt="md"
        radius="md"
      />
      <Select
        {...form.getInputProps("country")}
        key={form.key("country")}
        label="Negara"
        placeholder="Pilih negara domisili"
        data={countries?.map((c) => ({ label: c.name, value: c.name })) ?? []}
        searchable
        mt="md"
        radius="md"
      />

      <Divider my="xl" />

      {/* Origin */}
      <Title order={5} mb="sm">Asal Daerah</Title>
      <Select
        {...form.getInputProps("origin_province_id")}
        key={form.key("origin_province_id")}
        label="Provinsi Asal"
        placeholder="Pilih Provinsi Asal"
        data={provinces?.map((province) => ({
          label: province.name,
          value: province.id.toString(),
        }))}
        searchable
        radius="md"
        onChange={(val) => {
          form.getInputProps("origin_province_id").onChange(val);
          setOriginCityId(null);
          setOriginCities([]);
          if (val) {
            getCitiesByProvince(Number(val)).then(setOriginCities);
          }
        }}
      />
      <Select
        label="Kota / Kabupaten Asal"
        placeholder="Pilih Kota / Kabupaten Asal"
        data={originCities.map((c) => ({ label: c.name, value: c.id.toString() }))}
        value={originCityId}
        onChange={setOriginCityId}
        searchable
        disabled={originCities.length === 0}
        mt="md"
        radius="md"
      />

      <Divider my="xl" />

      {/* Social media */}
      <Title order={5} mb="sm">Sosial Media</Title>
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
        label="Nomor Whatsapp Aktif"
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

      <Divider my="xl" />

      {/* Education history */}
      <Title order={5} mb="sm">Riwayat Pendidikan</Title>
      {form.getValues().education_history?.map((_, index) => (
        <Paper key={index} withBorder p="sm" mb="sm" radius="md">
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={500}>
              Pendidikan {index + 1}
            </Text>
            <ActionIcon
              color="red"
              variant="subtle"
              size="sm"
              onClick={() =>
                form.removeListItem("education_history", index)
              }
            >
              ×
            </ActionIcon>
          </Group>
          <Select
            {...form.getInputProps(`education_history.${index}.degree`)}
            key={form.key(`education_history.${index}.degree`)}
            label="Jenjang"
            data={DEGREE_OPTIONS}
            radius="md"
          />
          <UniversityNameSelect
            {...form.getInputProps(`education_history.${index}.institution`)}
            key={form.key(`education_history.${index}.institution`)}
            label="Institusi"
            placeholder="Cari universitas"
            mt="xs"
            radius="md"
          />
          <TextInput
            {...form.getInputProps(`education_history.${index}.major`)}
            key={form.key(`education_history.${index}.major`)}
            label="Jurusan"
            placeholder="Jurusan"
            mt="xs"
            radius="md"
          />
          <NumberInput
            {...form.getInputProps(`education_history.${index}.intake_year`)}
            key={form.key(`education_history.${index}.intake_year`)}
            label="Tahun Masuk"
            placeholder="Tahun masuk"
            mt="xs"
            radius="md"
          />
        </Paper>
      ))}
      <Button
        variant="light"
        size="xs"
        mt="xs"
        onClick={() =>
          form.insertListItem("education_history", {
            degree: "bachelor",
            institution: "",
            major: "",
            intake_year: new Date().getFullYear(),
          })
        }
      >
        + Tambah Pendidikan
      </Button>

      <Divider my="xl" />

      {/* Work history */}
      <Title order={5} mb="sm">Riwayat Pekerjaan / Aktivitas</Title>
      {form.getValues().work_history?.map((_, index) => (
        <Paper key={index} withBorder p="sm" mb="sm" radius="md">
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={500}>
              Pekerjaan / Aktivitas {index + 1}
            </Text>
            <ActionIcon
              color="red"
              variant="subtle"
              size="sm"
              onClick={() => form.removeListItem("work_history", index)}
            >
              ×
            </ActionIcon>
          </Group>
          <TextInput
            {...form.getInputProps(`work_history.${index}.job`)}
            key={form.key(`work_history.${index}.job`)}
            label="Jabatan"
            placeholder="Jabatan saat ini"
            radius="md"
          />
          <TextInput
            {...form.getInputProps(`work_history.${index}.organization`)}
            key={form.key(`work_history.${index}.organization`)}
            label="Organisasi / Institusi"
            placeholder="Nama organisasi"
            mt="xs"
            radius="md"
          />
          <TextInput
            {...form.getInputProps(`work_history.${index}.role`)}
            key={form.key(`work_history.${index}.role`)}
            label="Peran"
            placeholder="Peran Anda"
            mt="xs"
            radius="md"
          />
          <TextInput
            {...form.getInputProps(`work_history.${index}.description`)}
            key={form.key(`work_history.${index}.description`)}
            label="Deskripsi (opsional)"
            placeholder="Deskripsi singkat"
            mt="xs"
            radius="md"
          />
        </Paper>
      ))}
      <Button
        variant="light"
        size="xs"
        mt="xs"
        onClick={() =>
          form.insertListItem("work_history", {
            job: "",
            organization: "",
            role: "",
            description: "",
          })
        }
      >
        + Tambah Pekerjaan / Aktivitas
      </Button>

      <Divider my="xl" />

      {/* Activity focus */}
      <Title order={5} mb="sm">Fokus Aktivitas Saat Ini</Title>
      <MultiSelect
        {...form.getInputProps("extra_data.current_activity_focus")}
        key={form.key("extra_data.current_activity_focus")}
        label="Bidang Fokus"
        placeholder="Pilih fokus aktivitas"
        data={CURRENT_ACTIVITY_FOCUS_OPTIONS}
        radius="md"
      />

      <Button
        type="submit"
        size="md"
        radius="md"
        loading={form.submitting}
        fullWidth
        style={{ marginTop: "2rem" }}
      >
        Ubah Data Diri
      </Button>
    </form>
    </Paper>
  );
}
