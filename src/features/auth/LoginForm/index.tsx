"use client";

import { useRouter } from "next/navigation";
import { Button, PasswordInput, TextInput } from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";

import showNotif from "@/functions/common/notification";
import login from "@/functions/server/login";

export default function LoginForm({ redirect }: { redirect?: string }) {
  const router = useRouter();

  const form = useForm({
    mode: "controlled",
    initialValues: { password: "", email: "" },
    validate: {
      email: isEmail("Tolong masukkan email yang valid"),
    },
  });

  const handleLogin = async (loginFormData: {
    email: string;
    password: string;
  }) => {
    try {
      const response = await login({
        ...loginFormData,
        email: loginFormData.email.toLowerCase(),
      });

      if (response.success) {
        showNotif("Anda berhasil masuk");
        router.push(redirect || "/");
      } else {
        showNotif(response.message, true);
      }
    } catch (error: unknown) {
      showNotif("Terjadi kesalahan pada sistem", true);
    }
  };

  return (
    <>
      <form id="login-form" onSubmit={form.onSubmit((val) => handleLogin(val))}>
        <TextInput
          {...form.getInputProps("email")}
          key={form.key("email")}
          label="Email"
          placeholder="Email Anda"
          required
        />
        <PasswordInput
          {...form.getInputProps("password")}
          key={form.key("password")}
          label="Password"
          placeholder="Password Anda"
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
        Masuk
      </Button>
    </>
  );
}
