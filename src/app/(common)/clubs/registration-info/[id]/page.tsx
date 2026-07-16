import { redirect } from "next/navigation";

export default async function ClubRegistrationInfoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/clubs/${id}`);
}
