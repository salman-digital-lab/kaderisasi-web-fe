import { Alert, Group, Skeleton, Stack } from "@mantine/core";
import type { ReactElement } from "react";
import { getCustomFormByFeature } from "@/services/customForm";
import { verifySession } from "@/functions/server/session";
import { FetcherError } from "@/functions/common/fetcher";
import ClubRegistrationButton from "@/components/common/ClubRegistrationButton";

type ClubRegistrationActionProps = {
  clubId: number;
  clubName: string;
  isRegistrationOpen: boolean;
};

type CustomFormResult = {
  hasActiveForm: boolean;
  customFormError: boolean;
};

async function getRegistrationForm(
  clubId: number,
  isRegistrationOpen: boolean,
): Promise<CustomFormResult> {
  if (!isRegistrationOpen) {
    return { hasActiveForm: false, customFormError: false };
  }

  try {
    const customForm = await getCustomFormByFeature({
      feature_type: "club_registration",
      feature_id: clubId,
    });
    return {
      hasActiveForm: Boolean(customForm?.is_active),
      customFormError: false,
    };
  } catch (error: unknown) {
    return {
      hasActiveForm: false,
      customFormError: !(error instanceof FetcherError && error.status === 404),
    };
  }
}

export async function ClubRegistrationAction({
  clubId,
  clubName,
  isRegistrationOpen,
}: ClubRegistrationActionProps): Promise<ReactElement> {
  const sessionData = await verifySession();
  const formResult: CustomFormResult = sessionData.session
    ? await getRegistrationForm(clubId, isRegistrationOpen)
    : { hasActiveForm: false, customFormError: false };

  return (
    <ClubRegistrationButton
      clubId={clubId}
      clubName={clubName}
      isAuthenticated={Boolean(sessionData.session)}
      isRegistrationOpen={isRegistrationOpen}
      hasActiveForm={formResult.hasActiveForm}
      customFormError={formResult.customFormError}
    />
  );
}

export function ClubRegistrationActionFallback(): ReactElement {
  return (
    <Alert color="gray" title="Memuat pilihan pendaftaran" aria-live="polite">
      <Stack gap="sm">
        <Group gap="xs">
          <Skeleton height={14} width="72%" />
          <Skeleton height={14} width="18%" />
        </Group>
        <Skeleton height={44} width="100%" radius="sm" />
      </Stack>
    </Alert>
  );
}
