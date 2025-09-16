import { Container, Paper, Title, Text, rem } from "@mantine/core";
import AchievementForm from "@/features/leaderboard/AchievementForm";
import { verifySession } from "@/functions/server/session";
import { Member, PublicUser } from "@/types/model/members";
import { getProfile } from "@/services/profile";
import ErrorWrapper from "@/components/layout/Error";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Kirim Prestasi Anda",
};

export default async function Page() {
  let profileData:
    | {
        userData: PublicUser;
        profile: Member;
      }
    | undefined;

  const sessionData = await verifySession();

  if (!sessionData.session) redirect("/api/logout");

  try {
    profileData = await getProfile(sessionData.session || "");
  } catch (error: unknown) {
    if (typeof error === "string" && error !== "Unauthorized")
      return <ErrorWrapper message={error} />;
  }

  return (
    <Container size="sm" component="main" mt={rem(80)}>
      <Title ta="center" mb="xl">
        Kirim Prestasi Anda
      </Title>
      <Paper radius="md" withBorder p="lg">
        <Text c="dimmed" mb="lg">
          Isi form dibawah ini untuk mengirim prestasi anda. Prestasi anda akan
          diperiksa oleh admin sebelum ditambahkan ke leaderboard.
        </Text>
        <AchievementForm
          token={sessionData.session || ""}
          whatsapp={profileData?.profile.whatsapp}
          university_id={profileData?.profile.university_id?.toString()}
        />
      </Paper>
    </Container>
  );
}
