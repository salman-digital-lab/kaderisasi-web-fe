import Link from "next/link";
import type { ReactElement } from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import ResetPasswordForm from "@/features/auth/ResetPasswordForm";
import classes from "@/components/layout/AuthLayout.module.css";

export const metadata = { title: "Ubah password" };

export default function Page(): ReactElement {
  return (
    <AuthLayout
      title="Ubah password"
      description="Buat password baru untuk mengamankan akun Anda."
      alternate={
        <Link href="/login" className={classes.link}>
          Kembali ke halaman masuk
        </Link>
      }
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}
