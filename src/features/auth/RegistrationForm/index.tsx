"use client";

import { useRouter } from "next/navigation";
import { Button, PasswordInput, TextInput } from "@mantine/core";
import { hasLength, isEmail, matchesField, useForm } from "@mantine/form";

import showNotif from "@/functions/common/notification";
import register from "@/functions/server/register";

export default function RegistrationForm({ redirect }: { redirect?: string }) {
  const router = useRouter();

  const form = useForm({
    mode: "controlled",
    initialValues: {
      password: "",
      email: "",
      confirmPassword: "",
      fullname: "",
    },
    validate: {
      email: isEmail("Tolong masukkan email yang valid"),
      password: hasLength({ min: 6 }, "Minimal memiliki 6 karakter"),
      confirmPassword: matchesField("password", "Password tidak sama"),
    },
  });

  const handleRegistration = async (registrationFormData: {
    email: string;
    password: string;
    fullname: string;
  }) => {
    try {
      const response = await register({
        ...registrationFormData,
        email: registrationFormData.email.toLowerCase(),
      });

      if (response.success) {
        showNotif("Registrasi berhasil. Silahkan masuk ke akun anda.");
        router.push(redirect ? `/login?redirect=${redirect}` : "/login");
      } else {
        showNotif(response.message, true);
      }
    } catch (error: unknown) {
      showNotif("Terjadi kesalahan pada sistem", true);
    }
  };

  return (
    <>
      <form
        id="login-form"
        onSubmit={form.onSubmit((val) => handleRegistration(val))}
      >
        <TextInput
          {...form.getInputProps("fullname")}
          key={form.key("fullname")}
          label="Nama Lengkap"
          placeholder="Nama Lengkap Anda"
          required
        />
        <TextInput
          {...form.getInputProps("email")}
          key={form.key("email")}
          label="Email"
          placeholder="Email Anda"
          required
          mt="md"
        />
        <PasswordInput
          {...form.getInputProps("password")}
          key={form.key("password")}
          label="Password"
          placeholder="Password Anda"
          required
          mt="md"
        />
        <PasswordInput
          {...form.getInputProps("confirmPassword")}
          key={form.key("confirmPassword")}
          label="Konfirmasi Password"
          placeholder="Tulis Ulang Password Anda"
          required
          mt="md"
        />
      </form>
      <Button
        form="login-form"
        type="submit"
        fullWidth
        mt="xl"
        loading={form.submitting}
      >
        Daftar
      </Button>
    </>
  );
}
