"use client";

import { useState } from "react";
import { Button, Select, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

import { postRuangCurhat } from "@/services/ruangcurhat";
import showNotif from "@/functions/common/notification";
import { PROBLEM_OWNER_OPTIONS } from "@/constants/form/ruangcurhat";
import { PROBLEM_OWNER_ENUM } from "@/types/constants/ruangcurhat";
import classes from "./index.module.css";

type RegistrationFormProps = {
  token: string;
};

type RegistrationFormItems = {
  problem_ownership: string;
  problem_category: string;
  problem_description: string;
  handling_technic: string;
  counselor_gender: string;
};

export default function RegistrationForm({ token }: RegistrationFormProps) {
  const [loading, setLoading] = useState(false);
  const [isFriend, setIsFriend] = useState(false);

  const form = useForm({
    initialValues: {
      problem_ownership: "",
      owner_name: "",
      problem_category: "",
      problem_description: "",
      handling_technic: "",
      counselor_gender: "",
    },
  });

  form.watch("problem_ownership", ({ value }) => {
    setIsFriend(value === String(PROBLEM_OWNER_ENUM.TEMAN));
  });

  const handleRegistration = async (val: RegistrationFormItems) => {
    try {
      setLoading(true);
      const resp = await postRuangCurhat(token, {
        ...val,
        problem_ownership: Number(val.problem_ownership),
      });
      if (resp) {
        showNotif(resp.message);
        form.reset();
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
      <Select
        {...form.getInputProps("problem_ownership")}
        key={form.key("problem_ownership")}
        label="Kepemilikan Masalah"
        placeholder="Pilih Kepemilikan Masalah"
        data={PROBLEM_OWNER_OPTIONS}
        required
      />
      {isFriend && (
        <TextInput
          {...form.getInputProps("owner_name")}
          key={form.key("owner_name")}
          label="Nama Pemilik Masalah"
          placeholder="Nama Pemilik Masalah"
          required
        />
      )}

      <Select
        {...form.getInputProps("problem_category")}
        key={form.key("problem_category")}
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
        {...form.getInputProps("problem_description")}
        key={form.key("problem_description")}
        label="Deskripsi masalah yang akan didiskusikan"
        placeholder="Ketikkan detil masalah anda"
        required
      />
      <Select
        {...form.getInputProps("handling_technic")}
        key={form.key("handling_technic")}
        label="Teknik Penanganan"
        placeholder="Pilih Teknik Penanganan"
        data={["Online", "Langsung Bertemu"]}
        required
      />
      <Select
        {...form.getInputProps("counselor_gender")}
        key={form.key("counselor_gender")}
        label="Preferensi Konselor"
        placeholder="Pilih Preferensi Konselor"
        data={["Laki-laki", "Perempuan"]}
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
