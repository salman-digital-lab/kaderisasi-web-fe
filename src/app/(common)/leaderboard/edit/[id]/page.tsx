import PageContainer from "@/components/layout/PageContainer";
import { Paper, Title, Text } from "@mantine/core";
import EditAchievementForm from "@/features/leaderboard/EditAchievementForm";
import { verifySession } from "@/functions/server/session";
import { redirect } from "next/navigation";
import { getMyAchievement } from "@/services/leaderboard";
import { FetcherError } from "@/functions/common/fetcher";

export const metadata = {
  title: "Edit Prestasi",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const param = await params;
  const sessionData = await verifySession();

  if (!sessionData.session) redirect("/api/logout");

  const achievement = await getMyAchievement(
    sessionData.session,
    param.id,
  ).catch((error: unknown) => {
    if (error instanceof FetcherError && error.status === 404) return undefined;
    if (error instanceof FetcherError && error.status === 401)
      redirect("/api/logout");
    throw error;
  });

  if (!achievement) redirect("/leaderboard");

  return (
    <PageContainer size="sm">
      <Title order={1} mb="xl">
        Edit Prestasi
      </Title>
      <Paper radius="md" withBorder p="lg">
        <Text c="dimmed" mb="lg">
          Isi form dibawah ini untuk memperbarui prestasi anda. Prestasi yang
          sudah diperbarui akan diperiksa ulang oleh admin.
        </Text>
        <EditAchievementForm
          token={sessionData.session || ""}
          achievement={achievement}
        />
      </Paper>
    </PageContainer>
  );
}
