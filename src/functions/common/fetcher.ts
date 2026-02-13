/**
 * Custom error class for fetch errors with status code and optional error code
 */
export class FetcherError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "FetcherError";
  }
}

export default async function fetcher<T>(input: string, init?: RequestInit) {
  try {
    const response = await fetch(input, init);

    try {
      const parsedResponse = (await response.json()) as T;

      if (response.ok) {
        return parsedResponse;
      } else {
        const errorMessage =
          (parsedResponse &&
            typeof parsedResponse === "object" &&
            "message" in parsedResponse &&
            typeof parsedResponse.message === "string" &&
            parsedResponse.message) ||
          response.statusText;

        const errorCode =
          parsedResponse &&
          typeof parsedResponse === "object" &&
          "code" in parsedResponse &&
          typeof parsedResponse.code === "string"
            ? parsedResponse.code
            : undefined;

        throw new FetcherError(errorMessage, response.status, errorCode);
      }
    } catch (error) {
      if (error instanceof FetcherError) {
        throw error;
      }
      throw new FetcherError(
        response.statusText || "Failed to parse response",
        response.status,
      );
    }
  } catch (error) {
    if (error instanceof FetcherError) {
      throw error;
    }
    // Handle network-level errors like ECONNREFUSED
    throw new FetcherError(
      error instanceof Error ? error.message : "Network error occurred",
      0,
      "NETWORK_ERROR",
    );
  }
}
