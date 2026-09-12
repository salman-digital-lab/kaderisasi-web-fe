"use client";
import {
  Button,
  Fieldset,
  MultiSelect,
  Paper,
  Select,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useForm } from "@mantine/form";
import { useRef, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { GENDER_OPTION } from "@/constants/form/profile";
import editProfile from "@/functions/server/editProfile";
import type { Province } from "@/types/model/province";
import type { Country } from "@/types/model/country";
import type { ProfileData } from "../types";
import { profileHistorySchema } from "../history-schema";
import { profileValidationErrors } from "../form-schema";
import { profileFormValues, profileFormRequest } from "../form-values";
import type { ProfileFormValues } from "../form-values";
import HistoryFields from "../HistoryFields";
import CitySelect from "../CitySelect";
import ProfileSectionError from "../ProfileSectionError";
import classes from "./index.module.css";

dayjs.extend(customParseFormat);

const FOCUS_OPTIONS = [
  { value: "professional", label: "Profesional" },
  { value: "academic", label: "Akademik" },
  { value: "social", label: "Sosial" },
  { value: "entrepreneur", label: "Wirausaha" },
  { value: "politics", label: "Politik" },
  { value: "other", label: "Lainnya" },
];
function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}): ReactElement {
  return (
    <section className={classes.section}>
      <Title order={3} size="h4" className={classes.sectionHeader}>
        {title}
      </Title>
      {children}
    </section>
  );
}
type Props = {
  provinces?: Province[];
  countries?: Country[];
  profileData: ProfileData;
  provinceError?: string;
  countryError?: string;
  onSaved: (name: string) => void;
};
export default function PersonalDataForm({
  provinces,
  countries,
  profileData,
  provinceError,
  countryError,
  onSaved,
}: Props): ReactElement {
  const [initial] = useState(() => profileFormValues(profileData.profile));
  const [province, setProvince] = useState(initial.province_id);
  const [originProvince, setOriginProvince] = useState(
    initial.origin_province_id,
  );
  const [feedback, setFeedback] = useState<{
    error: boolean;
    message: string;
  } | null>(null);
  const [historyVersion, setHistoryVersion] = useState(0);
  const busy = useRef(false);
  const form = useForm<ProfileFormValues>({
    mode: "uncontrolled",
    initialValues: initial,
    validate: profileValidationErrors,
  });
  const dirty = form.isDirty();
  function focusError(errors: Record<string, ReactNode>): void {
    const first = Object.keys(errors)[0];
    setFeedback({
      error: true,
      message: "Periksa isian yang ditandai sebelum menyimpan.",
    });
    if (first) requestAnimationFrame(() => form.getInputNode(first)?.focus());
  }
  function discard(): void {
    form.reset();
    setProvince(form.getValues().province_id);
    setOriginProvince(form.getValues().origin_province_id);
    setHistoryVersion((value) => value + 1);
    setFeedback(null);
  }
  async function save(values: ProfileFormValues): Promise<void> {
    if (busy.current) return;
    busy.current = true;
    setFeedback(null);
    try {
      const request = profileFormRequest({
        ...values,
        ...profileHistorySchema.parse(values),
      });
      const response = await editProfile(request);
      if (!response.success) {
        setFeedback({ error: true, message: response.message });
        return;
      }
      const saved = profileFormValues({
        ...profileData.profile,
        ...request,
        ...response.data,
      });
      form.setInitialValues(saved);
      form.setValues(saved);
      form.resetDirty(saved);
      setProvince(saved.province_id);
      setOriginProvince(saved.origin_province_id);
      setHistoryVersion((value) => value + 1);
      onSaved(saved.name);
      setFeedback({ error: false, message: "Perubahan berhasil disimpan." });
    } catch {
      setFeedback({
        error: true,
        message: "Perubahan belum tersimpan. Silakan coba lagi.",
      });
    } finally {
      busy.current = false;
    }
  }
  const provinceOptions =
    provinces?.map((item) => ({ value: String(item.id), label: item.name })) ??
    [];
  return (
    <form
      className={classes.form}
      noValidate
      onSubmit={(event) => {
        if (busy.current) {
          event.preventDefault();
          return;
        }
        form.onSubmit(save, focusError)(event);
      }}
    >
      <Title order={2} size="h3" mb={4}>
        Data diri
      </Title>
      <Text c="dimmed" mb="lg">
        Perbarui informasi Anda, lalu simpan perubahan di bagian bawah.
      </Text>
      <Paper withBorder p={{ base: "md", sm: "lg" }}>
        <Fieldset unstyled disabled={form.submitting}>
          <Section title="Identitas">
            <div className={classes.fields}>
              <TextInput
                {...form.getInputProps("name")}
                key={form.key("name")}
                label="Nama lengkap"
                autoComplete="name"
              />
              <TextInput
                {...form.getInputProps("extra_data.preferred_name")}
                key={form.key("extra_data.preferred_name")}
                label="Nama panggilan"
                autoComplete="nickname"
              />
              <Select
                {...form.getInputProps("gender")}
                key={form.key("gender")}
                label="Jenis kelamin"
                allowDeselect={false}
                data={GENDER_OPTION}
              />
              <DateInput
                {...form.getInputProps("birth_date")}
                key={form.key("birth_date")}
                label="Tanggal lahir"
                valueFormat="DD/MM/YYYY"
                dateParser={(input) => {
                  const parsed = dayjs(input, "DD/MM/YYYY", true);
                  return parsed.isValid() ? parsed.format("YYYY-MM-DD") : null;
                }}
                placeholder="DD/MM/YYYY"
              />
              <TextInput
                {...form.getInputProps("personal_id")}
                key={form.key("personal_id")}
                label="Nomor identitas"
                inputMode="numeric"
              />
              <div>
                <Text fw={600} size="sm">
                  Email akun
                </Text>
                <Text className={classes.readOnly}>
                  {profileData.userData.email || "Belum tersedia"}
                </Text>
                <Text c="dimmed" size="sm">
                  Email akun tidak dapat diubah di sini.
                </Text>
              </div>
            </div>
          </Section>
          <Section title="Domisili">
            {provinceError && <ProfileSectionError message={provinceError} />}
            {countryError && <ProfileSectionError message={countryError} />}
            <div className={classes.fields}>
              <Select
                {...form.getInputProps("province_id")}
                key={form.key("province_id")}
                label="Provinsi"
                allowDeselect={false}
                data={provinceOptions}
                searchable
                disabled={Boolean(provinceError)}
                onChange={(value) => {
                  form.setFieldValue("province_id", value);
                  form.setFieldValue("city_id", null);
                  setProvince(value);
                }}
              />
              <CitySelect
                {...form.getInputProps("city_id")}
                key={form.key("city_id")}
                provinceId={province}
                label="Kota / kabupaten"
              />
              <Select
                {...form.getInputProps("country")}
                key={form.key("country")}
                label="Negara"
                allowDeselect={false}
                searchable
                disabled={Boolean(countryError)}
                data={
                  countries?.map((item) => ({
                    value: item.name,
                    label: item.name,
                  })) ?? []
                }
              />
            </div>
          </Section>
          <Section title="Asal daerah">
            <div className={classes.fields}>
              <Select
                {...form.getInputProps("origin_province_id")}
                key={form.key("origin_province_id")}
                label="Provinsi asal"
                allowDeselect={false}
                data={provinceOptions}
                searchable
                disabled={Boolean(provinceError)}
                onChange={(value) => {
                  form.setFieldValue("origin_province_id", value);
                  form.setFieldValue("origin_city_id", null);
                  setOriginProvince(value);
                }}
              />
              <CitySelect
                {...form.getInputProps("origin_city_id")}
                key={form.key("origin_city_id")}
                provinceId={originProvince}
                label="Kota / kabupaten asal"
              />
            </div>
          </Section>
          <Section title="Kontak dan media sosial">
            <div className={classes.fields}>
              <TextInput
                {...form.getInputProps("whatsapp")}
                key={form.key("whatsapp")}
                label="Nomor WhatsApp aktif"
                type="tel"
                autoComplete="tel"
                description="Gunakan kode negara, misalnya 6281234567890."
              />
              <TextInput
                {...form.getInputProps("line")}
                key={form.key("line")}
                label="ID LINE"
              />
              <TextInput
                {...form.getInputProps("linkedin")}
                key={form.key("linkedin")}
                label="LinkedIn"
                placeholder="Tautan profil LinkedIn"
              />
              <TextInput
                {...form.getInputProps("instagram")}
                key={form.key("instagram")}
                label="Instagram"
                placeholder="Nama pengguna"
              />
              <TextInput
                {...form.getInputProps("tiktok")}
                key={form.key("tiktok")}
                label="TikTok"
                placeholder="Nama pengguna"
              />
            </div>
          </Section>
          <Section title="Pendidikan">
            <HistoryFields
              key={`education-${historyVersion}`}
              form={form}
              kind="education_history"
            />
          </Section>
          <Section title="Pekerjaan / aktivitas">
            <HistoryFields
              key={`work-${historyVersion}`}
              form={form}
              kind="work_history"
            />
          </Section>
          <Section title="Fokus aktivitas">
            <MultiSelect
              {...form.getInputProps("extra_data.current_activity_focus")}
              key={form.key("extra_data.current_activity_focus")}
              label="Bidang fokus"
              description="Pilih satu atau beberapa bidang yang sesuai dengan aktivitas Anda saat ini."
              data={FOCUS_OPTIONS}
              classNames={{ option: classes.focusOption }}
            />
          </Section>
        </Fieldset>
      </Paper>
      <div className={classes.saveBar}>
        <div className={classes.saveStatus}>
          {feedback?.error ? (
            <Text role="alert" c="red">
              {feedback.message}
            </Text>
          ) : (
            <Text role="status" size="sm" c="dimmed">
              {dirty
                ? "Ada perubahan yang belum disimpan."
                : feedback?.message || "Belum ada perubahan."}
            </Text>
          )}
        </div>
        <div className={classes.saveActions}>
          <Button
            variant="subtle"
            disabled={!dirty || form.submitting}
            onClick={discard}
          >
            Batalkan perubahan
          </Button>
          <Button
            type="submit"
            color="blue.8"
            loading={form.submitting}
            disabled={!dirty}
          >
            Simpan perubahan
          </Button>
        </div>
      </div>
    </form>
  );
}
