import { verifySession } from "@/functions/server/session";
import { getProfile } from "@/services/profile";
import { getProvinces } from "@/services/profile.cache";
import { getCustomFormByFeature } from "@/services/customForm";
import { getActivity } from "@/services/activity.cache";
import { Container, Paper } from "@mantine/core";
import { redirect } from "next/navigation";
import ErrorWrapper from "@/components/layout/Error";
import CustomFormContent from "@/features/customForm/CustomFormContent";
import { PublicUser, Member } from "@/types/model/members";
import { Province } from "@/types/model/province";
import { ACTIVITY_TYPE_ENUM } from "@/types/constants/activity";

export default async function Page(props: {
  params: Promise<{ type: string; id: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
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

  // Guest mode: no session + activity registration + slug provided + REGISTRATION_ONLY type
  const activitySlug = searchParams.slug;
  let isGuest = false;

  if (!sessionData.session && featureType === "activity_registration" && activitySlug) {
    const activityData = await getActivity({ slug: activitySlug }).catch(() => null);
    isGuest =
      !!activityData &&
      activityData.activity_type === ACTIVITY_TYPE_ENUM.REGISTRATION_ONLY &&
      !!activityData.additional_config?.allow_guest_registration;
  }

  try {
    // Fetch custom form
    const customForm = await getCustomFormByFeature({
      feature_type: featureType,
      feature_id: type === "independent" ? undefined : Number(id),
    });

    if (!customForm) {
      return <ErrorWrapper message="Custom form not found" />;
    }

    // Fetch profile and provinces data (skip for guests)
    provinceData = await getProvinces();
    if (!isGuest) {
      profileData = await getProfile(sessionData.session || "");
    }

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
            isGuest={isGuest}
            activitySlug={activitySlug}
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
