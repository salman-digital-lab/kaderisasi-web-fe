import Link from "next/link";
import { Text } from "@mantine/core";
import type { ReactElement } from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import LoginForm from "@/features/auth/LoginForm";
import classes from "@/components/layout/AuthLayout.module.css";
import GoogleLogin from "@/features/auth/GoogleLogin";
import { getAuthRedirect } from "@/features/auth/redirect";

export const metadata = {
  title: "Masuk",
  description:
    "Masuk ke akun Kaderisasi Salman untuk mendaftar kegiatan, mengakses Ruang Curhat, dan melihat status pendaftaran Anda.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<ReactElement> {
  const query = await searchParams;
  const redirect = getAuthRedirect(
    Array.isArray(query.redirect) ? query.redirect[0] : query.redirect,
  );
  const error =
    typeof query.googleError === "string" ? query.googleError : undefined;
  return (
    <AuthLayout
      title="Masuk ke akun"
      description="Lanjutkan kegiatan dan kelola profil Kaderisasi Salman Anda."
      alternate={
        <>
          Belum punya akun?{" "}
          <Link
            className={classes.link}
            href={
              redirect
                ? `/register?redirect=${encodeURIComponent(redirect)}`
                : "/register"
            }
          >
            Buat akun
          </Link>
        </>
      }
    >
      <GoogleLogin redirect={redirect} error={error} />
      <LoginForm redirect={redirect} />
      <Text ta="right" mt="md" size="sm">
        <Link className={classes.link} href="/forgot">
          Lupa password?
        </Link>
      </Text>
    </AuthLayout>
  );
}
