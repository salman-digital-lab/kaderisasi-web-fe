import ActivityForm from "../../../../../../features/activity/ActivityForm";
import { verifySession } from "../../../../../../functions/server/session";
import { getActivity } from "../../../../../../services/activity";
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
  const activity = await getActivity(params);
  const sessionData = await verifySession();

  return (
    <Container size="sm" component="main" mt="xl">
      <Title ta="center" m="xl">
        {params.slug}
      </Title>
      <Stepper active={1} visibleFrom="sm">
        <StepperStep label="Data Diri" description="Lengkapi Data Diri" />
        <StepperStep label="Formulir" description="Isi Formulir Pendaftaran" />
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
        <Text c="dimmed">Isi Formulir Pendaftaran</Text>
      </Stack>

      <Paper radius="md" withBorder p="lg" mt="xl">
        <ActivityForm
          token={sessionData.session || ""}
          slug={params.slug}
          formSchemas={
            activity?.additional_config?.additional_questionnaire || []
          }
        />
      </Paper>
    </Container>
  );
}
