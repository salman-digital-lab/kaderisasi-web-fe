import Link from "next/link";
import type { ReactElement } from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import ConfirmEmail from "@/features/auth/ConfirmEmail";
import classes from "@/components/layout/AuthLayout.module.css";

export const metadata = { title: "Konfirmasi email baru" };

export default function Page(): ReactElement {
  return (
    <AuthLayout
      title="Konfirmasi email baru"
      description="Selesaikan perubahan email akun Kaderisasi Anda."
      alternate={
        <Link href="/profile" className={classes.link}>
          Ke halaman profil
        </Link>
      }
    >
      <ConfirmEmail />
    </AuthLayout>
  );
}
