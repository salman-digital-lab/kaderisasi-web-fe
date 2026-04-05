"use client";

import { useState, useRef, useEffect, type RefObject } from "react";
import {
  ActionIcon,
  Button,
  NumberInput,
  Paper,
  Stack,
  TextInput,
  Select,
  Group,
  Title,
  Modal,
  Text,
  Divider,
} from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import { CustomFormField } from "@/types/api/customForm";
import { EducationEntry, Member, PublicUser } from "@/types/model/members";
import { Province } from "@/types/model/province";
import type { City } from "@/types/model/city";
import type { Country } from "@/types/model/country";
import { GENDER_OPTION } from "@/constants/form/profile";
import editProfile from "@/functions/server/editProfile";
import showNotif from "@/functions/common/notification";
import { toISODateString } from "@/utils/dateUtils";
import UniversityNameSelect from "@/components/common/UniversityNameSelect";
import { getCitiesByProvince } from "@/services/profile";

const DEGREE_OPTIONS = [
  { value: "bachelor", label: "S1 (Sarjana)" },
  { value: "master", label: "S2 (Magister)" },
  { value: "doctoral", label: "S3 (Doktor)" },
];

const DEGREE_LABEL: Record<string, string> = {
  bachelor: "S1",
  master: "S2",
  doctoral: "S3",
};

const BLANK_EDUCATION: EducationEntry = {
  degree: "bachelor",
  institution: "",
  major: "",
  intake_year: new Date().getFullYear(),
};

type CustomFormProfileSectionProps = {
  profileFields: CustomFormField[];
  profileData?: {
    userData: PublicUser;
    profile: Member;
  };
  provinceData?: Province[];
  countryData?: Country[];
  onSubmit: (data?: Record<string, any>) => void;
  onLoadingChange?: (value: boolean) => void;
  loading?: boolean;
  isSingleSection?: boolean;
  formRef?: RefObject<HTMLFormElement | null>;
};

export default function CustomFormProfileSection({
  profileFields,
  profileData,
  provinceData,
  countryData,
  onSubmit,
  onLoadingChange,
  loading = false,
  isSingleSection = false,
  formRef,
}: CustomFormProfileSectionProps) {
  const [confirmModalOpened, setConfirmModalOpened] = useState(false);
  const [pendingValues, setPendingValues] = useState<Record<string, any> | null>(null);

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

  const history = profileData?.profile?.education_history ?? [];

  // Default to last item (= current education) pre-selected
  const initialCeKey = history.length > 0 ? String(history.length - 1) : null;

  // current_education state — ref keeps validate closure fresh
  const ceSelectedKeyRef = useRef<string | null>(initialCeKey);
  const [ceSelectedKey, setCeSelectedKey] = useState<string | null>(initialCeKey);
  const [ceFormKey, setCeFormKey] = useState(0);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  // local copy of history for in-place display updates before main form submit
  const [localHistory, setLocalHistory] = useState<EducationEntry[]>(history);

  const updateCeKey = (val: string | null) => {
    ceSelectedKeyRef.current = val;
    setCeSelectedKey(val);
  };

  const handleCeChange = (val: string, keepEdit = false) => {
    if (!keepEdit) setEditingIndex(null);
    if (val === "new") {
      updateCeKey("new");
      setCeFormKey((k) => k + 1);
      form.setFieldValue("current_education", { ...BLANK_EDUCATION });
    } else {
      updateCeKey(val);
      // use localHistory so previously confirmed edits are preserved
      form.setFieldValue("current_education", localHistory[Number(val)]);
    }
  };

  const handleToggleEdit = (i: number) => {
    if (editingIndex === i) {
      setEditingIndex(null);
    } else {
      setEditingIndex(i);
      handleCeChange(String(i), true);
    }
  };

  const handleConfirmEdit = () => {
    if (editingIndex === null) return;
    const edited = form.getValues().current_education as EducationEntry;
    setLocalHistory((prev) =>
      prev.map((e, i) => (i === editingIndex ? { ...edited } : e)),
    );
    setEditingIndex(null);
  };


  // Build initial values from profile data
  const initialValues: Record<string, any> = {};

  profileFields.forEach((field) => {
    const profile = profileData?.profile;
    const userData = profileData?.userData;

    switch (field.key) {
      case "name":
        initialValues[field.key] = profile?.name || "";
        break;
      case "gender":
        initialValues[field.key] = profile?.gender || "";
        break;
      case "email":
        initialValues[field.key] = userData?.email || "";
        break;
      case "personal_id":
        initialValues[field.key] = profile?.personal_id || "";
        break;
      case "province_id":
        initialValues[field.key] = profile?.province_id?.toString() || "";
        break;
      case "city_id":
        initialValues[field.key] = profile?.city_id?.toString() || "";
        break;
      case "origin_province_id":
        initialValues[field.key] = profile?.origin_province_id?.toString() || "";
        break;
      case "origin_city_id":
        initialValues[field.key] = profile?.origin_city_id?.toString() || "";
        break;
      case "country":
        initialValues[field.key] = profile?.country || "";
        break;
      case "line":
        initialValues[field.key] = profile?.line || "";
        break;
      case "instagram":
        initialValues[field.key] = profile?.instagram || "";
        break;
      case "tiktok":
        initialValues[field.key] = profile?.tiktok || "";
        break;
      case "linkedin":
        initialValues[field.key] = profile?.linkedin || "";
        break;
      case "whatsapp":
        initialValues[field.key] = profile?.whatsapp || "";
        break;
      case "birth_date":
        initialValues[field.key] = profile?.birth_date
          ? new Date(profile.birth_date)
          : undefined;
        break;
      case "education_history":
        initialValues[field.key] = profile?.education_history ?? [];
        break;
      case "current_education":
        initialValues[field.key] = history.length > 0
          ? { ...history[history.length - 1] }
          : { ...BLANK_EDUCATION };
        break;
      default:
        initialValues[field.key] = field.defaultValue || "";
    }
  });

  const form = useForm({
    mode: "uncontrolled",
    initialValues,
    validate: (values) => {
      const errors: Record<string, string> = {};

      profileFields.forEach((field) => {
        let isEmpty: boolean;
        if (field.key === "education_history") {
          isEmpty =
            !Array.isArray(values[field.key]) ||
            (values[field.key] as any[]).length === 0;
        } else if (field.key === "current_education") {
          // If history exists, user must select something
          if (history.length > 0 && ceSelectedKeyRef.current === null) {
            isEmpty = true;
          } else {
            // New entry must have at least institution filled
            isEmpty = !(values["current_education"] as any)?.institution;
          }
        } else {
          isEmpty = !values[field.key];
        }

        if (field.required && isEmpty) {
          errors[field.key] = `${field.label} wajib diisi`;
        }

        if (field.validation) {
          const val = values[field.key];
          if (val && field.validation.minLength && val.length < field.validation.minLength) {
            errors[field.key] =
              field.validation.customMessage ||
              `Minimal ${field.validation.minLength} karakter`;
          }
          if (val && field.validation.maxLength && val.length > field.validation.maxLength) {
            errors[field.key] =
              field.validation.customMessage ||
              `Maksimal ${field.validation.maxLength} karakter`;
          }
          if (val && field.validation.pattern) {
            const regex = new RegExp(field.validation.pattern);
            if (!regex.test(val)) {
              errors[field.key] =
                field.validation.customMessage ||
                `Format ${field.label} tidak valid`;
            }
          }
        }
      });

      return errors;
    },
  });

  const renderField = (field: CustomFormField) => {
    const commonProps = {
      label: field.label,
      description: field.helpText,
      required: field.required,
      disabled: field.disabled,
      size: "md" as const,
      ...form.getInputProps(field.key),
    };

    switch (field.key) {
      case "name":
        return <TextInput {...commonProps} placeholder="Isi di sini" />;

      case "gender":
        return <Select {...commonProps} placeholder="Pilih opsi" data={GENDER_OPTION} />;

      case "email":
        return <TextInput {...commonProps} placeholder="Isi di sini" type="email" disabled />;

      case "personal_id":
        return <TextInput {...commonProps} placeholder="Isi di sini" />;

      case "province_id":
        return (
          <Select
            {...commonProps}
            placeholder="Pilih opsi"
            data={
              provinceData?.map((province) => ({
                label: province.name,
                value: province.id.toString(),
              })) || []
            }
            searchable
            onChange={(val) => {
              commonProps.onChange(val);
              setCurrentCityId(null);
              setCurrentCities([]);
              if (val) {
                getCitiesByProvince(Number(val)).then(setCurrentCities);
              }
            }}
          />
        );

      case "city_id":
        return (
          <Select
            {...commonProps}
            placeholder="Pilih opsi"
            data={currentCities.map((c) => ({ label: c.name, value: c.id.toString() }))}
            value={currentCityId}
            onChange={(val) => {
              setCurrentCityId(val);
              commonProps.onChange(val);
            }}
            searchable
            disabled={currentCities.length === 0}
          />
        );

      case "origin_province_id":
        return (
          <Select
            {...commonProps}
            placeholder="Pilih opsi"
            data={
              provinceData?.map((province) => ({
                label: province.name,
                value: province.id.toString(),
              })) || []
            }
            searchable
            onChange={(val) => {
              commonProps.onChange(val);
              setOriginCityId(null);
              setOriginCities([]);
              if (val) {
                getCitiesByProvince(Number(val)).then(setOriginCities);
              }
            }}
          />
        );

      case "origin_city_id":
        return (
          <Select
            {...commonProps}
            placeholder="Pilih opsi"
            data={originCities.map((c) => ({ label: c.name, value: c.id.toString() }))}
            value={originCityId}
            onChange={(val) => {
              setOriginCityId(val);
              commonProps.onChange(val);
            }}
            searchable
            disabled={originCities.length === 0}
          />
        );

      case "country":
        return (
          <Select
            {...commonProps}
            placeholder="Pilih opsi"
            data={countryData?.map((c) => ({ label: c.name, value: c.name })) ?? []}
            searchable
          />
        );

      case "line":
        return <TextInput {...commonProps} placeholder="Isi di sini" />;

      case "instagram":
        return <TextInput {...commonProps} placeholder="Isi di sini" />;

      case "tiktok":
        return <TextInput {...commonProps} placeholder="Isi di sini" />;

      case "linkedin":
        return <TextInput {...commonProps} placeholder="Isi di sini" />;

      case "whatsapp":
        return (
          <TextInput
            {...commonProps}
            placeholder="Isi di sini"
            type="tel"
            pattern="[0-9]*"
            inputMode="numeric"
            onKeyDown={(e) => {
              if (
                !/[0-9]/.test(e.key) &&
                !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
              ) {
                e.preventDefault();
              }
            }}
          />
        );

      case "birth_date":
        return <DateInput {...commonProps} placeholder="Isi di sini" valueFormat="YYYY-MM-DD" />;

      case "education_history": {
        const entries = (form.getValues().education_history as EducationEntry[]) ?? [];
        const educationError = form.errors["education_history"];
        return (
          <Stack gap="xs">
            <Text fw={500} size="md">
              {field.label}
              {field.required && <span style={{ color: "red" }}> *</span>}
            </Text>
            {field.helpText && (
              <Text size="sm" c="dimmed">
                {field.helpText}
              </Text>
            )}
            {educationError && (
              <Text size="md" c="red">
                {educationError}
              </Text>
            )}
            {entries.map((_, index) => (
              <Paper key={index} withBorder p="sm" radius="md">
                <Group justify="space-between" mb="xs">
                  <Text size="md" fw={500}>
                    Pendidikan {index + 1}
                  </Text>
                  <ActionIcon
                    color="red"
                    variant="subtle"
                    size="sm"
                    onClick={() => form.removeListItem("education_history", index)}
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
              size="md"
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
          </Stack>
        );
      }

      case "current_education": {
        const ceError = form.errors["current_education"];
        const isCreating = ceSelectedKey === "new" || history.length === 0;

        return (
          <Stack gap={4}>
            <Text fw={500} size="md">
              {field.label}
              {field.required && <span style={{ color: "red" }}> *</span>}
            </Text>
            {field.helpText && (
              <Text size="sm" c="dimmed">
                {field.helpText}
              </Text>
            )}
            {ceError && (
              <Text size="md" c="red">
                {ceError}
              </Text>
            )}

            {history.length > 0 && (
              <Stack gap="xs">
                {localHistory.map((e, i) => {
                  const val = String(i);
                  const isSelected = ceSelectedKey === val;
                  const isEditing = editingIndex === i;
                  return (
                    <Paper
                      key={i}
                      withBorder
                      p="sm"
                      radius="md"
                      style={{
                        borderColor: isSelected ? "var(--mantine-color-blue-6)" : undefined,
                        borderWidth: isSelected ? 2 : 1,
                      }}
                    >
                      <Group justify="space-between" wrap="nowrap">
                        <Group
                          gap="sm"
                          wrap="nowrap"
                          style={{ flex: 1, cursor: "pointer" }}
                          onClick={() => handleCeChange(val)}
                        >
                          <input
                            type="radio"
                            name="current_education_pick"
                            value={val}
                            checked={isSelected}
                            onChange={() => handleCeChange(val)}
                            style={{ accentColor: "var(--mantine-color-blue-6)", flexShrink: 0 }}
                          />
                          <Stack gap={2}>
                            <Text size="md" fw={500}>
                              {DEGREE_LABEL[e.degree] ?? e.degree} — {e.institution || "-"}
                            </Text>
                            <Text size="sm" c="dimmed">
                              {e.major || "-"}{e.intake_year ? ` · ${e.intake_year}` : ""}
                            </Text>
                          </Stack>
                        </Group>
                        {!isEditing && (
                          <ActionIcon
                            variant="subtle"
                            size="sm"
                            color="gray"
                            onClick={(ev) => { ev.stopPropagation(); handleToggleEdit(i); }}
                          >
                            <IconPencil size={14} />
                          </ActionIcon>
                        )}
                      </Group>

                      {isEditing && (
                        <>
                          <Divider my="sm" />
                          <Stack gap="xs">
                            <Select
                              {...form.getInputProps("current_education.degree")}
                              key={form.key("current_education.degree")}
                              label="Jenjang"
                              data={DEGREE_OPTIONS}
                              radius="md"
                            />
                            <UniversityNameSelect
                              {...form.getInputProps("current_education.institution")}
                              key={form.key("current_education.institution")}
                              label="Institusi"
                              placeholder="Cari universitas"
                              radius="md"
                            />
                            <TextInput
                              {...form.getInputProps("current_education.major")}
                              key={form.key("current_education.major")}
                              label="Jurusan"
                              placeholder="Jurusan"
                              radius="md"
                            />
                            <NumberInput
                              {...form.getInputProps("current_education.intake_year")}
                              key={form.key("current_education.intake_year")}
                              label="Tahun Masuk"
                              placeholder="Tahun masuk"
                              radius="md"
                            />
                            <Group justify="flex-end" mt="xs">
                              <Button
                                variant="subtle"
                                size="md"
                                color="gray"
                                onClick={() => {
                                  // revert form to the original (unedited) local value
                                  form.setFieldValue("current_education", localHistory[i]);
                                  setEditingIndex(null);
                                }}
                              >
                                Batal
                              </Button>
                              <Button size="md" onClick={handleConfirmEdit}>
                                Selesai
                              </Button>
                            </Group>
                          </Stack>
                        </>
                      )}
                    </Paper>
                  );
                })}

                <Paper
                  withBorder
                  p="sm"
                  radius="md"
                  style={{
                    cursor: "pointer",
                    borderColor: ceSelectedKey === "new" ? "var(--mantine-color-blue-6)" : undefined,
                    borderWidth: ceSelectedKey === "new" ? 2 : 1,
                  }}
                  onClick={() => handleCeChange("new")}
                >
                  <Group gap="sm" wrap="nowrap">
                    <input
                      type="radio"
                      name="current_education_pick"
                      value="new"
                      checked={ceSelectedKey === "new"}
                      onChange={() => handleCeChange("new")}
                      style={{ accentColor: "var(--mantine-color-blue-6)", flexShrink: 0 }}
                    />
                    <Text size="md" fw={500} c="blue">+ Tambah Pendidikan Baru</Text>
                  </Group>
                </Paper>
              </Stack>
            )}

            {isCreating && (
              <Paper key={ceFormKey} withBorder p="sm" radius="md">
                <Text size="md" fw={500} mb="xs">
                  Detail Pendidikan
                </Text>
                <Select
                  {...form.getInputProps("current_education.degree")}
                  key={form.key("current_education.degree")}
                  label="Jenjang"
                  data={DEGREE_OPTIONS}
                  radius="md"
                />
                <UniversityNameSelect
                  {...form.getInputProps("current_education.institution")}
                  key={form.key("current_education.institution")}
                  label="Institusi"
                  placeholder="Cari universitas"
                  mt="xs"
                  radius="md"
                />
                <TextInput
                  {...form.getInputProps("current_education.major")}
                  key={form.key("current_education.major")}
                  label="Jurusan"
                  placeholder="Jurusan"
                  mt="xs"
                  radius="md"
                />
                <NumberInput
                  {...form.getInputProps("current_education.intake_year")}
                  key={form.key("current_education.intake_year")}
                  label="Tahun Masuk"
                  placeholder="Tahun masuk"
                  mt="xs"
                  radius="md"
                />
              </Paper>
            )}
          </Stack>
        );
      }

      default:
        return <TextInput {...commonProps} placeholder="Isi di sini" />;
    }
  };

  const handleFormSubmit = async (values: Record<string, any>) => {
    if (isSingleSection) {
      setPendingValues(values);
      setConfirmModalOpened(true);
      return;
    }
    await handleSubmit(values);
  };

  const handleSubmit = async (values: Record<string, any>) => {
    onLoadingChange?.(true);
    try {
      let whatsappNumber = values.whatsapp;
      if (whatsappNumber && typeof whatsappNumber === "string") {
        const whatsappStr = whatsappNumber.trim();
        if (whatsappStr.startsWith("0")) {
          whatsappNumber = "62" + whatsappStr.slice(1);
        }
      }

      const profileUpdateData: Record<string, any> = {};

      profileFields.forEach((field) => {
        if (values[field.key] !== undefined) {
          if (
            field.key === "province_id" ||
            field.key === "city_id" ||
            field.key === "origin_province_id" ||
            field.key === "origin_city_id"
          ) {
            profileUpdateData[field.key] = values[field.key]
              ? Number(values[field.key])
              : undefined;
          } else if (field.key === "whatsapp") {
            profileUpdateData[field.key] = whatsappNumber;
          } else if (field.key !== "email" && field.key !== "current_education") {
            if (field.key === "birth_date") {
              profileUpdateData[field.key] = toISODateString(values[field.key]);
            } else {
              profileUpdateData[field.key] = values[field.key];
            }
          }
        }
      });

      // current_education always becomes the last item in education_history
      const hasCeField = profileFields.some((f) => f.key === "current_education");
      if (hasCeField) {
        const selectedEntry = values["current_education"] as EducationEntry;
        if (selectedEntry?.institution) {
          if (ceSelectedKeyRef.current === "new" || localHistory.length === 0) {
            // New entry: append to local history
            profileUpdateData["education_history"] = [...localHistory, selectedEntry];
          } else if (ceSelectedKeyRef.current !== null) {
            // Existing entry: apply any in-progress edit, then move to last
            const idx = Number(ceSelectedKeyRef.current);
            const merged = localHistory.map((e, i) => (i === idx ? selectedEntry : e));
            const withoutSelected = merged.filter((_, i) => i !== idx);
            profileUpdateData["education_history"] = [...withoutSelected, selectedEntry];
          }
        }
      }

      const response = await editProfile(profileUpdateData);

      if (!response.success) {
        showNotif(response.message, true);
        return;
      }

      onSubmit(values);
    } catch (error) {
      showNotif("Terjadi kesalahan jaringan. Silakan coba lagi.", true);
    } finally {
      onLoadingChange?.(false);
    }
  };

  const handleConfirmSubmit = async () => {
    if (pendingValues) {
      setConfirmModalOpened(false);
      await handleSubmit(pendingValues);
    }
  };

  return (
    <>
      <form ref={formRef} onSubmit={form.onSubmit(handleFormSubmit)}>
        <Stack gap="xl">
          <Title order={4}>Data Diri</Title>

          {profileFields
            .filter((f) => !f.hidden)
            .map((field) => (
              <div key={field.key}>{renderField(field)}</div>
            ))}
        </Stack>
      </form>

      <Modal
        opened={confirmModalOpened}
        onClose={() => setConfirmModalOpened(false)}
        title="Konfirmasi Pengiriman"
        centered
      >
        <Stack gap="md">
          <Text size="md">
            Apakah Anda yakin ingin mengirim formulir ini? Pastikan semua data
            yang Anda masukkan sudah benar.
          </Text>
          <Group justify="flex-end" mt="md">
            <Button
              variant="default"
              onClick={() => setConfirmModalOpened(false)}
              disabled={loading}
            >
              Batal
            </Button>
            <Button onClick={handleConfirmSubmit} loading={loading}>
              Ya, Kirim
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
