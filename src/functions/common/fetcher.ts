export default async function fetcher<T>(input: string, init?: RequestInit) {
  const response = await fetch(input, init);

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
}
