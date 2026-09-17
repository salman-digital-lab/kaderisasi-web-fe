import type { Metadata } from "next";
import type { ReactElement } from "react";
import { notFound, redirect } from "next/navigation";
import { getCustomFormByFeature } from "@/services/customForm";
import { verifySession } from "@/functions/server/session";
import PageContainer from "@/components/layout/PageContainer";
import StandaloneForm from "@/features/customForm/StandaloneForm";
import { getProvinces } from "@/services/profile";
import { FetcherError } from "@/functions/common/fetcher";

type Props = { params: Promise<{ id: string }> };
export default async function Page({ params }: Props): Promise<ReactElement> {
  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id)) notFound();
  const form = await getCustomFormByFeature({
    feature_type: "independent_form",
    feature_id: Number(id),
  }).catch((error: unknown) => {
    if (error instanceof FetcherError && error.status === 404) notFound();
    throw error;
  });
  if (!form) notFound();
  if (form.is_active && form.form_schema.settings?.accessMode !== "public") {
    const { session } = await verifySession();
    if (!session)
      redirect(`/login?redirect=${encodeURIComponent(`/form/${id}`)}`);
  }
  return (
    <main id="main-content">
      <PageContainer size="sm">
        <StandaloneForm
          form={form}
          provinces={
            form.form_schema.fields.some(
              (section) =>
                section.section_name === "profile_data" &&
                section.fields.some((field) => field.key.includes("province")),
            )
              ? await getProvinces()
              : []
          }
        />
      </PageContainer>
    </main>
  );
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const form = await getCustomFormByFeature({
      feature_type: "independent_form",
      feature_id: Number(id),
    });
    return { title: form.form_name, robots: { index: false, follow: false } };
  } catch {
    return { title: "Formulir", robots: { index: false, follow: false } };
  }
}
