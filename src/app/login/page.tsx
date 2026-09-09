import Link from "next/link";
import { Text } from "@mantine/core";
import type { ReactElement } from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import LoginForm from "@/features/auth/LoginForm";
import classes from "@/components/layout/AuthLayout.module.css";

export const metadata = {
  title: "Masuk",
  description:
    "Masuk ke akun Kaderisasi Salman untuk mendaftar kegiatan, mengakses Ruang Curhat, dan melihat status pendaftaran Anda.",
};

function normalizeRedirect(redirect: string | string[] | undefined) {
  const value = Array.isArray(redirect) ? redirect[0] : redirect;

  if (!value || value === "undefined") {
    return undefined;
  }

  return value;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<ReactElement> {
  const redirect = normalizeRedirect((await searchParams).redirect);
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
      <LoginForm redirect={redirect} />
      <Text ta="right" mt="md" size="sm">
        <Link className={classes.link} href="/forgot">
          Lupa password?
        </Link>
      </Text>
    </AuthLayout>
  );
}
