import { certificateCodeInputSchema } from "../schemas/certificate";

export function parseVerificationInput(
  input: string,
  appUrl?: string | null,
): string | null {
  let candidate = input.trim();
  if (/^https?:\/\//i.test(candidate)) {
    if (!appUrl) return null;
    try {
      const url = new URL(candidate);
      const base = new URL(appUrl);
      if (url.origin !== base.origin || url.username || url.password)
        return null;
      const prefix = `${base.pathname.replace(/\/$/, "")}/certificate/`;
      if (!url.pathname.startsWith(prefix)) return null;
      candidate = decodeURIComponent(
        url.pathname
          .slice(prefix.length)
          .replace(/^verify\//, "")
          .replace(/\/$/, ""),
      );
    } catch {
      return null;
    }
  }
  const result = certificateCodeInputSchema.safeParse(candidate);
  return result.success ? result.data : null;
}
