export type FetcherOptions = RequestInit & {
  revalidate?: number | false;
  tags?: string[];
};

export default async function fetcher<T>(input: string, init?: FetcherOptions) {
  try {
    // Default cache settings based on HTTP method
    const defaultCacheSettings = {
      GET: {
        cache: 'force-cache' as RequestCache,
        revalidate: 3600, // 1 hour default for GET requests
      },
      POST: {
        cache: 'no-store' as RequestCache,
      },
      PUT: {
        cache: 'no-store' as RequestCache,
      },
      DELETE: {
        cache: 'no-store' as RequestCache,
      },
    };

    const method = init?.method || 'GET';
    const cacheSettings = defaultCacheSettings[method as keyof typeof defaultCacheSettings];

    // Merge default cache settings with provided options
    const fetchOptions: RequestInit = {
      ...cacheSettings,
      ...init,
      next: {
        revalidate: init?.revalidate,
        tags: init?.tags,
      },
    };

    const response = await fetch(input, fetchOptions);
    
    try {
      const parsedResponse = await response.json() as T;
      
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
      return Promise.reject(response.statusText || 'Failed to parse response');
    }
  } catch (error) {
    // Handle network-level errors like ECONNREFUSED
    return Promise.reject(error instanceof Error ? error.message : 'Network error occurred');
  }
}
