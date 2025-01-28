import ErrorWrapper from "@/components/layout/Error";
import ProfileForm from "@/features/activity/ProfileForm";
import { verifySession } from "@/functions/server/session";
import { getActivity } from "@/services/activity";
import { getProfile, getProvinces } from "@/services/profile";
import { PublicUser, Member } from "@/types/model/members";
import { Province } from "@/types/model/province";

import {
  Container,
  Paper,
  RingProgress,
  Stepper,
  StepperStep,
  Title,
  Text,
  Stack,
} from "@mantine/core";

export default async function Page({ params }: { params: { slug: string } }) {
  let provinceData: Province[] | undefined;
  let profileData:
    | {
      userData: PublicUser;
      profile: Member;
    }
    | undefined;

  const sessionData = await verifySession();
  const activity = await getActivity(params);

  try {
    provinceData = await getProvinces();
    profileData = await getProfile(sessionData.session || "");
  } catch (error: unknown) {
    if (typeof error === "string") return <ErrorWrapper message={error} />;
  }

  return (
    <Container size="sm" component="main" mt="xl">
      <Title ta="center" m="xl">
        {activity?.name}
      </Title>
      <Stepper active={0} visibleFrom="sm">
        <StepperStep label="Data Diri" description="Lengkapi Data Diri" />
        <StepperStep label="Formulir" description="Isi Formulir Pendaftaran" />
        <StepperStep label="Tahap Akhir" description="Hasil Pendaftaran" />
      </Stepper>

      <Stack align="center" gap={0} hiddenFrom="sm">
        <RingProgress
          sections={[{ value: 33, color: "blue" }]}
          label={
            <Text c="blue" fw={700} ta="center" size="xl">
              1/3
            </Text>
          }
        />
        <Title order={4}>Data Diri</Title>
        <Text c="dimmed">Lengkapi Data Diri</Text>
      </Stack>

      <Paper radius="md" withBorder p="lg" mt="xl">
        <ProfileForm
          provinces={provinceData}
          profileData={profileData}
          mandatoryProfileData={
            activity.additional_config.mandatory_profile_data || []
          }
          slug={params.slug}
        />
      </Paper>
    </Container>
  );
}
