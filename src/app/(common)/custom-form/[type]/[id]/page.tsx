import { verifySession } from "@/functions/server/session";
import { getProfile } from "@/services/profile";
import { getProvinces, getCountries } from "@/services/profile.cache";
import { getCustomFormByFeature } from "@/services/customForm";
import { getActivity } from "@/services/activity.cache";
import { getClub } from "@/services/club";
import { getRegistrationStatus } from "@/services/clubRegistration";
import { Container } from "@mantine/core";
import { redirect } from "next/navigation";
import ErrorWrapper from "@/components/layout/Error";
import { FetcherError } from "@/functions/common/fetcher";
import CustomFormContent from "@/features/customForm/CustomFormContent";
import type { PublicUser, Member } from "@/types/model/members";
import type { Province } from "@/types/model/province";
import type { Country } from "@/types/model/country";
import { ACTIVITY_TYPE_ENUM } from "@/types/constants/activity";
import { isClubRegistrationOpen } from "@/features/clubs/registration-state";

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
  let countryData: Country[] | undefined;

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

  if (
    type === "club" &&
    (!/^\d+$/.test(id) || !Number.isSafeInteger(Number(id)) || Number(id) <= 0)
  ) {
    redirect("/clubs");
  }

  if (!sessionData.session && type === "club") {
    const returnUrl = `/clubs/${id}`;
    redirect(`/login?redirect=${encodeURIComponent(returnUrl)}`);
  }

  if (type === "club" && sessionData.session) {
    const clubId = Number(id);
    let club: Awaited<ReturnType<typeof getClub>>;

    try {
      club = await getClub({ id });
    } catch (error: unknown) {
      if (error instanceof FetcherError && error.status === 404) {
        redirect("/clubs");
      }

      return (
        <ErrorWrapper message="Informasi club belum dapat dimuat. Silakan coba lagi." />
      );
    }

    if (
      !isClubRegistrationOpen({
        isRegistrationOpen: Boolean(club.is_registration_open),
        registrationEndDate: club.registration_end_date,
      })
    ) {
      redirect(`/clubs/${id}`);
    }

    let isRegistered = false;

    try {
      const registrationStatus = await getRegistrationStatus(
        clubId,
        sessionData.session,
      );
      isRegistered = Boolean(
        registrationStatus.data.isRegistered &&
          registrationStatus.data.registration,
      );
    } catch (error: unknown) {
      if (error instanceof FetcherError && error.status === 401) {
        const loginUrl = `/login?redirect=${encodeURIComponent(`/clubs/${id}`)}`;
        redirect(`/api/logout?redirect=${encodeURIComponent(loginUrl)}`);
      }
      if (error instanceof FetcherError && error.status === 404) {
        redirect("/clubs");
      }

      return (
        <ErrorWrapper message="Status pendaftaran belum dapat diperiksa. Silakan coba lagi." />
      );
    }

    if (isRegistered) {
      redirect(`/custom-form/club/${id}/success`);
    }
  }

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
    [provinceData, countryData] = await Promise.all([getProvinces(), getCountries()]);
    if (!isGuest) {
      profileData = await getProfile(sessionData.session || "");
    }

    return (
      <Container
        size="md"
        py={{ base: "md", sm: "xl" }}
        px={{ base: "xs", sm: "md" }}
      >
        <CustomFormContent
          customForm={customForm}
          profileData={profileData}
          provinceData={provinceData}
          countryData={countryData}
          featureType={featureType}
          featureId={type === "independent" ? undefined : Number(id)}
          isGuest={isGuest}
          activitySlug={activitySlug}
          resetOnMount={searchParams.reset === "1"}
        />
      </Container>
    );
  } catch (error: unknown) {
    if (error instanceof FetcherError && error.status === 404 && type === "club") {
      redirect(`/clubs/${id}`);
    }
    if (error instanceof FetcherError && error.status === 401) {
      if (type === "club") {
        const loginUrl = `/login?redirect=${encodeURIComponent(`/clubs/${id}`)}`;
        redirect(`/api/logout?redirect=${encodeURIComponent(loginUrl)}`);
      }
      redirect("/api/logout");
    }
    const message =
      error instanceof FetcherError || error instanceof Error
        ? error.message
        : "An error occurred";
    return <ErrorWrapper message={message} />;
  }
}
