"use client";
import Link from "next/link";
import { Button } from "@mantine/core";
import { IconAward, IconCalendarEvent } from "@tabler/icons-react";
import type { ReactElement } from "react";
import CatalogueImage from "@/components/common/Catalogue/CatalogueImage";
import { ACTIVITY_REGISTRANT_STATUS_ENUM as Status } from "@/types/constants/activity";
import { getCertificateCta } from "@/features/certificate/utils/certificateData";
import type { CertificateLifecycleState } from "@/types/model/certificate";
import HistoryCard from "./HistoryCard";

type ActivityCardProps = {
  activityName: string;
  registrationStatus: string;
  slug: string;
  imageUrl?: string;
  visibleAt?: string;
  registrationId?: number;
  hasCertificate?: boolean;
  certificateCode?: string | null;
  certificateState?: CertificateLifecycleState;
};
function statusColor(status: string): string {
  if (status === Status.DITERIMA || status === Status.LULUS_KEGIATAN)
    return "green";
  if (status === Status.TIDAK_DITERIMA || status === Status.TIDAK_LULUS)
    return "red";
  return status === Status.BELUM_DIUMUMKAN ? "orange" : "blue";
}
export default function ActivityHistoryCard({
  activityName,
  registrationStatus,
  slug,
  imageUrl,
  visibleAt,
  registrationId,
  hasCertificate,
  certificateCode,
  certificateState,
}: ActivityCardProps): ReactElement {
  const certificate = getCertificateCta({
    certificateCode,
    certificateState,
    hasTemplate: Boolean(hasCertificate),
    isPassed: registrationStatus === Status.LULUS_KEGIATAN,
    registrationId,
  });
  const announcement =
    registrationStatus === Status.BELUM_DIUMUMKAN && visibleAt
      ? `Diumumkan: ${new Date(visibleAt).toLocaleString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}`
      : undefined;
  return (
    <HistoryCard
      title={activityName}
      status={{
        label:
          registrationStatus.charAt(0) +
          registrationStatus.slice(1).toLowerCase(),
        color: statusColor(registrationStatus),
      }}
      meta={announcement ? [announcement] : []}
      media={
        <CatalogueImage
          src={
            imageUrl
              ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${imageUrl}`
              : undefined
          }
          alt={activityName}
          variant="poster"
          fallback={<IconCalendarEvent size={28} stroke={1.5} aria-hidden />}
        />
      }
      actions={
        <>
          <Button
            component={Link}
            href={`/profile/activity/${slug}`}
            variant="light"
            aria-label={`Lihat detail ${activityName}`}
          >
            Lihat detail
          </Button>
          {registrationStatus === Status.TERDAFTAR && (
            <Button
              component={Link}
              href={`/profile/activity/${slug}?edit=form`}
              variant="outline"
              aria-label={`Ubah formulir ${activityName}`}
            >
              Ubah formulir
            </Button>
          )}
          {certificate && (
            <Button
              component={Link}
              href={certificate.href}
              color={certificate.color}
              variant="light"
              leftSection={<IconAward size={16} aria-hidden />}
            >
              {certificate.label}
            </Button>
          )}
        </>
      }
    />
  );
}
