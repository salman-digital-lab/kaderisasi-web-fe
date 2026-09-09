import PageContainer from "@/components/layout/PageContainer";
import { Paper, Title, Text } from "@mantine/core";
import EditAchievementForm from "@/features/leaderboard/EditAchievementForm";
import { verifySession } from "@/functions/server/session";
import { redirect } from "next/navigation";
import { getMyAchievements } from "@/services/leaderboard";

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

  const achievements = await getMyAchievements(sessionData.session);
  const achievement = achievements.find(
    (achievement) => achievement.id === parseInt(param.id),
  );

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
