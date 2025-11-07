import { verifySession } from "@/functions/server/session";
import { getCustomFormByFeature } from "@/services/customForm";
import { Container, Paper, Title, Text, Button, Stack, Alert } from "@mantine/core";
import { redirect } from "next/navigation";
import ErrorWrapper from "@/components/layout/Error";
import { IconCheck } from "@tabler/icons-react";
import Link from "next/link";
import styles from "./page.module.css";

export default async function SuccessPage(props: {
  params: Promise<{ type: string; id: string }>;
}) {
  const params = await props.params;
  const { type, id } = params;

  await verifySession();

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

    // Determine redirect URL based on form type
    let redirectUrl = "/";
    let redirectLabel = "Kembali ke Beranda";

    if (featureType === "activity_registration") {
      redirectUrl = "/activity";
      redirectLabel = "Lihat Daftar Kegiatan";
    } else if (featureType === "club_registration") {
      redirectUrl = "/clubs";
      redirectLabel = "Lihat Daftar Unit Kegiatan";
    }

    return (
      <Container size="md" component="main" py={{ base: "md", sm: "xl" }} px={{ base: "xs", sm: "md" }}>
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
                  : "Pendaftaran Berhasil!"}
              </Title>
              <Text size="sm">
                {featureType === "independent_form"
                  ? "Terima kasih telah mengisi formulir."
                  : "Terima kasih telah mendaftar. Data Anda telah kami terima."}
              </Text>
            </Alert>

            {customForm.post_submission_info && (
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

            <Link href={redirectUrl} style={{ textDecoration: 'none' }}>
              <Button
                size="md"
                mt="md"
              >
                {redirectLabel}
              </Button>
            </Link>
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

