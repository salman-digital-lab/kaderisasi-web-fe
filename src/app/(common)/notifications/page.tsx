import { Suspense, type ReactElement } from "react";
import { Skeleton } from "@mantine/core";
import { redirect } from "next/navigation";
import { createHash } from "node:crypto";
import { getToken } from "@/functions/auth/getToken";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import Inbox from "@/features/notifications/Inbox";

export const metadata = { title: "Notifikasi" };
async function AuthenticatedInbox(): Promise<ReactElement> {
  const token = await getToken();
  if (!token) redirect("/login?redirect=/notifications");
  return <Inbox key={createHash("sha256").update(token).digest("hex")} />;
}
export default function Page(): ReactElement {
  return (
    <PageContainer size="md">
      <PageHeader
        title="Notifikasi"
        description="Pengumuman untuk Anda dari pengelola."
      />
      <Suspense fallback={<Skeleton height={160} />}>
        <AuthenticatedInbox />
      </Suspense>
    </PageContainer>
  );
}
