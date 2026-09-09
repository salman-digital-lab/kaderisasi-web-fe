import Link from "next/link";
import type { ReactElement } from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import ForgotForm from "@/features/auth/ForgotForm";
import classes from "@/components/layout/AuthLayout.module.css";

export const metadata = { title: "Lupa password" };

export default function Page(): ReactElement {
  return (
    <AuthLayout
      title="Lupa password"
      description="Masukkan email akun Anda. Kami akan mengirimkan tautan untuk mengubah password."
      alternate={
        <Link href="/login" className={classes.link}>
          Kembali ke halaman masuk
        </Link>
      }
    >
      <ForgotForm />
    </AuthLayout>
  );
}
