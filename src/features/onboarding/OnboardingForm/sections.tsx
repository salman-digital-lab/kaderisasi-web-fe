"use client";

import Image from "next/image";
import {
  ActionIcon,
  Alert,
  Button,
  Checkbox,
  Divider,
  Group,
  MultiSelect,
  NumberInput,
  Paper,
  Progress,
  Radio,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import type { UseFormReturnType } from "@mantine/form";
import {
  IconArrowRight,
  IconCheck,
  IconChevronLeft,
  IconCircleCheck,
  IconDeviceMobile,
  IconMail,
  IconPencil,
  IconPlus,
  IconTrash,
  IconUser,
  IconUserOff,
  IconX,
} from "@tabler/icons-react";

import { GENDER_OPTION } from "@/constants/form/profile";
import UniversityNameSelect from "@/components/common/UniversityNameSelect";
import logo from "@/assets/bmka_logo_color.png";
import type { Country } from "@/types/model/country";
import type { City } from "@/types/model/city";
import type { Province } from "@/types/model/province";
import type { Member, PublicUser } from "@/types/model/members";
import {
  currentActivityFocusOptions,
  degreeOptions,
  salmanActivityHistoryOptions,
  type OnboardingFormValues,
} from "@/features/onboarding/schema";

import { STEP_META } from "./config";
import type { StepId } from "./types";
import {
  getCountryLabel,
  getEducationSummary,
  getFocusLabel,
  getLocationLabel,
  getSalmanHistoryLabel,
  getWorkSummary,
} from "./utils";
import classes from "./index.module.css";

type HeaderProps = {
  currentStep: number;
  visibleStepIds: StepId[];
  progressValue: number;
  activeStepId: StepId;
};

export function OnboardingHeader() {
  return (
    <>
      <div className={classes.logo}>
        <Image src={logo} alt="bmka" fill className={classes.logoImage} />
      </div>
      <Title ta="center" className={`${classes.title} ${classes.headerText}`}>
        Lengkapi Profil Anda
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5} className={classes.headerText}>
        Buat akun baru, masuk dengan akun yang sudah ada, atau lanjut tanpa
        akun.
      </Text>
    </>
  );
}

export function OnboardingProgress({
  currentStep,
  visibleStepIds,
  progressValue,
  activeStepId,
}: HeaderProps) {
  return (
    <>
      <Stack gap="xs" hiddenFrom="sm">
        <Group justify="space-between" align="center">
          <Text fw={700}>
            Langkah {currentStep + 1} dari {visibleStepIds.length}
          </Text>
          <Text c="dimmed" size="sm">
            {STEP_META[activeStepId].label}
          </Text>
        </Group>
        <Progress value={progressValue} radius="xl" size="md" />
      </Stack>

      <div className={classes.desktopSteps} aria-label="Progres onboarding">
        {visibleStepIds.map((stepId, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div key={stepId} className={classes.desktopStepItem}>
              <div
                className={classes.desktopStep}
                data-active={isActive ? true : undefined}
                data-completed={isCompleted ? true : undefined}
              >
                <div className={classes.desktopStepNumber}>{index + 1}</div>
                <div className={classes.desktopStepText}>
                  <Text fw={700} size="sm" truncate="end">
                    {STEP_META[stepId].label}
                  </Text>
                </div>
              </div>
              {index < visibleStepIds.length - 1 ? (
                <div
                  className={classes.desktopStepSeparator}
                  data-completed={isCompleted ? true : undefined}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </>
  );
}

type SuccessStateProps = {
  onLogin: () => void;
};

export function NoAccountSuccessState({ onLogin }: SuccessStateProps) {
  return (
    <>
      <div className={classes.logo}>
        <Image src={logo} alt="bmka" fill className={classes.logoImage} />
      </div>
      <Title ta="center" className={`${classes.title} ${classes.headerText}`}>
        Data Berhasil Dikirim
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5} className={classes.headerText}>
        Profil Anda sudah tercatat tanpa akun dan bisa dilanjutkan kembali di
        lain waktu.
      </Text>
      <Paper withBorder p={{ base: "md", sm: "lg" }} mt="md" radius="md">
        <Stack gap="lg" align="center" ta="center">
          <ThemeIcon size={56} radius="xl" color="teal">
            <IconCircleCheck size={28} />
          </ThemeIcon>
          <Text c="dimmed">
            Jika nanti ingin mengaktifkan akun, Anda bisa masuk atau mendaftar
            kembali menggunakan alur akun.
          </Text>
          <Group justify="center">
            <Button onClick={onLogin}>Masuk akun</Button>
          </Group>
        </Stack>
      </Paper>
    </>
  );
}

type StepFormProps = {
  form: UseFormReturnType<OnboardingFormValues>;
};

export function ModeStep({ form }: StepFormProps) {
  return (
    <Stack gap="lg">
      <Stack gap={6}>
        <Title order={2}>Pilih cara Anda melanjutkan</Title>
        <Text c="dimmed">
          Pilih alur yang sesuai dengan kondisi Anda saat ini.
        </Text>
      </Stack>

      <Radio.Group
        value={form.values.mode}
        onChange={(value) =>
          form.setFieldValue("mode", value as OnboardingFormValues["mode"])
        }
      >
        <Stack gap="md">
          <ModeChoiceCard
            checked={form.values.mode === "account"}
            value="account"
            icon={<IconMail size={18} />}
            color="blue"
            title="Buat akun"
            description="Cocok jika Anda ingin login kembali, mengubah profil kapan saja, dan mengikuti proses lain dengan data yang tersimpan."
          />
          <ModeChoiceCard
            checked={form.values.mode === "login"}
            value="login"
            icon={<IconUser size={18} />}
            color="teal"
            title="Masuk ke akun yang sudah ada"
            description="Login dulu untuk memuat data profil yang sudah tersimpan, lalu lanjutkan onboarding dengan data yang sudah terisi."
          />
          <ModeChoiceCard
            checked={form.values.mode === "no_account"}
            value="no_account"
            icon={<IconUserOff size={18} />}
            color="gray"
            title="Lanjut tanpa akun"
            description="Sistem akan membuat profil publik dengan status tanpa akun. Anda belum perlu email dan password."
          />
        </Stack>
      </Radio.Group>

      <Alert color="blue" variant="light" icon={<IconDeviceMobile size={18} />}>
        Progres pengisian disimpan otomatis di perangkat ini selama Anda belum
        mengirim formulir.
      </Alert>
    </Stack>
  );
}

type ModeChoiceCardProps = {
  checked: boolean;
  value: OnboardingFormValues["mode"];
  icon: React.ReactNode;
  color: string;
  title: string;
  description: string;
};

function ModeChoiceCard({
  checked,
  value,
  icon,
  color,
  title,
  description,
}: ModeChoiceCardProps) {
  return (
    <Paper
      component="label"
      withBorder
      p="lg"
      radius="lg"
      className={classes.choiceCard}
      data-selected={checked ? true : undefined}
    >
      <Group align="flex-start" wrap="nowrap">
        <Radio value={value} mt={4} size="md" />
        <Stack gap={6}>
          <Group gap="xs">
            <ThemeIcon color={color} variant="light" radius="xl">
              {icon}
            </ThemeIcon>
            <Text fw={700} className={classes.choiceTitle}>
              {title}
            </Text>
          </Group>
          <Text c="dimmed">{description}</Text>
        </Stack>
      </Group>
    </Paper>
  );
}

type CredentialsStepProps = StepFormProps & {
  profileData?: {
    userData: PublicUser;
    profile: Member;
  };
  isExistingAccountLoggedIn: boolean;
  onSwitchAccount: () => void;
};

export function CredentialsStep({
  form,
  profileData,
  isExistingAccountLoggedIn,
  onSwitchAccount,
}: CredentialsStepProps) {
  return (
    <Stack gap="lg">
      <Stack gap={6}>
        <Title order={2}>Siapkan akun Anda</Title>
        <Text c="dimmed">
          {form.values.mode === "login"
            ? "Masuk ke akun Anda untuk memuat data profil yang sudah tersimpan."
            : "Gunakan email aktif agar Anda mudah login kembali."}
        </Text>
      </Stack>

      {form.values.mode === "account" ? (
        <Alert color="blue" variant="light">
          Email akan diperiksa lebih dulu. Jika sudah terdaftar, Anda perlu
          login sebelum melanjutkan pengisian profil.
        </Alert>
      ) : null}

      {form.values.mode === "login" && isExistingAccountLoggedIn ? (
        <Alert color="teal" variant="light" title="Sudah masuk">
          <Stack gap="sm">
            <Text size="sm">
              Anda sudah login sebagai {profileData?.userData.email || form.values.email}.
              Data profil akan dimuat otomatis saat Anda lanjut.
            </Text>
            <Group gap="xs">
              <Button variant="default" size="sm" onClick={onSwitchAccount}>
                Ganti akun
              </Button>
            </Group>
          </Stack>
        </Alert>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <TextInput
            {...form.getInputProps("email")}
            key={form.key("email")}
            name="email"
            type="email"
            label="Email"
            placeholder="nama@email.com"
            size="md"
            radius="md"
            required
          />
          <div />
          <TextInput
            {...form.getInputProps("password")}
            key={form.key("password")}
            name="password"
            type="password"
            label="Password"
            placeholder={
              form.values.mode === "login"
                ? "Masukkan password akun Anda"
                : "Minimal 8 karakter"
            }
            size="md"
            radius="md"
            required
          />
          {form.values.mode === "account" ? (
            <TextInput
              {...form.getInputProps("confirmPassword")}
              key={form.key("confirmPassword")}
              name="confirmPassword"
              type="password"
              label="Konfirmasi password"
              placeholder="Ulangi password"
              size="md"
              radius="md"
              required
            />
          ) : null}
        </SimpleGrid>
      )}
    </Stack>
  );
}

export function PersonalStep({ form }: StepFormProps) {
  return (
    <Stack gap="lg">
      <Stack gap={6}>
        <Title order={2}>Lengkapi data diri</Title>
        <Text c="dimmed">
          Isi data utama terlebih dahulu. Gunakan nama yang biasa dipakai agar
          mudah dikenali.
        </Text>
      </Stack>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        <TextInput
          {...form.getInputProps("name")}
          key={form.key("name")}
          name="name"
          label="Nama lengkap"
          placeholder="Nama lengkap Anda"
          size="md"
          radius="md"
          required
        />
        <TextInput
          {...form.getInputProps("preferredName")}
          key={form.key("preferredName")}
          name="preferredName"
          label="Nama panggilan"
          placeholder="Nama yang sering dipakai"
          size="md"
          radius="md"
        />
        <Select
          {...form.getInputProps("gender")}
          key={form.key("gender")}
          name="gender"
          label="Jenis kelamin"
          placeholder="Pilih jenis kelamin"
          data={GENDER_OPTION}
          size="md"
          radius="md"
          required
        />
        <DateInput
          {...form.getInputProps("birthDate")}
          key={form.key("birthDate")}
          name="birthDate"
          label="Tanggal lahir"
          placeholder="Pilih tanggal lahir"
          valueFormat="DD MMMM YYYY"
          maxDate={new Date()}
          size="md"
          radius="md"
        />
      </SimpleGrid>
    </Stack>
  );
}

export function ContactStep({ form }: StepFormProps) {
  return (
    <Stack gap="lg">
      <Stack gap={6}>
        <Title order={2}>Kontak</Title>
        <Text c="dimmed">Masukkan kontak yang paling mudah dihubungi.</Text>
      </Stack>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        <TextInput
          {...form.getInputProps("whatsapp")}
          key={form.key("whatsapp")}
          name="whatsapp"
          label="Nomor WhatsApp"
          placeholder="08xxxxxxxxxx"
          description="Gunakan kode negara di depan nomor, misalnya 62812xxxxxxx."
          type="tel"
          size="md"
          radius="md"
          required
        />
        <TextInput
          {...form.getInputProps("instagram")}
          key={form.key("instagram")}
          name="instagram"
          label="Instagram"
          placeholder="@username"
          size="md"
          radius="md"
        />
        <TextInput
          {...form.getInputProps("tiktok")}
          key={form.key("tiktok")}
          name="tiktok"
          label="TikTok"
          placeholder="@username"
          size="md"
          radius="md"
        />
        <TextInput
          {...form.getInputProps("linkedin")}
          key={form.key("linkedin")}
          name="linkedin"
          label="LinkedIn"
          placeholder="Link profil atau username"
          size="md"
          radius="md"
        />
      </SimpleGrid>
    </Stack>
  );
}

type AddressStepProps = StepFormProps & {
  countryData: Country[];
  provinceData: Province[];
  currentCities: City[];
  originCities: City[];
  isIndonesia: boolean;
};

export function AddressStep({
  form,
  countryData,
  provinceData,
  currentCities,
  originCities,
  isIndonesia,
}: AddressStepProps) {
  return (
    <Stack gap="lg">
      <Stack gap={6}>
        <Title order={2}>Alamat dan domisili</Title>
        <Text c="dimmed" size="md">
          Masukkan lokasi tempat tinggal Anda saat ini dan asal daerah.
        </Text>
      </Stack>

      <Stack gap="md">
        <Select
          {...form.getInputProps("country")}
          key={form.key("country")}
          name="country"
          label="Negara domisili saat ini"
          placeholder="Pilih negara"
          data={countryData.map((country) => ({
            label: country.name,
            value: country.code,
          }))}
          searchable
          size="md"
          radius="md"
          required
        />

        <Divider />

        <Stack gap={4}>
          <Text size="md" fw={700}>
            Domisili saat ini
          </Text>
          <Text size="md" c="dimmed">
            Bagian ini untuk lokasi tempat tinggal Anda sekarang.
          </Text>
        </Stack>

        {isIndonesia ? (
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <Select
              {...form.getInputProps("provinceId")}
              key={form.key("provinceId")}
              name="provinceId"
              label="Provinsi domisili"
              placeholder="Pilih provinsi"
              data={provinceData.map((province) => ({
                label: province.name,
                value: province.id.toString(),
              }))}
              searchable
              size="md"
              radius="md"
              required
              onChange={(value) => {
                form.setFieldValue("provinceId", value || "");
                form.setFieldValue("cityId", "");
              }}
            />
            <Select
              {...form.getInputProps("cityId")}
              key={form.key("cityId")}
              name="cityId"
              label="Kota/kabupaten domisili"
              placeholder={
                currentCities.length > 0
                  ? "Pilih kota/kabupaten"
                  : "Pilih provinsi lebih dulu"
              }
              data={currentCities.map((city) => ({
                label: city.name,
                value: city.id.toString(),
              }))}
              searchable
              size="md"
              radius="md"
              disabled={form.values.provinceId === ""}
              required
            />
          </SimpleGrid>
        ) : (
          <Text size="md" c="dimmed">
            Provinsi dan kota domisili hanya ditampilkan jika negara domisili
            adalah Indonesia.
          </Text>
        )}

        <Divider />

        <Stack gap={4}>
          <Text size="md" fw={700}>
            Asal daerah
          </Text>
          <Text size="md" c="dimmed">
            Bagian ini untuk daerah asal Anda.
          </Text>
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <Select
            {...form.getInputProps("originProvinceId")}
            key={form.key("originProvinceId")}
            name="originProvinceId"
            label="Provinsi asal"
            placeholder="Pilih provinsi asal"
            data={provinceData.map((province) => ({
              label: province.name,
              value: province.id.toString(),
            }))}
            searchable
            size="md"
            radius="md"
            required
            onChange={(value) => {
              form.setFieldValue("originProvinceId", value || "");
              form.setFieldValue("originCityId", "");
            }}
          />
          <Select
            {...form.getInputProps("originCityId")}
            key={form.key("originCityId")}
            name="originCityId"
            label="Kota/kabupaten asal"
            placeholder="Pilih kota/kabupaten asal"
            data={originCities.map((city) => ({
              label: city.name,
              value: city.id.toString(),
            }))}
            searchable
            size="md"
            radius="md"
            disabled={form.values.originProvinceId === ""}
            required
          />
        </SimpleGrid>
      </Stack>
    </Stack>
  );
}

type ProfileStepProps = StepFormProps & {
  editingEducationIndex: number | null;
  editingWorkIndex: number | null;
  onAddEducation: () => void;
  onAddWork: () => void;
  onEditEducation: (index: number) => void;
  onCancelEducation: (index: number) => void;
  onSaveEducation: () => void;
  onDeleteEducation: (index: number) => void;
  onEditWork: (index: number) => void;
  onCancelWork: (index: number) => void;
  onSaveWork: () => void;
  onDeleteWork: (index: number) => void;
};

export function ProfileStep({
  form,
  editingEducationIndex,
  editingWorkIndex,
  onAddEducation,
  onAddWork,
  onEditEducation,
  onCancelEducation,
  onSaveEducation,
  onDeleteEducation,
  onEditWork,
  onCancelWork,
  onSaveWork,
  onDeleteWork,
}: ProfileStepProps) {
  return (
    <Stack gap="xl">
      <Stack gap={6}>
        <Title order={2}>Profil pendidikan dan aktivitas</Title>
        <Text c="dimmed">
          Tambahkan riwayat pendidikan dan aktivitas yang ingin dicatat.
        </Text>
      </Stack>

      <Stack gap="md">
        <SectionHeader
          title="Riwayat pendidikan"
          description="Tambahkan riwayat pendidikan yang relevan."
          onAdd={onAddEducation}
        />

        {form.values.educationHistory.length === 0 ? (
          <Text size="sm" c="dimmed">
            Belum ada riwayat pendidikan.
          </Text>
        ) : null}

        <Stack gap="md">
          {form.values.educationHistory.map((_, index) => (
            <Paper
              key={form.key(`educationHistory.${index}`)}
              withBorder
              radius="lg"
              p={{ base: "md", sm: "lg" }}
              className={
                editingEducationIndex === index
                  ? classes.listItemExpanded
                  : classes.listItemCompact
              }
            >
              <Stack gap="md">
                <Group justify="space-between" align="flex-start" wrap="nowrap">
                  <div className={classes.listItemHeader}>
                    <Text fw={700}>Riwayat {index + 1}</Text>
                    {editingEducationIndex !== index ? (
                      <Text size="md" c="dimmed">
                        {getEducationSummary(
                          form.values.educationHistory[index] ?? {
                            degree: "bachelor",
                            institution: "",
                            major: "",
                            intakeYear: null,
                          },
                        )}
                      </Text>
                    ) : null}
                  </div>
                  <ListItemActions
                    isEditing={editingEducationIndex === index}
                    onEdit={() => onEditEducation(index)}
                    onCancel={() => onCancelEducation(index)}
                    onSave={onSaveEducation}
                    onDelete={() => onDeleteEducation(index)}
                    editLabel={`Edit riwayat pendidikan ${index + 1}`}
                    cancelLabel={`Batal edit riwayat pendidikan ${index + 1}`}
                    saveLabel={`Simpan riwayat pendidikan ${index + 1}`}
                    deleteLabel={`Hapus riwayat pendidikan ${index + 1}`}
                  />
                </Group>
                {editingEducationIndex === index ? (
                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                    <Select
                      {...form.getInputProps(`educationHistory.${index}.degree`)}
                      key={form.key(`educationHistory.${index}.degree`)}
                      name={`educationHistory.${index}.degree`}
                      label="Jenjang"
                      data={degreeOptions.map((option) => ({
                        label: option.label,
                        value: option.value,
                      }))}
                      size="md"
                      radius="md"
                    />
                    <NumberInput
                      {...form.getInputProps(`educationHistory.${index}.intakeYear`)}
                      key={form.key(`educationHistory.${index}.intakeYear`)}
                      name={`educationHistory.${index}.intakeYear`}
                      label="Tahun masuk"
                      allowDecimal={false}
                      allowNegative={false}
                      size="md"
                      radius="md"
                    />
                    <UniversityNameSelect
                      {...form.getInputProps(`educationHistory.${index}.institution`)}
                      key={form.key(`educationHistory.${index}.institution`)}
                      name={`educationHistory.${index}.institution`}
                      label="Institusi"
                      placeholder="Cari universitas"
                      size="md"
                      radius="md"
                    />
                    <TextInput
                      {...form.getInputProps(`educationHistory.${index}.major`)}
                      key={form.key(`educationHistory.${index}.major`)}
                      name={`educationHistory.${index}.major`}
                      label="Jurusan"
                      size="md"
                      radius="md"
                    />
                  </SimpleGrid>
                ) : null}
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Stack>

      <Stack gap="md">
        <SectionHeader
          title="Riwayat pekerjaan"
          description="Isi jika pernah bekerja, magang, atau menjalankan usaha."
          onAdd={onAddWork}
        />

        {form.values.workHistory.length === 0 ? (
          <Text size="sm" c="dimmed">
            Belum ada riwayat pekerjaan.
          </Text>
        ) : null}

        <Stack gap="md">
          {form.values.workHistory.map((_, index) => (
            <Paper
              key={form.key(`workHistory.${index}`)}
              withBorder
              radius="lg"
              p={{ base: "md", sm: "lg" }}
              className={
                editingWorkIndex === index
                  ? classes.listItemExpanded
                  : classes.listItemCompact
              }
            >
              <Stack gap="md">
                <Group justify="space-between" align="flex-start" wrap="nowrap">
                  <div className={classes.listItemHeader}>
                    <Text fw={700}>Pekerjaan {index + 1}</Text>
                    {editingWorkIndex !== index ? (
                      <Text size="md" c="dimmed">
                        {getWorkSummary(
                          form.values.workHistory[index] ?? {
                            jobTitle: "",
                            company: "",
                            startYear: null,
                            endYear: null,
                          },
                        )}
                      </Text>
                    ) : null}
                  </div>
                  <ListItemActions
                    isEditing={editingWorkIndex === index}
                    onEdit={() => onEditWork(index)}
                    onCancel={() => onCancelWork(index)}
                    onSave={onSaveWork}
                    onDelete={() => onDeleteWork(index)}
                    editLabel={`Edit riwayat pekerjaan ${index + 1}`}
                    cancelLabel={`Batal edit riwayat pekerjaan ${index + 1}`}
                    saveLabel={`Simpan riwayat pekerjaan ${index + 1}`}
                    deleteLabel={`Hapus riwayat pekerjaan ${index + 1}`}
                  />
                </Group>
                {editingWorkIndex === index ? (
                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                    <TextInput
                      {...form.getInputProps(`workHistory.${index}.jobTitle`)}
                      key={form.key(`workHistory.${index}.jobTitle`)}
                      name={`workHistory.${index}.jobTitle`}
                      label="Posisi/jabatan"
                      size="md"
                      radius="md"
                    />
                    <TextInput
                      {...form.getInputProps(`workHistory.${index}.company`)}
                      key={form.key(`workHistory.${index}.company`)}
                      name={`workHistory.${index}.company`}
                      label="Perusahaan/tempat"
                      size="md"
                      radius="md"
                    />
                    <NumberInput
                      {...form.getInputProps(`workHistory.${index}.startYear`)}
                      key={form.key(`workHistory.${index}.startYear`)}
                      name={`workHistory.${index}.startYear`}
                      label="Tahun mulai"
                      allowDecimal={false}
                      allowNegative={false}
                      size="md"
                      radius="md"
                    />
                    <NumberInput
                      {...form.getInputProps(`workHistory.${index}.endYear`)}
                      key={form.key(`workHistory.${index}.endYear`)}
                      name={`workHistory.${index}.endYear`}
                      label="Tahun selesai"
                      allowDecimal={false}
                      allowNegative={false}
                      size="md"
                      radius="md"
                    />
                  </SimpleGrid>
                ) : null}
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Stack>

      <Stack gap="md">
        <Stack gap={4}>
          <Title order={4}>Fokus aktivitas saat ini</Title>
          <Text size="sm" c="dimmed">
            Pilih fokus utama yang sedang Anda jalani saat ini.
          </Text>
        </Stack>

        <Checkbox.Group
          {...form.getInputProps("currentActivityFocus")}
          key={form.key("currentActivityFocus")}
          name="currentActivityFocus"
        >
          <Stack gap="sm">
            {currentActivityFocusOptions.map((option) => (
              <Checkbox.Card
                key={option.value}
                value={option.value}
                radius="md"
                className={classes.checkboxItem}
              >
                <Group wrap="nowrap" align="flex-start">
                  <Checkbox.Indicator />
                  <Text className={classes.checkboxLabel}>{option.label}</Text>
                </Group>
              </Checkbox.Card>
            ))}
          </Stack>
        </Checkbox.Group>
      </Stack>
    </Stack>
  );
}

export function SalmanStep({ form }: StepFormProps) {
  return (
    <Stack gap="xl">
      <Stack gap={6}>
        <Title order={2}>Riwayat aktivitas di Salman</Title>
        <Text c="dimmed">
          Pilih aktivitas Salman yang pernah Anda ikuti.
        </Text>
      </Stack>

      <Checkbox.Group
        {...form.getInputProps("salmanActivityHistory")}
        key={form.key("salmanActivityHistory")}
        name="salmanActivityHistory"
      >
        <Stack gap="sm">
          {salmanActivityHistoryOptions.map((option) => (
            <Checkbox.Card
              key={option.value}
              value={option.value}
              radius="md"
              className={classes.checkboxItem}
            >
              <Group wrap="nowrap" align="flex-start">
                <Checkbox.Indicator />
                <Text className={classes.checkboxLabel}>{option.label}</Text>
              </Group>
            </Checkbox.Card>
          ))}
        </Stack>
      </Checkbox.Group>
    </Stack>
  );
}

function SectionHeader({
  title,
  description,
  onAdd,
}: {
  title: string;
  description: string;
  onAdd: () => void;
}) {
  return (
    <Group justify="space-between" align="center" className={classes.sectionHeader}>
      <div>
        <Title order={4}>{title}</Title>
        <Text size="sm" c="dimmed">
          {description}
        </Text>
      </div>
      <Button
        leftSection={<IconPlus size={18} />}
        variant="light"
        size="md"
        className={classes.addButton}
        onClick={onAdd}
      >
        Tambah
      </Button>
    </Group>
  );
}

function ListItemActions({
  isEditing,
  onEdit,
  onCancel,
  onSave,
  onDelete,
  editLabel,
  cancelLabel,
  saveLabel,
  deleteLabel,
}: {
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
  editLabel: string;
  cancelLabel: string;
  saveLabel: string;
  deleteLabel: string;
}) {
  return (
    <Group gap={4} justify="flex-end">
      {isEditing ? (
        <>
          <ActionIcon
            color="gray"
            variant="filled"
            size="lg"
            aria-label={cancelLabel}
            onClick={onCancel}
          >
            <IconX size={18} />
          </ActionIcon>
          <ActionIcon
            variant="filled"
            size="lg"
            aria-label={saveLabel}
            onClick={onSave}
          >
            <IconCheck size={18} />
          </ActionIcon>
        </>
      ) : (
        <>
          <ActionIcon
            variant="filled"
            size="lg"
            aria-label={editLabel}
            onClick={onEdit}
          >
            <IconPencil size={18} />
          </ActionIcon>
          <ActionIcon
            color="red"
            variant="filled"
            size="lg"
            aria-label={deleteLabel}
            onClick={onDelete}
          >
            <IconTrash size={18} />
          </ActionIcon>
        </>
      )}
    </Group>
  );
}

type ReviewStepProps = StepFormProps & {
  profileData?: {
    userData: PublicUser;
    profile: Member;
  };
  countryData: Country[];
  provinceData: Province[];
  currentCities: City[];
  originCities: City[];
};

export function ReviewStep({
  form,
  profileData,
  countryData,
  provinceData,
  currentCities,
  originCities,
}: ReviewStepProps) {
  return (
    <Stack gap="lg">
      <Stack gap={6}>
        <Title order={2}>Tinjau data Anda</Title>
        <Text c="dimmed" size="md">
          Pastikan semua informasi sudah benar sebelum dikirim.
        </Text>
      </Stack>

      <Alert
        color={
          form.values.mode === "account"
            ? "blue"
            : form.values.mode === "login"
              ? "teal"
              : "gray"
        }
        variant="light"
        icon={
          form.values.mode === "no_account" ? (
            <IconUserOff size={18} />
          ) : (
            <IconUser size={18} />
          )
        }
      >
        {form.values.mode === "account"
          ? "Anda akan membuat akun baru dan langsung menyimpan profil lengkap."
          : form.values.mode === "login"
            ? "Anda akan memperbarui profil dari akun yang sudah login."
            : "Anda akan mengirim profil tanpa akun. Sistem tetap mencatat profil publik Anda."}
      </Alert>

      <Paper
        withBorder
        radius="lg"
        p={{ base: "md", sm: "lg" }}
        className={classes.summaryCard}
      >
        <Stack gap="lg">
          <Stack gap="xs">
            <Text fw={700}>Informasi akun</Text>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
              <SummaryItem
                label="Mode pendaftaran"
                value={
                  form.values.mode === "account"
                    ? "Buat akun"
                    : form.values.mode === "login"
                      ? "Masuk ke akun yang sudah ada"
                      : "Lanjut tanpa akun"
                }
              />
              {form.values.mode === "account" || form.values.mode === "login" ? (
                <SummaryItem
                  label="Email akun"
                  value={profileData?.userData.email || form.values.email || "-"}
                />
              ) : null}
            </SimpleGrid>
          </Stack>

          <Divider />

          <Stack gap="xs">
            <Text fw={700}>Data diri</Text>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
              <SummaryItem label="Nama lengkap" value={form.values.name || "-"} />
              <SummaryItem
                label="Nama panggilan"
                value={form.values.preferredName || "-"}
              />
              <SummaryItem
                label="Jenis kelamin"
                value={
                  GENDER_OPTION.find((option) => option.value === form.values.gender)
                    ?.label || "-"
                }
              />
              <SummaryItem
                label="Tanggal lahir"
                value={
                  form.values.birthDate
                    ? form.values.birthDate.toLocaleDateString("id-ID")
                    : "-"
                }
              />
            </SimpleGrid>
          </Stack>

          <Divider />

          <Stack gap="xs">
            <Text fw={700}>Kontak</Text>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
              <SummaryItem label="WhatsApp" value={form.values.whatsapp || "-"} />
              <SummaryItem label="Instagram" value={form.values.instagram || "-"} />
              <SummaryItem label="TikTok" value={form.values.tiktok || "-"} />
              <SummaryItem label="LinkedIn" value={form.values.linkedin || "-"} />
            </SimpleGrid>
          </Stack>

          <Divider />

          <Stack gap="xs">
            <Text fw={700}>Alamat</Text>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
              <SummaryItem
                label="Negara domisili"
                value={getCountryLabel(form.values.country, countryData)}
              />
              <SummaryItem
                label="Provinsi domisili"
                value={getLocationLabel(form.values.provinceId, provinceData)}
              />
              <SummaryItem
                label="Kota/kabupaten domisili"
                value={getLocationLabel(form.values.cityId, currentCities)}
              />
              <SummaryItem
                label="Provinsi asal"
                value={getLocationLabel(form.values.originProvinceId, provinceData)}
              />
              <SummaryItem
                label="Kota/kabupaten asal"
                value={getLocationLabel(form.values.originCityId, originCities)}
              />
            </SimpleGrid>
          </Stack>

          <Divider />

          <Stack gap="xs">
            <Text fw={700}>Riwayat pendidikan</Text>
            {form.values.educationHistory.length > 0 ? (
              <Stack gap="sm">
                {form.values.educationHistory.map((entry, index) => (
                  <Paper key={index} withBorder radius="md" p="sm">
                    <Text fw={600}>Riwayat {index + 1}</Text>
                    <Text size="md">
                      Jenjang:{" "}
                      {degreeOptions.find((option) => option.value === entry.degree)
                        ?.label || "-"}
                    </Text>
                    <Text size="md">Institusi: {entry.institution || "-"}</Text>
                    <Text size="md">Jurusan: {entry.major || "-"}</Text>
                    <Text size="md">Tahun masuk: {entry.intakeYear || "-"}</Text>
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Text>-</Text>
            )}
          </Stack>

          <Divider />

          <Stack gap="xs">
            <Text fw={700}>Riwayat pekerjaan</Text>
            {form.values.workHistory.length > 0 ? (
              <Stack gap="sm">
                {form.values.workHistory.map((entry, index) => (
                  <Paper key={index} withBorder radius="md" p="sm">
                    <Text fw={600}>Pekerjaan {index + 1}</Text>
                    <Text size="md">Posisi/jabatan: {entry.jobTitle || "-"}</Text>
                    <Text size="md">
                      Perusahaan/tempat: {entry.company || "-"}
                    </Text>
                    <Text size="md">Tahun mulai: {entry.startYear ?? "-"}</Text>
                    <Text size="md">Tahun selesai: {entry.endYear ?? "-"}</Text>
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Text>-</Text>
            )}
          </Stack>

          <Divider />

          <Stack gap="xs">
            <Text fw={700}>Aktivitas</Text>
            <SummaryItem
              label="Riwayat aktivitas di Salman"
              value={
                form.values.salmanActivityHistory.length > 0
                  ? form.values.salmanActivityHistory
                      .map(getSalmanHistoryLabel)
                      .join(", ")
                  : "-"
              }
            />
            <SummaryItem
              label="Fokus aktivitas saat ini"
              value={
                form.values.currentActivityFocus.length > 0
                  ? form.values.currentActivityFocus.map(getFocusLabel).join(", ")
                  : "-"
              }
            />
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <Text size="md" fw={700} className={classes.summaryLabel}>
        {label}
      </Text>
      <Text size="md">{value}</Text>
    </div>
  );
}

type ActionBarProps = {
  currentStep: number;
  isLastStep: boolean;
  activeStepId: StepId;
  mode: OnboardingFormValues["mode"];
  isExistingAccountLoggedIn: boolean;
  isCredentialPending: boolean;
  isSubmitPending: boolean;
  isRedirectPending: boolean;
  onPrev: () => void;
};

export function OnboardingActionBar({
  currentStep,
  isLastStep,
  activeStepId,
  mode,
  isExistingAccountLoggedIn,
  isCredentialPending,
  isSubmitPending,
  isRedirectPending,
  onPrev,
}: ActionBarProps) {
  return (
    <Group
      justify="space-between"
      className={classes.actions}
      data-last-step={isLastStep ? true : undefined}
    >
      <Button
        variant="default"
        leftSection={<IconChevronLeft size={18} />}
        onClick={onPrev}
        disabled={currentStep === 0}
      >
        Kembali
      </Button>
      {isLastStep ? (
        <Button
          type="submit"
          rightSection={<IconCheck size={18} />}
          loading={isSubmitPending || isRedirectPending}
          disabled={isSubmitPending || isRedirectPending}
        >
          {mode === "login" ? "Simpan profil" : "Kirim data"}
        </Button>
      ) : (
        <Button
          type="submit"
          rightSection={<IconArrowRight size={18} />}
          loading={isCredentialPending}
          disabled={isCredentialPending}
        >
          {activeStepId === "credentials" &&
          mode === "login" &&
          !isExistingAccountLoggedIn
            ? "Masuk dan lanjut"
            : "Lanjut"}
        </Button>
      )}
    </Group>
  );
}
