import Link from "next/link";
import type { ReactElement } from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import RegistrationForm from "@/features/auth/RegistrationForm";
import classes from "@/components/layout/AuthLayout.module.css";
import GoogleLogin from "@/features/auth/GoogleLogin";
import { getAuthRedirect } from "@/features/auth/redirect";

export const metadata = {
  title: "Daftar",
  description:
    "Daftar akun Kaderisasi Salman untuk mengakses seluruh kegiatan pembinaan, pelatihan, dan layanan konseling Ruang Curhat.",
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
      title="Buat akun"
      description="Daftar untuk mengikuti kegiatan dan bertumbuh bersama Kaderisasi Salman."
      alternate={
        <>
          Sudah punya akun?{" "}
          <Link
            className={classes.link}
            href={
              redirect
                ? `/login?redirect=${encodeURIComponent(redirect)}`
                : "/login"
            }
          >
            Masuk
          </Link>
        </>
      }
    >
      <GoogleLogin redirect={redirect} mode="register" error={error} />
      <RegistrationForm redirect={redirect} />
    </AuthLayout>
  );
}
