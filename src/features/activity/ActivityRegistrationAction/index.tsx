import type { ReactElement } from "react";
import { Alert, Anchor, Skeleton, Stack, VisuallyHidden } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import LinkButton from "@/components/common/LinkButton";
import { verifySession } from "@/functions/server/session";
import { FetcherError } from "@/functions/common/fetcher";
import { getActivityRegistration } from "@/services/activity";
import { getProfile } from "@/services/profile";
import type { Activity } from "@/types/model/activity";
import ActivityRegistrationStatus from "../ActivityRegistrationStatus";

export async function ActivityRegistrationAction({
  activity,
}: {
  activity: Activity;
}): Promise<ReactElement> {
  const { session } = await verifySession();
  if (!session) return <ActivityRegistrationStatus activity={activity} />;

  try {
    const [profile, registration] = await Promise.all([
      getProfile(session),
      getActivityRegistration(session, { slug: activity.slug }),
    ]);
    return (
      <ActivityRegistrationStatus
        activity={activity}
        participant={{ level: profile?.profile?.level, registration }}
      />
    );
  } catch (error) {
    if (error instanceof FetcherError && error.status === 401) {
      return (
        <Stack gap="sm">
          <Alert color="blue" title="Silakan masuk kembali">
            Sesi Anda berakhir. Masuk untuk melanjutkan atau melihat status
            pendaftaran.
          </Alert>
          <LinkButton
            href={`/login?redirect=${encodeURIComponent(`/activity/${activity.slug}`)}`}
            fullWidth
          >
            Masuk kembali
          </LinkButton>
        </Stack>
      );
    }
    return (
      <Stack gap="sm">
        <Alert
          color="red"
          title="Status belum dapat dimuat"
          icon={<IconAlertCircle size={18} aria-hidden="true" />}
        >
          Kami belum dapat memeriksa pendaftaran Anda. Muat ulang untuk mencoba
          lagi.
        </Alert>
        <Anchor href={`/activity/${activity.slug}`} py="xs" fw={600}>
          Muat ulang status
        </Anchor>
      </Stack>
    );
  }
}

export function ActivityRegistrationActionFallback(): ReactElement {
  return (
    <>
      <VisuallyHidden role="status">Memuat pilihan pendaftaran…</VisuallyHidden>
      <Stack gap="sm" aria-hidden="true">
        <Skeleton height={16} width="85%" />
        <Skeleton height={16} width="65%" />
        <Skeleton height={44} />
      </Stack>
    </>
  );
}
