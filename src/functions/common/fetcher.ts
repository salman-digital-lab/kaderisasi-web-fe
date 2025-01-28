export default async function fetcher<T>(input: string, init?: RequestInit) {
  try {
    const response = await fetch(input, init);
    
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
