import { redirect } from "next/navigation";
import ActivityFormUpdate from "../../../../../../features/activity/ActivityFormUpdate";
import { verifySession } from "../../../../../../functions/server/session";
import {
  getActivity,
  getActivityRegistrationData,
} from "../../../../../../services/activity";
import { Container, Paper, Title } from "@mantine/core";

export const metadata = {
  title: "Daftar Kegiatan",
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

  return (
    <Container size="sm" component="main" mt="xl">
      <Title ta="center" m="xl">
        {activity?.name}
      </Title>

      <Paper radius="md" withBorder p="lg" mt="xl">
        <ActivityFormUpdate
          registrationData={registrationData}
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
