"use client";

import { useRouter } from "next/navigation";

import { Button, TextInput } from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";

import showNotif from "@/functions/common/notification";
import { postForgotPassword } from "@/services/auth";

export default function ForgotForm() {
  const router = useRouter();

  const form = useForm({
    mode: "controlled",
    initialValues: { email: "" },
    validate: {
      email: isEmail("Invalid email"),
    },
  });

  const handleForgot = async (forgotFormData: { email: string }) => {
    try {
      const message = await postForgotPassword(forgotFormData);
      if (message) showNotif("Email berhasil dikirim!");
      router.push("/");
    } catch (error: unknown) {
      if (error instanceof Error) showNotif(error.message, true);
      if (typeof error === "string") showNotif(error, true);
    }
  };

  return (
    <>
      <form
        id="login-form"
        onSubmit={form.onSubmit((val) => handleForgot(val))}
      >
        <TextInput
          {...form.getInputProps("email")}
          key={form.key("email")}
          label="Email"
          placeholder="Email Anda"
          required
        />
      </form>
      <Button
        form="login-form"
        type="submit"
        fullWidth
        mt="xl"
        loading={form.submitting}
      >
        Kirim Email
      </Button>
    </>
  );
}
