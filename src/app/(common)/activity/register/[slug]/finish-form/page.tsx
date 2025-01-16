import ActivityForm from "../../../../../../features/activity/ActivityForm";
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
  Button,
} from "@mantine/core";
import Link from "next/link";

export default async function Page({ params }: { params: { slug: string } }) {
  // const activity = await getActivity(params);

  return (
    <Container size="sm" component="main" mt="xl">
      <Title ta="center" m="xl">
        {params.slug}
      </Title>
      <Stepper active={2} visibleFrom="sm">
        <StepperStep label="Data Diri" description="Lengkapi Data Diri" />
        <StepperStep label="Formulir" description="Isi Formulir Pendaftaran" />
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
        <Title order={4}>Formulir</Title>
        <Text c="dimmed">Isi Formulir Pendaftaran</Text>
      </Stack>

      <Paper radius="md" withBorder p="lg" mt="xl">
        <Stack gap="md">
          <Title ta="center">Pendaftaran Anda Berhasil</Title>
          <Text ta="center">
            Silahkan menunggu hasil pendaftaran anda dan mengecek bagian
            kegiatan pada profil anda secara berkala.
          </Text>
          <Button component={Link} href="/">
            Kembali ke Beranda
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
