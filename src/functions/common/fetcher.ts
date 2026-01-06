export type FetcherOptions = RequestInit & {
  revalidate?: number | false;
  tags?: string[];
};

export default async function fetcher<T>(input: string, init?: FetcherOptions) {
  try {
    // Extract custom properties that need special handling
    const { revalidate, tags, ...fetchInit } = init || {};

    // Build next config only if custom properties are provided
    const nextConfig =
      revalidate !== undefined || tags !== undefined
        ? {
            next: {
              ...init?.next, // Preserve any existing next config
              ...(revalidate !== undefined && { revalidate }),
              ...(tags !== undefined && { tags }),
            },
          }
        : init?.next
        ? { next: init.next }
        : {};

    const fetchOptions: RequestInit = {
      ...fetchInit,
      ...nextConfig,
    };

    const response = await fetch(input, fetchOptions);

    try {
      const parsedResponse = (await response.json()) as T;

      if (response.ok) {
        return parsedResponse;
      } else {
        const error =
          (parsedResponse &&
            typeof parsedResponse === "object" &&
            "message" in parsedResponse &&
            parsedResponse?.message) ||
          response.statusText;

        return Promise.reject(error);
      }
    } catch (error) {
      return Promise.reject(response.statusText || "Failed to parse response");
    }
  } catch (error) {
    // Handle network-level errors like ECONNREFUSED
    return Promise.reject(
      error instanceof Error ? error.message : "Network error occurred",
    );
  }
}
