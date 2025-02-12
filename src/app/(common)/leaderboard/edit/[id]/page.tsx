import { Container, Paper, Title, Text, rem } from "@mantine/core";
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
  params: { id: string };
}) {
  const sessionData = await verifySession();

  if (!sessionData.session) redirect("/api/logout");

  const achievements = await getMyAchievements(sessionData.session);
  const achievement = achievements.find(
    (achievement) => achievement.id === parseInt(params.id)
  );

  if (!achievement) redirect("/leaderboard");

  return (
    <Container size="sm" component="main" mt={rem(80)}>
      <Title ta="center" mb="xl">
        Edit Prestasi
      </Title>
      <Paper radius="md" withBorder p="lg">
        <Text c="dimmed" mb="lg">
          Isi form dibawah ini untuk memperbarui prestasi anda. Prestasi yang sudah diperbarui akan
          diperiksa ulang oleh admin.
        </Text>
        <EditAchievementForm token={sessionData.session || ""} achievement={achievement} />
      </Paper>
    </Container>
  );
} 