import { Container, Paper, Title, Text } from "@mantine/core";
import AchievementForm from "@/features/leaderboard/AchievementForm";
import { verifySession } from "@/functions/server/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Kirim Prestasi Anda",
};

export default async function Page() {
  const sessionData = await verifySession();

  if (sessionData.session === null) redirect("/api/logout");

  return (
    <Container size="sm" component="main" mt="xl">
      <Title ta="center" mb="xl">
        Kirim Prestasi Anda
      </Title>
      <Paper radius="md" withBorder p="lg">
        <Text c="dimmed" mb="lg">
          Isi form dibawah ini untuk mengirim prestasi anda. Prestasi anda akan diperiksa oleh admin
          sebelum ditambahkan ke leaderboard.
        </Text>
        <AchievementForm token={sessionData.session || ""} />
      </Paper>
    </Container>
  );
}
