import { redirect } from "next/navigation";
import CustomFormContentEdit from "@/features/customForm/CustomFormContentEdit";
import { verifySession } from "@/functions/server/session";
import { getActivity, getActivityRegistrationData } from "@/services/activity";
import { getCustomFormByFeature } from "@/services/customForm";
import { Container, Paper, Title, Text } from "@mantine/core";

export const metadata = {
  title: "Ubah Data Pendaftaran",
};

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const activity = await getActivity(params);
  const sessionData = await verifySession();

  if (sessionData.session === null) redirect("/api/logout");

  const registrationData = await getActivityRegistrationData(
    sessionData.session || "",
    { slug: params.slug },
  );

  // Fetch custom form definition
  // We use the activity ID as the feature_id
  const customForm = await getCustomFormByFeature({
    feature_type: "activity_registration",
    feature_id: activity?.id,
  });

  if (!customForm) {
    return (
      <Container size="sm" component="main" mt="xl">
        <Title ta="center" m="xl">
          {activity?.name}
        </Title>
        <Paper radius="md" withBorder p="lg" mt="xl">
          <Text c="dimmed" ta="center">
            Formulir tidak ditemukan atau belum dikonfigurasi.
          </Text>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="sm" component="main" mt="xl">
      <Title ta="center" m="xl">
        {activity?.name}
      </Title>

      <Paper radius="md" withBorder p="lg" mt="xl">
        <CustomFormContentEdit
          customForm={customForm}
          registrationData={registrationData}
          slug={params.slug}
        />
      </Paper>
    </Container>
  );
}
