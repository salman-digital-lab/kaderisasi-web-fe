import { Alert, Group, Skeleton, Stack } from "@mantine/core";
import { getCustomFormByFeature } from "@/services/customForm";
import { verifySession } from "@/functions/server/session";
import { FetcherError } from "@/functions/common/fetcher";
import ClubRegistrationButton from "@/components/common/ClubRegistrationButton";
import type { CustomForm } from "@/types/api/customForm";

type ClubRegistrationActionProps = {
  clubId: number;
  clubName: string;
  isRegistrationOpen: boolean;
};

type CustomFormResult = {
  customForm?: CustomForm;
  customFormError: boolean;
};

async function getRegistrationForm(
  clubId: number,
  isRegistrationOpen: boolean,
): Promise<CustomFormResult> {
  if (!isRegistrationOpen) {
    return { customFormError: false };
  }

  try {
    const customForm = await getCustomFormByFeature({
      feature_type: "club_registration",
      feature_id: clubId,
    });
    return { customForm, customFormError: false };
  } catch (error: unknown) {
    return {
      customFormError: !(error instanceof FetcherError && error.status === 404),
    };
  }
}

export async function ClubRegistrationAction({
  clubId,
  clubName,
  isRegistrationOpen,
}: ClubRegistrationActionProps) {
  const [sessionData, formResult] = await Promise.all([
    verifySession(),
    getRegistrationForm(clubId, isRegistrationOpen),
  ]);

  return (
    <ClubRegistrationButton
      clubId={clubId}
      clubName={clubName}
      isAuthenticated={Boolean(sessionData.session)}
      isRegistrationOpen={isRegistrationOpen}
      customForm={formResult.customForm}
      customFormError={formResult.customFormError}
    />
  );
}

export function ClubRegistrationActionFallback() {
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
