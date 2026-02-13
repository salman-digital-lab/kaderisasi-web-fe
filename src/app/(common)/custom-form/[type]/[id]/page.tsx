import { verifySession } from "@/functions/server/session";
import { getProfile } from "@/services/profile";
import { getProvinces } from "@/services/profile.cache";
import { getCustomFormByFeature } from "@/services/customForm";
import { Container, Paper, Title, Text } from "@mantine/core";
import { redirect } from "next/navigation";
import ErrorWrapper from "@/components/layout/Error";
import CustomFormContent from "@/features/customForm/CustomFormContent";
import { PublicUser, Member } from "@/types/model/members";
import { Province } from "@/types/model/province";

export default async function Page(props: {
  params: Promise<{ type: string; id: string }>;
}) {
  const params = await props.params;
  const { type, id } = params;

  let profileData:
    | {
        userData: PublicUser;
        profile: Member;
      }
    | undefined;
  let provinceData: Province[] | undefined;

  const sessionData = await verifySession();

  // Validate type
  if (!["activity", "club", "independent"].includes(type)) {
    return <ErrorWrapper message="Invalid form type" />;
  }

  // Map type to feature_type for API
  const featureTypeMap = {
    activity: "activity_registration",
    club: "club_registration",
    independent: "independent_form",
  } as const;

  const featureType = featureTypeMap[type as keyof typeof featureTypeMap];

  try {
    // Fetch custom form
    const customForm = await getCustomFormByFeature({
      feature_type: featureType,
      feature_id: type === "independent" ? undefined : Number(id),
    });

    if (!customForm) {
      return <ErrorWrapper message="Custom form not found" />;
    }

    // Fetch profile and provinces data
    provinceData = await getProvinces();
    profileData = await getProfile(sessionData.session || "");

    return (
      <Container
        size="md"
        component="main"
        py={{ base: "md", sm: "xl" }}
        px={{ base: "xs", sm: "md" }}
      >
        <Paper
          radius="md"
          withBorder
          p={{ base: "md", sm: "xl" }}
          style={{ width: "100%", maxWidth: "100%" }}
        >
          <CustomFormContent
            customForm={customForm}
            profileData={profileData}
            provinceData={provinceData}
            featureType={featureType}
            featureId={type === "independent" ? undefined : Number(id)}
          />
        </Paper>
      </Container>
    );
  } catch (error: unknown) {
    if (typeof error === "string" && error === "Unauthorized")
      redirect("/api/logout");
    if (typeof error === "string") return <ErrorWrapper message={error} />;
    return <ErrorWrapper message="An error occurred" />;
  }
}
