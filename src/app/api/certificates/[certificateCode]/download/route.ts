import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "@/functions/auth/getToken";
import { FetcherError } from "@/functions/common/fetcher";
import { getOwnedCertificateForDownload } from "@/services/certificate";
import { certificateCodeInputSchema } from "@/features/certificate/schemas/certificate";

const ERROR_MESSAGES: Record<number, string> = {
  401: "Silakan masuk untuk mengunduh sertifikat.",
  403: "Sertifikat ini bukan milik akun Anda.",
  404: "Sertifikat tidak ditemukan.",
  409: "Sertifikat belum diterbitkan.",
  410: "Sertifikat yang telah dicabut tidak dapat diunduh.",
  422: "Template sertifikat tidak tersedia.",
  429: "Terlalu banyak permintaan. Tunggu sebentar lalu coba kembali.",
};

function jsonResponse(body: unknown, status: number): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ certificateCode: string }> },
): Promise<NextResponse> {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") {
    return jsonResponse(
      { message: "Permintaan lintas situs tidak diizinkan." },
      403,
    );
  }

  const token = await getToken();
  if (!token) {
    return jsonResponse({ message: ERROR_MESSAGES[401] }, 401);
  }

  const { certificateCode } = await context.params;
  const parsedCode = certificateCodeInputSchema.safeParse(certificateCode);
  if (!parsedCode.success) {
    return jsonResponse({ message: ERROR_MESSAGES[404] }, 404);
  }

  try {
    const data = await getOwnedCertificateForDownload(token, parsedCode.data);
    return jsonResponse({ data }, 200);
  } catch (error) {
    if (error instanceof FetcherError) {
      const status = ERROR_MESSAGES[error.status] ? error.status : 502;
      return jsonResponse(
        {
          message:
            ERROR_MESSAGES[status] ??
            "Sertifikat belum dapat diproses. Coba lagi nanti.",
        },
        status,
      );
    }

    return jsonResponse(
      { message: "Sertifikat belum dapat diproses. Coba lagi nanti." },
      500,
    );
  }
}
