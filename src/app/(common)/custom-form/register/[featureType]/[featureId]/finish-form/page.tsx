import {
  Container,
  Paper,
  RingProgress,
  Stepper,
  StepperStep,
  Title,
  Text,
  Stack,
  Button,
} from "@mantine/core";
import Link from "next/link";
import { getCustomFormByFeature } from "@/services/customForm";

export const metadata = {
  title: "Selesai Pendaftaran",
};

export default async function Page(props: {
  params: Promise<{ featureType: string; featureId: string }>;
}) {
  const params = await props.params;
  const featureType = params.featureType as 'activity_registration' | 'club_registration';
  const featureId = parseInt(params.featureId);

  const customForm = await getCustomFormByFeature({
    feature_type: featureType,
    feature_id: featureId,
  });

  return (
    <Container size="sm" component="main" mt="xl">
      <Title ta="center" m="xl">
        {customForm?.form_name || "Formulir Tambahan"}
      </Title>
      <Stepper active={2} visibleFrom="sm">
        <StepperStep label="Data Diri" description="Lengkapi Data Diri" />
        <StepperStep label="Formulir" description="Isi Formulir Tambahan" />
        <StepperStep label="Tahap Akhir" description="Hasil Pendaftaran" />
      </Stepper>

      <Stack align="center" gap={0} hiddenFrom="sm">
        <RingProgress
          sections={[{ value: 100, color: "blue" }]}
          label={
            <Text c="blue" fw={700} ta="center" size="xl">
              3/3
            </Text>
          }
        />
        <Title order={4}>Selesai</Title>
        <Text c="dimmed">Pendaftaran Berhasil</Text>
      </Stack>

      <Paper radius="md" withBorder p="lg" mt="xl">
        <Stack gap="md">
          <Title ta="center">Pendaftaran Anda Berhasil</Title>
          <Text ta="center">
            Terima kasih telah mengisi formulir pendaftaran.
            Silahkan menunggu hasil pendaftaran dan mengecek bagian
            {featureType === 'activity_registration' ? 'kegiatan' : 'klub'}
            pada profil anda secara berkala.
          </Text>
          <Button component={Link} href="/">
            Kembali ke Beranda
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
