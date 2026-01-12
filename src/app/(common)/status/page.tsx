import { Metadata } from "next";
import { getActivitiesRegistration } from "@/services/activity";
import { getToken } from "@/functions/auth/getToken";
import { redirect } from "next/navigation";
import StatusCheckContent from "@/features/status/StatusCheckContent";

export const metadata: Metadata = {
  title: "Cek Status Kegiatan | Kaderisasi Salman ITB",
  description: "Cek status pendaftaran kegiatan Anda di Kaderisasi Salman ITB",
};

export default async function StatusCheckPage() {
  const token = await getToken();

  if (!token) {
    redirect("/login?redirect=/status");
  }

  const activities = await getActivitiesRegistration(token);

  return <StatusCheckContent activities={activities || []} />;
}
