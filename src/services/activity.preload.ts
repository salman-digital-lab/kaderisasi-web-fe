import { getActivity } from "./activity.cache";
import type { GetActivityReq } from "@/types/api/activity";

/**
 * Preload helper — fires getActivity early so generateMetadata and Page
 * share the same cache entry within the same request.
 * Must live outside the "use cache" module since preload functions are synchronous.
 */
export function preloadActivity(props: GetActivityReq): void {
  void getActivity(props);
}
