import { verifySession } from "@/functions/server/session";
import { getProfile, getProvinces } from "@/services/profile";
import { getCustomFormByFeature } from "@/services/customForm";
import { Container, Paper } from "@mantine/core";
import { redirect } from "next/navigation";
import ErrorWrapper from "@/components/layout/Error";
import CustomFormContent from "@/features/customForm/CustomFormContent";
import { PublicUser, Member } from "@/types/model/members";
import { Province } from "@/types/model/province";

export default async function Page(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const formId = params.id;

  let profileData:
    | {
        userData: PublicUser;
        profile: Member;
      }
    | undefined;
  let provinceData: Province[] | undefined;

  const sessionData = await verifySession();

  try {
    // Fetch independent form by its ID
    const customForm = await getCustomFormByFeature({
      feature_type: "independent_form",
      feature_id: Number(formId),
    });

    if (!customForm) {
      return <ErrorWrapper message="Form tidak ditemukan" />;
    }

    if (!customForm.is_active) {
      return <ErrorWrapper message="Form ini tidak aktif" />;
    }

    // Fetch profile and provinces data
    provinceData = await getProvinces();
    profileData = await getProfile(sessionData.session || "");

    return (
      <Container size="md" component="main" py={{ base: "md", sm: "xl" }} px={{ base: "xs", sm: "md" }}>
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
            featureType="independent_form"
            featureId={undefined}
          />
        </Paper>
      </Container>
    );
  } catch (error: unknown) {
    if (typeof error === "string" && error === "Unauthorized")
      redirect("/api/logout");
    if (typeof error === "string") return <ErrorWrapper message={error} />;
    return <ErrorWrapper message="Terjadi kesalahan" />;
  }
}

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  
  try {
    const customForm = await getCustomFormByFeature({
      feature_type: "independent_form",
      feature_id: Number(params.id),
    });

    return {
      title: customForm?.form_name || "Formulir",
      description: customForm?.form_description || "Isi formulir ini",
    };
  } catch {
    return {
      title: "Formulir",
    };
  }
}

