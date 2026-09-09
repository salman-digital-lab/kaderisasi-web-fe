import Link from "next/link";
import type { ReactElement } from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import RegistrationForm from "@/features/auth/RegistrationForm";
import classes from "@/components/layout/AuthLayout.module.css";

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
  const query = (await searchParams).redirect;
  const value = Array.isArray(query) ? query[0] : query;
  const redirect = value && value !== "undefined" ? value : undefined;
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
      <RegistrationForm redirect={redirect} />
    </AuthLayout>
  );
}
