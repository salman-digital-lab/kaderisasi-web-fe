"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button, PasswordInput } from "@mantine/core";
import { hasLength, matchesField, useForm } from "@mantine/form";

import showNotif from "@/functions/common/notification";
import { putResetPassword } from "@/services/auth";
import { Suspense } from "react";

function Component() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm({
    mode: "controlled",
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validate: {
      password: hasLength({ min: 6 }, "Minimal memiliki 6 karakter"),
      confirmPassword: matchesField("password", "Password tidak sama"),
    },
  });

  const handleResetPassword = async (resetPasswordFormData: {
    password: string;
  }) => {
    try {
      const message = await putResetPassword(
        searchParams.get("token") || "",
        resetPasswordFormData,
      );
      if (message)
        showNotif("Password berhasil diubah. Silahkan masuk ke akun anda.");
      router.push("/login");
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof Error) showNotif(error.message, true);
      if (typeof error === "string") showNotif(error, true);
    }
  };

  return (
    <>
      <form
        id="login-form"
        onSubmit={form.onSubmit((val) => handleResetPassword(val))}
      >
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
        Ubah Password
      </Button>
    </>
  );
}

export default function ResetPasswordForm() {
  return (
    <Suspense>
      <Component />
    </Suspense>
  );
}
