import { redirect } from "next/navigation";
import CustomFieldsForm from "@/features/customForm/CustomFieldsForm";
import { verifySession } from "@/functions/server/session";
import { getCustomFormByFeature } from "@/services/customForm";
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

export const metadata = {
  title: "Formulir Tambahan",
};

export default async function Page(props: {
  params: Promise<{ featureType: string; featureId: string }>;
}) {
  const params = await props.params;
  const featureType = params.featureType as 'activity_registration' | 'club_registration';
  const featureId = parseInt(params.featureId);
  const sessionData = await verifySession();

  if (sessionData.session === null) redirect('/api/logout');

  const customForm = await getCustomFormByFeature({
    feature_type: featureType,
    feature_id: featureId,
  });

  if (!customForm) {
    return <div>Custom form not found</div>;
  }

  return (
    <Container size="sm" component="main" mt="xl">
      <Title ta="center" m="xl">
        {customForm.form_name}
      </Title>
      {customForm.form_description && (
        <div
          dangerouslySetInnerHTML={{ __html: customForm.form_description }}
          style={{ textAlign: 'center', marginBottom: '1rem' }}
        />
      )}
      <Stepper active={1} visibleFrom="sm">
        <StepperStep label="Data Diri" description="Lengkapi Data Diri" />
        <StepperStep label="Formulir" description="Isi Formulir Tambahan" />
        <StepperStep label="Tahap Akhir" description="Hasil Pendaftaran" />
      </Stepper>

      <Stack align="center" gap={0} hiddenFrom="sm">
        <RingProgress
          sections={[{ value: 66, color: "blue" }]}
          label={
            <Text c="blue" fw={700} ta="center" size="xl">
              2/3
            </Text>
          }
        />
        <Title order={4}>Formulir</Title>
        <Text c="dimmed">Isi Formulir Tambahan</Text>
      </Stack>

      <Paper radius="md" withBorder p="lg" mt="xl">
        <CustomFieldsForm
          token={sessionData.session || ""}
          customForm={customForm}
          featureType={featureType}
          featureId={featureId}
        />
      </Paper>
    </Container>
  );
}
