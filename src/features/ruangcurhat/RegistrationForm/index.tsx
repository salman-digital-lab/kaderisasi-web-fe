"use client";

import { useState } from "react";
import { Button, Select, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

import { postRuangCurhat } from "@/services/ruangcurhat";
import showNotif from "@/functions/common/notification";
import { PROBLEM_OWNER_OPTIONS } from "@/constants/form/ruangcurhat";
import { PROBLEM_OWNER_ENUM } from "@/types/constants/ruangcurhat";
import { GENDER } from "@/types/constants/profile";
import classes from "./index.module.css";
import editProfile from "@/functions/server/editProfile";
import { GENDER_OPTION } from "@/constants/form/profile";

type RegistrationFormProps = {
  token: string;
  whatsapp?: string;
  gender?: string;
};

type RegistrationFormItems = {
  whatsapp: string;
  gender?: string;
  owner_name?: string;
  problem_ownership?: string;
  problem_category?: string;
  problem_description?: string;
  handling_technic?: string;
  counselor_gender?: string;
};

export default function RegistrationForm({
  token,
  whatsapp,
  gender,
}: RegistrationFormProps) {
  const [loading, setLoading] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const form = useForm<RegistrationFormItems>({
    mode: "uncontrolled",
    initialValues: {
      whatsapp: whatsapp || "",
      gender: gender || undefined,
      problem_ownership: undefined,
      owner_name: undefined,
      problem_category: undefined,
      problem_description: undefined,
      handling_technic: undefined,
      counselor_gender: undefined,
    },
    validate: {
      whatsapp: (value) =>
        value === undefined ? "Whatsapp harus diisi" : null,
      gender: (value) =>
        value === undefined ? "Jenis kelamin harus diisi" : null,
      problem_ownership: (value) =>
        value === undefined ? "Kepemilikan masalah harus diisi" : null,
      owner_name: (value, { ...values }) =>
        values.problem_ownership === String(PROBLEM_OWNER_ENUM.TEMAN) &&
        value === undefined
          ? "Nama pemilik masalah harus diisi"
          : null,
      problem_category: (value) =>
        value === undefined ? "Kategori masalah harus diisi" : null,
      problem_description: (value) =>
        value === undefined ? "Deskripsi masalah harus diisi" : null,
      handling_technic: (value) =>
        value === undefined ? "Teknik penanganan harus diisi" : null,
      counselor_gender: (value) =>
        value === undefined ? "Preferensi konselor harus diisi" : null,
    },
  });

  form.watch("problem_ownership", ({ value }) => {
    setIsFriend(value === String(PROBLEM_OWNER_ENUM.TEMAN));
  });

  const handleRegistration = async (val: RegistrationFormItems) => {
    try {
      setLoading(true);
      await editProfile({ 
        whatsapp: val.whatsapp,
        gender: val.gender === "Laki-laki" ? GENDER.Male : GENDER.Female
      });
      const resp = await postRuangCurhat(token, {
        ...val,
        problem_ownership: Number(val.problem_ownership),
      });
      if (resp) {
        showNotif(
          "Tim Ruang Curhat akan segera menghubungimu.",
          false,
          "Pendaftaran berhasil!",
        );
        form.setValues({
          whatsapp: val.whatsapp,
          gender: val.gender,
          problem_ownership: undefined,
          owner_name: undefined,
          problem_category: undefined,
          problem_description: undefined,
          handling_technic: undefined,
          counselor_gender: undefined,
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error) showNotif(error.message, true);
      if (typeof error === "string") showNotif(error, true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className={classes.form}
      onSubmit={form.onSubmit((val) => handleRegistration(val))}
    >
      <TextInput
        key={form.key("whatsapp")}
        {...form.getInputProps("whatsapp")}
        label="Nomor Whatsapp"
        placeholder="Cth: 6281234567890"
        description="Cth: 6281234567890. Pastikan nomor whatsapp kamu aktif. Jangan khawatir, datamu aman."
        required
        mt="md"
      />
      <Select
        key={form.key("gender")}
        {...form.getInputProps("gender")}
        label="Jenis Kelamin"
        placeholder="Pilih Jenis Kelamin"
        description="Jenis kelamin kamu yang mengisi form ini"
        data={GENDER_OPTION}
        required
        mt="md"
      />
      <Select
        key={form.key("problem_ownership")}
        {...form.getInputProps("problem_ownership")}
        label="Kepemilikan Masalah"
        placeholder="Pilih Kepemilikan Masalah"
        data={PROBLEM_OWNER_OPTIONS}
        required
      />
      {isFriend && (
        <TextInput
          key={form.key("owner_name")}
          {...form.getInputProps("owner_name")}
          label="Nama Teman"
          placeholder="Nama teman yang memiliki masalah"
          required
        />
      )}

      <Select
        key={form.key("problem_category")}
        {...form.getInputProps("problem_category")}
        label="Kategori Masalah"
        placeholder="Pilih Kategori Masalah"
        data={[
          "Akademik",
          "Kesehatan Mental",
          "Keluarga",
          "Sosial",
          "Pengembangan Diri",
          "Lainnya",
        ]}
        required
      />
      <Textarea
        key={form.key("problem_description")}
        {...form.getInputProps("problem_description")}
        label="Deskripsi masalah yang akan didiskusikan"
        placeholder="Ketikkan detil masalah anda"
        required
      />
      <Select
        key={form.key("handling_technic")}
        {...form.getInputProps("handling_technic")}
        label="Teknik Penanganan"
        placeholder="Pilih Teknik Penanganan"
        data={["Online", "Langsung Bertemu"]}
        required
      />
      <Select
        key={form.key("counselor_gender")}
        {...form.getInputProps("counselor_gender")}
        label="Preferensi Konselor"
        placeholder="Pilih Preferensi Konselor"
        data={["Laki-laki", "Perempuan", "Keduanya"]}
        required
      />
      <Button
        loading={loading}
        disabled={loading}
        w="100%"
        type="submit"
        mt="md"
      >
        Kirim
      </Button>
    </form>
  );
}
