import { redirect } from "next/navigation";
import { getActivity } from "../../../../../../services/activity";

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const activity = await getActivity(params);

  if (!activity?.id) {
    redirect(`/activity/${params.slug}`);
  }

  redirect(`/custom-form/activity/${activity.id}?slug=${params.slug}`);
}
