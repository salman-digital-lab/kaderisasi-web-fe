"use client";

import "@mantine/dates/styles.css";
import {
  Accordion,
  Button,
  Fieldset,
  MultiSelect,
  Paper,
  Select,
  Text,
  TextInput,
  Title,
  VisuallyHidden,
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
import {
  PROFILE_FORM_SECTIONS,
  initialOpenSections,
  sectionForField,
  sectionHasData,
} from "../form-sections";
import type { ProfileSectionId } from "../form-sections";
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
  id,
  empty,
  children,
}: {
  id: ProfileSectionId;
  empty: boolean;
  children: ReactNode;
}): ReactElement {
  const title = PROFILE_FORM_SECTIONS.find((item) => item.id === id)?.title;
  return (
    <Accordion.Item
      value={id}
      id={`profile-section-${id}`}
      className={classes.section}
    >
      <Accordion.Control>
        <span className={classes.sectionTitle}>{title}</span>
        {empty && (
          <Text span size="sm" c="dimmed" className={classes.sectionHint}>
            Belum diisi
          </Text>
        )}
      </Accordion.Control>
      <Accordion.Panel>{children}</Accordion.Panel>
    </Accordion.Item>
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
  const [openSections, setOpenSections] = useState<string[]>(() =>
    initialOpenSections(initial),
  );
  function openSection(id: ProfileSectionId): void {
    setOpenSections((ids) => (ids.includes(id) ? ids : [...ids, id]));
  }
  function goToSection(id: ProfileSectionId): void {
    openSection(id);
    requestAnimationFrame(() =>
      document
        .getElementById(`profile-section-${id}`)
        ?.scrollIntoView({ block: "start", behavior: "smooth" }),
    );
  }
  const busy = useRef(false);
  const form = useForm<ProfileFormValues>({
    mode: "uncontrolled",
    initialValues: initial,
    validate: profileValidationErrors,
  });
  const dirty = form.isDirty();
  const currentValues = form.getValues();
  function focusError(errors: Record<string, ReactNode>): void {
    const first = Object.keys(errors)[0];
    setFeedback({
      error: true,
      message: "Periksa isian yang ditandai sebelum menyimpan.",
    });
    if (!first) return;
    const section = sectionForField(first);
    if (section) openSection(section);
    // Wait for the section to expand before moving focus into it.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => form.getInputNode(first)?.focus()),
    );
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
      <VisuallyHidden>
        <Title order={2}>Data diri</Title>
      </VisuallyHidden>
      <div className={classes.layout}>
        <nav aria-label="Bagian data diri" className={classes.sectionNav}>
          <ul>
            {PROFILE_FORM_SECTIONS.map((section) => (
              <li key={section.id}>
                <button
                  type="button"
                  className={classes.sectionNavLink}
                  onClick={() => goToSection(section.id)}
                >
                  {section.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <Paper withBorder className={classes.surface}>
          <Fieldset variant="unstyled" disabled={form.submitting}>
            <Accordion
              multiple
              order={3}
              value={openSections}
              onChange={setOpenSections}
              keepMountedMode="display-none"
              classNames={{
                control: classes.sectionControl,
                content: classes.sectionContent,
              }}
            >
              <Section
                id="identity"
                empty={!sectionHasData("identity", currentValues)}
              >
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
                      return parsed.isValid()
                        ? parsed.format("YYYY-MM-DD")
                        : null;
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
              <Section
                id="domicile"
                empty={!sectionHasData("domicile", currentValues)}
              >
                {provinceError && (
                  <ProfileSectionError message={provinceError} />
                )}
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
              <Section
                id="origin"
                empty={!sectionHasData("origin", currentValues)}
              >
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
              <Section
                id="contact"
                empty={!sectionHasData("contact", currentValues)}
              >
                <div className={classes.fields}>
                  <TextInput
                    {...form.getInputProps("whatsapp")}
                    key={form.key("whatsapp")}
                    label="Nomor WhatsApp aktif"
                    type="tel"
                    enterKeyHint="next"
                    inputMode="tel"
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
              <Section
                id="education"
                empty={!sectionHasData("education", currentValues)}
              >
                <HistoryFields
                  key={`education-${historyVersion}`}
                  form={form}
                  kind="education_history"
                />
              </Section>
              <Section id="work" empty={!sectionHasData("work", currentValues)}>
                <HistoryFields
                  key={`work-${historyVersion}`}
                  form={form}
                  kind="work_history"
                />
              </Section>
              <Section
                id="focus"
                empty={!sectionHasData("focus", currentValues)}
              >
                <MultiSelect
                  {...form.getInputProps("extra_data.current_activity_focus")}
                  key={form.key("extra_data.current_activity_focus")}
                  label="Bidang fokus"
                  description="Pilih satu atau beberapa bidang yang sesuai dengan aktivitas Anda saat ini."
                  data={FOCUS_OPTIONS}
                  classNames={{ option: classes.focusOption }}
                />
              </Section>
            </Accordion>
          </Fieldset>
          <div
            className={classes.saveBar}
            data-sticky={
              dirty || form.submitting || feedback ? true : undefined
            }
          >
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
                size="sm"
                className={classes.discardButton}
                disabled={!dirty || form.submitting}
                onClick={discard}
              >
                Batalkan perubahan
              </Button>
              <Button
                type="submit"
                color="blue.8"
                size="sm"
                loading={form.submitting}
                disabled={!dirty}
              >
                Simpan perubahan
              </Button>
            </div>
          </div>
        </Paper>
      </div>
    </form>
  );
}
