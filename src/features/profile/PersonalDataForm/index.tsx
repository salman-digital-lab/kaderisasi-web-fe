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
import {
  IconCheck,
  IconPencil,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
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

const normalizeYearValue = (value: number | string | null | undefined): number | undefined => {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsedValue = Number(value);
    return Number.isNaN(parsedValue) ? undefined : parsedValue;
  }

  return undefined;
};

const normalizeWorkHistory = (entries: WorkEntry[] | undefined): WorkEntry[] =>
  (entries ?? []).map((entry) => ({
    job_title: entry.job_title ?? "",
    company: entry.company ?? "",
    start_year: normalizeYearValue(entry.start_year),
    end_year: normalizeYearValue(entry.end_year),
  }));

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
  const [editingEducationIndex, setEditingEducationIndex] = useState<number | null>(null);
  const [editingWorkIndex, setEditingWorkIndex] = useState<number | null>(null);
  const [educationSnapshot, setEducationSnapshot] = useState<EducationEntry | null>(null);
  const [workSnapshot, setWorkSnapshot] = useState<WorkEntry | null>(null);
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
      work_history: normalizeWorkHistory(profileData?.profile.work_history),
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
    const normalizedWorkHistoryEntries = normalizeWorkHistory(rawFormData.work_history).filter((entry) =>
      entry.job_title.trim() !== "" ||
      entry.company.trim() !== "" ||
      entry.start_year !== undefined ||
      entry.end_year !== undefined,
    );

    const hasInvalidWorkYearRange = normalizedWorkHistoryEntries.some(
      (entry) =>
        entry.start_year !== undefined &&
        entry.end_year !== undefined &&
        entry.end_year < entry.start_year,
    );

    if (hasInvalidWorkYearRange) {
      showNotif("Tahun selesai tidak boleh lebih kecil dari tahun mulai", true);
      return;
    }

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
      work_history: normalizedWorkHistoryEntries,
    };

    try {
      const resp = await editProfile(finalFormData);
      if (resp) showNotif(resp.message);
    } catch (error: unknown) {
      if (error instanceof Error) showNotif(error.message, true);
    }
  };

  const getEducationSummary = (entry: EducationEntry) => {
    const degreeLabel =
      DEGREE_OPTIONS.find((option) => option.value === entry.degree)?.label || "-";
    const primary = [entry.institution, entry.major].filter(Boolean).join(" / ");
    return [degreeLabel, primary || "Data belum lengkap", entry.intake_year || "-"].join(" • ");
  };

  const getWorkSummary = (entry: WorkEntry) => {
    const primary = [entry.job_title, entry.company].filter(Boolean).join(" - ");
    const years =
      entry.start_year || entry.end_year
        ? `${entry.start_year ?? "?"} - ${entry.end_year ?? "Sekarang"}`
        : "Tahun belum diisi";
    return [primary || "Data belum lengkap", years].join(" • ");
  };

  const startEditEducation = (index: number) => {
    setEducationSnapshot({
      ...(form.getValues().education_history?.[index] ?? {
        degree: "bachelor",
        institution: "",
        major: "",
        intake_year: new Date().getFullYear(),
      }),
    });
    setEditingEducationIndex(index);
  };

  const cancelEditEducation = (index: number) => {
    if (educationSnapshot) {
      form.replaceListItem("education_history", index, educationSnapshot);
    }
    setEducationSnapshot(null);
    setEditingEducationIndex(null);
  };

  const saveEditEducation = () => {
    setEducationSnapshot(null);
    setEditingEducationIndex(null);
  };

  const startEditWork = (index: number) => {
    setWorkSnapshot({
      ...(form.getValues().work_history?.[index] ?? {
        job_title: "",
        company: "",
        start_year: undefined,
        end_year: undefined,
      }),
    });
    setEditingWorkIndex(index);
  };

  const cancelEditWork = (index: number) => {
    if (workSnapshot) {
      form.replaceListItem("work_history", index, workSnapshot);
    }
    setWorkSnapshot(null);
    setEditingWorkIndex(null);
  };

  const saveEditWork = () => {
    setWorkSnapshot(null);
    setEditingWorkIndex(null);
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
        <Paper key={index} withBorder p={editingEducationIndex === index ? "md" : "sm"} mb="sm" radius="md">
          <div>
            <Group justify="space-between" mb={editingEducationIndex !== index ? 4 : "xs"} align="center" wrap="nowrap">
              <Text size="sm" fw={500}>
                Pendidikan {index + 1}
              </Text>
              <Group gap={4}>
              {editingEducationIndex === index ? (
                <>
                  <ActionIcon
                    color="gray"
                    variant="filled"
                    size="md"
                    aria-label="Batal edit pendidikan"
                    onClick={() => cancelEditEducation(index)}
                  >
                    <IconX size={14} />
                  </ActionIcon>
                  <ActionIcon
                    variant="filled"
                    size="md"
                    aria-label="Simpan pendidikan"
                    onClick={saveEditEducation}
                  >
                    <IconCheck size={14} />
                  </ActionIcon>
                </>
              ) : (
                <>
                  <ActionIcon
                    variant="filled"
                    size="md"
                    aria-label="Edit pendidikan"
                    onClick={() => startEditEducation(index)}
                  >
                    <IconPencil size={14} />
                  </ActionIcon>
                  <ActionIcon
                    color="red"
                    variant="filled"
                    size="md"
                    aria-label="Hapus pendidikan"
                    onClick={() => {
                      form.removeListItem("education_history", index);
                      setEducationSnapshot(null);
                      setEditingEducationIndex((currentValue) => {
                        if (currentValue === index) return null;
                        if (currentValue !== null && currentValue > index) return currentValue - 1;
                        return currentValue;
                      });
                    }}
                  >
                    <IconTrash size={14} />
                  </ActionIcon>
                </>
              )}
            </Group>
            </Group>
            {editingEducationIndex !== index ? (
              <Text size="sm" c="dimmed" mb="xs">
                {getEducationSummary(
                  form.getValues().education_history?.[index] ?? {
                    degree: "bachelor",
                    institution: "",
                    major: "",
                    intake_year: new Date().getFullYear(),
                  },
                )}
              </Text>
            ) : null}
          </div>
          {editingEducationIndex === index ? (
            <>
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
            </>
          ) : null}
        </Paper>
      ))}
      <Button
        variant="light"
        size="xs"
        mt="xs"
        onClick={() => {
          form.insertListItem("education_history", {
            degree: "bachelor",
            institution: "",
            major: "",
            intake_year: new Date().getFullYear(),
          });
          setEducationSnapshot(null);
          setEditingEducationIndex(form.getValues().education_history.length - 1);
        }}
      >
        + Tambah Pendidikan
      </Button>

      <Divider my="xl" />

      {/* Work history */}
      <Title order={5} mb="sm">Riwayat Pekerjaan / Aktivitas</Title>
      {form.getValues().work_history?.map((_, index) => (
        <Paper key={index} withBorder p={editingWorkIndex === index ? "md" : "sm"} mb="sm" radius="md">
          <div>
            <Group justify="space-between" mb={editingWorkIndex !== index ? 4 : "xs"} align="center" wrap="nowrap">
              <Text size="sm" fw={500}>
                Pekerjaan / Aktivitas {index + 1}
              </Text>
              <Group gap={4}>
              {editingWorkIndex === index ? (
                <>
                  <ActionIcon
                    color="gray"
                    variant="filled"
                    size="md"
                    aria-label="Batal edit pekerjaan"
                    onClick={() => cancelEditWork(index)}
                  >
                    <IconX size={14} />
                  </ActionIcon>
                  <ActionIcon
                    variant="filled"
                    size="md"
                    aria-label="Simpan pekerjaan"
                    onClick={saveEditWork}
                  >
                    <IconCheck size={14} />
                  </ActionIcon>
                </>
              ) : (
                <>
                  <ActionIcon
                    variant="filled"
                    size="md"
                    aria-label="Edit pekerjaan"
                    onClick={() => startEditWork(index)}
                  >
                    <IconPencil size={14} />
                  </ActionIcon>
                  <ActionIcon
                    color="red"
                    variant="filled"
                    size="md"
                    aria-label="Hapus pekerjaan"
                    onClick={() => {
                      form.removeListItem("work_history", index);
                      setWorkSnapshot(null);
                      setEditingWorkIndex((currentValue) => {
                        if (currentValue === index) return null;
                        if (currentValue !== null && currentValue > index) return currentValue - 1;
                        return currentValue;
                      });
                    }}
                  >
                    <IconTrash size={14} />
                  </ActionIcon>
                </>
              )}
            </Group>
            </Group>
            {editingWorkIndex !== index ? (
              <Text size="sm" c="dimmed" mb="xs">
                {getWorkSummary(
                  form.getValues().work_history?.[index] ?? {
                    job_title: "",
                    company: "",
                    start_year: undefined,
                    end_year: undefined,
                  },
                )}
              </Text>
            ) : null}
          </div>
          {editingWorkIndex === index ? (
            <>
              <TextInput
                {...form.getInputProps(`work_history.${index}.job_title`)}
                key={form.key(`work_history.${index}.job_title`)}
                label="Posisi / Jabatan"
                placeholder="Contoh: Software Engineer"
                radius="md"
              />
              <TextInput
                {...form.getInputProps(`work_history.${index}.company`)}
                key={form.key(`work_history.${index}.company`)}
                label="Perusahaan / Organisasi"
                placeholder="Nama perusahaan atau organisasi"
                mt="xs"
                radius="md"
              />
              <NumberInput
                {...form.getInputProps(`work_history.${index}.start_year`)}
                key={form.key(`work_history.${index}.start_year`)}
                label="Tahun Mulai"
                placeholder="Contoh: 2022"
                mt="xs"
                radius="md"
                min={1900}
                max={new Date().getFullYear() + 10}
              />
              <NumberInput
                {...form.getInputProps(`work_history.${index}.end_year`)}
                key={form.key(`work_history.${index}.end_year`)}
                label="Tahun Selesai"
                placeholder="Kosongkan jika masih aktif"
                mt="xs"
                radius="md"
                min={1900}
                max={new Date().getFullYear() + 10}
              />
            </>
          ) : null}
        </Paper>
      ))}
      <Button
        variant="light"
        size="xs"
        mt="xs"
        onClick={() => {
          form.insertListItem("work_history", {
            job_title: "",
            company: "",
            start_year: undefined,
            end_year: undefined,
          });
          setWorkSnapshot(null);
          setEditingWorkIndex(form.getValues().work_history.length - 1);
        }}
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
