import { Alert, Divider, Text } from "@mantine/core";
import type { ReactElement } from "react";
import { startGoogleLogin } from "@/functions/server/startGoogleLogin";
import { getGoogleConfig } from "./google-config";
import GoogleLoginButton from "./GoogleLoginButton";

const errors: Record<string, string> = {
  GOOGLE_LOGIN_CANCELLED:
    "Masuk dengan Google dibatalkan. Coba lagi atau gunakan email dan password.",
  GOOGLE_LOGIN_EXPIRED: "Sesi masuk Google berakhir. Silakan coba lagi.",
  GOOGLE_LOGIN_UNAVAILABLE:
    "Masuk dengan Google belum tersedia. Gunakan email dan password untuk melanjutkan.",
  GOOGLE_EMAIL_PASSWORD_REQUIRED:
    "Untuk alamat email ini, silakan gunakan email dan password. Gunakan Lupa password jika perlu membuat atau memulihkan password.",
  GOOGLE_ACCOUNT_INACTIVE:
    "Akun Anda belum aktif. Hubungi admin untuk bantuan.",
};

export default function GoogleLogin({
  redirect = "/",
  mode = "login",
  error,
}: {
  redirect?: string;
  mode?: "login" | "register";
  error?: string;
}): ReactElement {
  const enabled = Boolean(getGoogleConfig());
  return (
    <>
      {error ? (
        <Alert color="red" mb="md" title="Belum berhasil masuk">
          {errors[error] ||
            "Tidak dapat masuk dengan Google. Coba lagi atau gunakan email dan password."}
        </Alert>
      ) : null}
      {enabled ? (
        <>
          <form action={startGoogleLogin}>
            <input type="hidden" name="redirect" value={redirect} />
            <input type="hidden" name="mode" value={mode} />
            <GoogleLoginButton />
          </form>
          <Text size="sm" c="dimmed" mt="xs">
            Email yang sama akan masuk ke akun Anda. Jika belum punya akun, akun
            akan dibuat otomatis.
          </Text>
          {mode === "register" ? (
            <Text size="sm" c="dimmed" mt="xs">
              Tidak perlu membuat password sekarang. Anda bisa membuatnya nanti
              melalui Lupa password.
            </Text>
          ) : null}
          <Divider label="atau dengan email" my="lg" />
        </>
      ) : null}
    </>
  );
}
