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
import { getActivity } from "../../../../../../services/activity";
export const metadata = {
  title: "Selesai Pendaftaran",
};

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const activity = await getActivity(params);

  return (
    <Container size="sm" component="main" mt="xl">
      <Title ta="center" m="xl">
        {activity?.name}
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
