import { NextResponse } from "next/server";
import { getToken } from "@/functions/auth/getToken";
import { serverApiConfig } from "@/config/apiConfig";

type Context = {
  params: Promise<{ id: string; lessonId: string; documentId: string }>;
};
export async function GET(
  _request: Request,
  { params }: Context,
): Promise<Response> {
  const headers = { "Cache-Control": "private, no-store" };
  const token = await getToken();
  if (!token)
    return NextResponse.json(
      { message: "Silakan masuk untuk mengunduh materi." },
      { status: 401, headers },
    );
  const { id, lessonId, documentId } = await params;
  if (
    ![id, lessonId, documentId].every(
      (value) => /^[1-9]\d*$/.test(value) && Number(value) <= 2147483647,
    )
  )
    return NextResponse.json(
      { message: "Dokumen tidak tersedia." },
      { status: 404, headers },
    );
  try {
    const response = await fetch(
      `${serverApiConfig.beApi}/courses/${id}/lessons/${lessonId}/documents/${documentId}/download`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
        signal: _request.signal,
      },
    );
    if (!response.ok)
      return NextResponse.json(
        {
          message:
            response.status === 404
              ? "Dokumen tidak tersedia untuk akun Anda."
              : "Dokumen belum dapat diunduh. Coba kembali.",
        },
        {
          status: [401, 404, 503].includes(response.status)
            ? response.status
            : 502,
          headers,
        },
      );
    return new Response(response.body, {
      headers: {
        ...headers,
        "Content-Type": "application/pdf",
        "X-Content-Type-Options": "nosniff",
        "Content-Disposition":
          response.headers.get("Content-Disposition") ??
          'attachment; filename="materi.pdf"',
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Dokumen belum dapat diunduh. Coba kembali." },
      { status: 502, headers },
    );
  }
}
