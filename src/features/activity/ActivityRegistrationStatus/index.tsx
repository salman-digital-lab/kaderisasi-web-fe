import type { ReactElement } from "react";
import { Alert, Badge, Stack, Text } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import LinkButton from "@/components/common/LinkButton";
import CertificateCtaButton from "@/features/certificate/CertificateCtaButton";
import { getCertificateCta } from "@/features/certificate/utils/certificateData";
import {
  ACTIVITY_REGISTRANT_COLOR_STATUS_RENDER,
  USER_LEVEL_RENDER,
} from "@/constants/render/activity";
import {
  ACTIVITY_REGISTRANT_STATUS_ENUM,
  ACTIVITY_TYPE_ENUM,
} from "@/types/constants/activity";
import type { Activity } from "@/types/model/activity";
import type { GetActivityRegistrationResp } from "@/types/api/activity";
import type { USER_LEVEL_ENUM } from "@/types/constants/profile";

type ActivityRegistrationStatusProps = {
  activity: Activity;
  participant?: {
    level: USER_LEVEL_ENUM | undefined;
    registration: GetActivityRegistrationResp["data"];
  };
};

export default function ActivityRegistrationStatus({
  activity,
  participant,
}: ActivityRegistrationStatusProps): ReactElement {
  const registration = participant?.registration;
  const isRegistered =
    registration?.status &&
    registration.status !== ACTIVITY_REGISTRANT_STATUS_ENUM.BELUM_TERDAFTAR;

  if (isRegistered) {
    const certificateCta = getCertificateCta({
      certificateCode: registration.certificate_code,
      certificateState: registration.certificate_state,
      hasTemplate: Boolean(activity.additional_config?.certificate_template_id),
      isPassed:
        registration.status === ACTIVITY_REGISTRANT_STATUS_ENUM.LULUS_KEGIATAN,
      registrationId: registration.registration_id,
    });
    const announcement = registration.visible_at
      ? new Date(registration.visible_at)
      : null;
    return (
      <Stack gap="sm">
        <Text size="sm" fw={600}>
          Status pendaftaran Anda
        </Text>
        <Badge
          size="lg"
          variant="light"
          fullWidth
          color={
            ACTIVITY_REGISTRANT_COLOR_STATUS_RENDER[
              registration.status as keyof typeof ACTIVITY_REGISTRANT_COLOR_STATUS_RENDER
            ] ?? "blue"
          }
        >
          {registration.status}
        </Badge>
        {registration.status ===
          ACTIVITY_REGISTRANT_STATUS_ENUM.BELUM_DIUMUMKAN &&
        announcement &&
        !Number.isNaN(announcement.getTime()) ? (
          <Text size="sm" c="dimmed">
            Estimasi pengumuman:{" "}
            {new Intl.DateTimeFormat("id-ID", {
              dateStyle: "long",
              timeStyle: "short",
              timeZone: "Asia/Jakarta",
            }).format(announcement)}{" "}
            WIB.
          </Text>
        ) : null}
        {certificateCta ? <CertificateCtaButton cta={certificateCta} /> : null}
      </Stack>
    );
  }

  if (!activity.is_registration_open) {
    return participant ? (
      <Text size="sm" c="dimmed">
        Anda belum terdaftar. Pendaftaran kegiatan ini sudah ditutup.
      </Text>
    ) : (
      <Stack gap="sm">
        <Text size="sm" c="dimmed">
          Sudah mendaftar? Masuk untuk melihat status pendaftaran dan sertifikat
          Anda.
        </Text>
        <LinkButton
          href={`/login?redirect=${encodeURIComponent(`/activity/${activity.slug}`)}`}
          variant="light"
          fullWidth
        >
          Lihat status pendaftaran
        </LinkButton>
      </Stack>
    );
  }

  if (participant) {
    if (
      participant.level === undefined ||
      participant.level < activity.minimum_level
    ) {
      return (
        <Alert
          color="blue"
          icon={<IconInfoCircle size={18} aria-hidden="true" />}
          title="Persyaratan jenjang"
        >
          Kegiatan ini memerlukan jenjang{" "}
          {USER_LEVEL_RENDER[activity.minimum_level]} atau lebih tinggi.
          {participant.level !== undefined
            ? ` Jenjang Anda saat ini: ${USER_LEVEL_RENDER[participant.level]}.`
            : " Jenjang profil Anda belum tersedia."}
        </Alert>
      );
    }
    return (
      <LinkButton href={`/custom-form/activity/${activity.id}`} fullWidth>
        Daftar kegiatan
      </LinkButton>
    );
  }

  const allowGuest =
    activity.activity_type === ACTIVITY_TYPE_ENUM.REGISTRATION_ONLY &&
    activity.additional_config?.allow_guest_registration;
  return (
    <Stack gap="sm">
      <Text size="sm" c="dimmed">
        {allowGuest
          ? "Daftar dengan akun atau lanjut tanpa akun."
          : "Masuk atau buat akun untuk melanjutkan pendaftaran."}
      </Text>
      <LinkButton href={`/activity/${activity.slug}/join`} fullWidth>
        Daftar kegiatan
      </LinkButton>
    </Stack>
  );
}
