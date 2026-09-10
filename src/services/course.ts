import "server-only";
import { notFound, redirect } from "next/navigation";
import { getToken } from "@/functions/auth/getToken";
import { serverApiConfig } from "@/config/apiConfig";
import fetcher, { FetcherError } from "@/functions/common/fetcher";

export async function readCourseData<T>(
  path: string,
  returnTo: string,
): Promise<T> {
  const token = await getToken();
  if (!token) redirect(`/login?redirect=${encodeURIComponent(returnTo)}`);
  try {
    const response = await fetcher<{ data: T }>(
      `${serverApiConfig.beApi}/courses${path}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );
    return response.data;
  } catch (error) {
    if (error instanceof FetcherError) {
      if (error.status === 401)
        redirect(
          `/api/logout?redirect=${encodeURIComponent(`/login?redirect=${encodeURIComponent(returnTo)}`)}`,
        );
      if (error.status === 404) notFound();
    }
    throw error;
  }
}
