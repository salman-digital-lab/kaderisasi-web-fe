import type { Metadata } from "next";
import type { ReactElement } from "react";
import { getToken } from "@/functions/auth/getToken";
import { redirect } from "next/navigation";
import StatusCheckContent from "@/features/status/StatusCheckContent";

export const metadata: Metadata = {
  title: "Cek Status Kegiatan | Kaderisasi Salman ITB",
  description: "Cek status pendaftaran kegiatan Anda di Kaderisasi Salman ITB",
};

export default async function StatusCheckPage(): Promise<ReactElement> {
  const token = await getToken();

  if (!token) {
    redirect("/login?redirect=/status");
  }

  return <StatusCheckContent />;
}
