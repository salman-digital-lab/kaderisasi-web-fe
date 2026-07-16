import { verifySession } from "@/functions/server/session";
import { getCustomFormByFeature } from "@/services/customForm";
import { Container, Paper, Title, Text, Stack, Alert } from "@mantine/core";
import { redirect } from "next/navigation";
import ErrorWrapper from "@/components/layout/Error";
import styles from "./page.module.css";
import LinkButton from "@/components/common/LinkButton";
import { getRegistrationStatus } from "@/services/clubRegistration";
import type { CustomForm } from "@/types/api/customForm";
import type { ClubRegistration } from "@/types/model/clubRegistration";

export default async function SuccessPage(props: {
  params: Promise<{ type: string; id: string }>;
}) {
  const params = await props.params;
  const { type, id } = params;

  const { session } = await verifySession();

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

  let clubCustomForm: CustomForm | undefined;
  let clubRegistrationStatus: ClubRegistration["status"] | undefined;

  if (type === "club") {
    const clubId = Number(id);

    if (!/^\d+$/.test(id) || !Number.isSafeInteger(clubId) || clubId <= 0) {
      redirect("/clubs");
    }

    if (!session) {
      redirect(`/clubs/${id}`);
    }

    try {
      const status = await getRegistrationStatus(clubId, session);
      if (status.data.isRegistered && status.data.registration) {
        clubRegistrationStatus = status.data.registration.status;
      }
    } catch {
      redirect(`/clubs/${id}`);
    }

    if (!clubRegistrationStatus) {
      redirect(`/clubs/${id}`);
    }

    try {
      clubCustomForm = await getCustomFormByFeature({
        feature_type: "club_registration",
        feature_id: clubId,
      });
    } catch {
      clubCustomForm = undefined;
    }
  }

  try {
    const customForm =
      type === "club"
        ? clubCustomForm
        : await getCustomFormByFeature({
            feature_type: featureType,
            feature_id: type === "independent" ? undefined : Number(id),
          });

    if (!customForm && type !== "club") {
      return <ErrorWrapper message="Custom form not found" />;
    }

    // Determine redirect URL based on form type
    let redirectUrl = "/";
    let redirectLabel = "Kembali ke Beranda";

    if (featureType === "activity_registration") {
      redirectUrl = "/activity";
      redirectLabel = "Lihat Daftar Kegiatan";
    } else if (featureType === "club_registration") {
      redirectUrl = `/clubs/${id}`;
      redirectLabel = "Kembali ke Detail Klub";
    }

    return (
      <Container size="md" py={{ base: "md", sm: "xl" }} px={{ base: "xs", sm: "md" }}>
        <Paper 
          radius="md" 
          withBorder 
          p={{ base: "md", sm: "xl" }}
          style={{ width: "100%", maxWidth: "100%" }}
        >
          <Stack gap="lg" align="center">
            <Alert 
              color="blue" 
              variant="light"
              w="100%"
            >
              <Title order={3} mb="xs">
                {featureType === "independent_form"
                  ? "Formulir Berhasil Dikirim!"
                  : featureType === "club_registration" &&
                      clubRegistrationStatus !== "PENDING"
                    ? "Status Pendaftaran"
                    : "Pendaftaran Berhasil!"}
              </Title>
              <Text size="md">
                {featureType === "independent_form"
                  ? "Terima kasih telah mengisi formulir."
                  : featureType === "club_registration"
                    ? clubRegistrationStatus === "APPROVED"
                      ? "Pendaftaran Anda telah disetujui oleh pengelola klub."
                      : clubRegistrationStatus === "REJECTED"
                        ? "Pendaftaran Anda telah ditinjau tetapi belum dapat disetujui."
                        : "Data pendaftaran Anda telah diterima dan sedang menunggu peninjauan pengelola klub."
                    : "Terima kasih telah mendaftar. Data Anda telah kami terima."}
              </Text>
            </Alert>

            {customForm?.post_submission_info && (
              <Paper 
                w="100%" 
                p="md" 
                withBorder
                style={{ 
                  backgroundColor: "var(--mantine-color-gray-0)",
                }}
              >
                <Title order={4} mb="md">
                  Informasi Penting
                </Title>
                <div
                  className={styles.richTextContent}
                  dangerouslySetInnerHTML={{ __html: customForm.post_submission_info }}
                />
              </Paper>
            )}

            <LinkButton href={redirectUrl} size="md" mt="md">
              {redirectLabel}
            </LinkButton>
          </Stack>
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
