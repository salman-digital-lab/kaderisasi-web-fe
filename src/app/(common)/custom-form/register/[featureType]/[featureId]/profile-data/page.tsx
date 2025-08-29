import ErrorWrapper from "@/components/layout/Error";
import CustomProfileForm from "@/features/customForm/CustomProfileForm";
import { verifySession } from "@/functions/server/session";
import { getCustomFormByFeature } from "@/services/customForm";
import { getProfile, getProvinces } from "@/services/profile";
import { CustomForm } from "@/types/api/customForm";
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
import { redirect } from "next/navigation";

export const metadata = {
  title: "Data Diri",
};

export default async function Page(props: {
  params: Promise<{ featureType: string; featureId: string }>;
}) {
  const params = await props.params;
  let provinceData: Province[] | undefined;
  let profileData:
    | {
        userData: PublicUser;
        profile: Member;
      }
    | undefined;
  let customForm: CustomForm | undefined;

  const sessionData = await verifySession();
  const featureType = params.featureType as 'activity_registration' | 'club_registration';
  const featureId = parseInt(params.featureId);

  try {
    provinceData = await getProvinces();
    profileData = await getProfile(sessionData.session || "");
    customForm = await getCustomFormByFeature({
      feature_type: featureType,
      feature_id: featureId,
    });
  } catch (error: unknown) {
    if (typeof error === "string" && error === "Unauthorized")
      redirect("/api/logout");
    if (typeof error === "string") return <ErrorWrapper message={error} />;
  }

  if (!customForm) {
    return <ErrorWrapper message="Custom form not found" />;
  }

  return (
    <Container size="sm" component="main" mt="xl">
      <Title ta="center" m="xl">
        {customForm.form_name}
      </Title>
      <Stepper active={0} visibleFrom="sm">
        <StepperStep label="Data Diri" description="Lengkapi Data Diri" />
        <StepperStep label="Formulir" description="Isi Formulir Tambahan" />
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
        <CustomProfileForm
          provinces={provinceData}
          profileData={profileData}
          customForm={customForm}
          featureType={featureType}
          featureId={featureId}
        />
      </Paper>
    </Container>
  );
}
