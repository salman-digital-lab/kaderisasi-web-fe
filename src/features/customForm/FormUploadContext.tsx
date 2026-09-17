"use client";
import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
  type ReactElement,
} from "react";

export const formErrorMessage = (code: string): string =>
  ({
    FORM_SCHEMA_CHANGED:
      "Formulir telah berubah. Muat ulang halaman sebelum melanjutkan.",
    FORM_CLOSED: "Penerimaan respons telah ditutup.",
    INVALID_FORM_SESSION: "Sesi pengisian berakhir. Muat ulang halaman.",
    LOGIN_REQUIRED: "Silakan masuk untuk mengisi formulir.",
    INVALID_FILE_SIZE: "Ukuran berkas melebihi batas yang diizinkan.",
    INVALID_IMAGE:
      "Gambar tidak dapat diproses. Pilih JPEG, PNG, atau WebP statis yang valid.",
    INVALID_PDF:
      "PDF tidak dapat dibaca. Pilih PDF yang valid tanpa kata sandi.",
    FILE_TYPE_NOT_ALLOWED: "Jenis berkas tidak sesuai dengan pertanyaan.",
    TOO_MANY_FILES: "Jumlah berkas telah mencapai batas.",
    INVALID_FILE:
      "Berkas tidak dapat dibaca. Pilih PDF, JPEG, PNG, atau WebP yang valid sesuai pertanyaan.",
    UPLOAD_FAILED: "Penyimpanan berkas belum berhasil. Coba unggah kembali.",
    FORM_SESSION_COMPLETED:
      "Jawaban untuk sesi ini sudah dikirim. Muat ulang untuk mengisi kembali.",
    INVALID_FORM_ATTACHMENT:
      "Berkas belum tersedia. Unggah kembali berkas Anda.",
  })[code] ?? code;
interface UploadContext {
  existingFiles: string[];
  formId: number;
  guest: boolean;
  ensureSession: () => Promise<string>;
  pending: number;
  setPending: (change: number) => void;
  attachments: Record<string, { name: string; size: number }>;
  remember: (id: string, file: { name: string; size: number }) => void;
  discard: (ids: string[]) => Promise<void>;
}
const Context = createContext<UploadContext | null>(null);
export function FormUploadProvider({
  formId,
  schemaHash,
  guest = false,
  existingFiles = [],
  children,
}: {
  formId: number;
  schemaHash: string;
  guest?: boolean;
  existingFiles?: string[];
  children: ReactNode;
}): ReactElement {
  const session = useRef<Promise<string> | null>(null);
  const [pending, setPending] = useState(0);
  const [attachments, setAttachments] = useState<UploadContext["attachments"]>(
    {},
  );
  const ensureSession = (): Promise<string> => {
    if (!session.current)
      session.current = fetch(`/api/forms/${formId}/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(guest ? { "x-form-guest": "true" } : {}),
        },
        body: JSON.stringify({ schema_hash: schemaHash }),
      })
        .then(async (response) => {
          const body = (await response.json()) as {
            message?: string;
            data?: { token: string };
          };
          if (!response.ok || !body.data)
            throw new Error(
              formErrorMessage(body.message ?? "Sesi belum dapat dimulai."),
            );
          return body.data.token;
        })
        .catch((error: unknown) => {
          session.current = null;
          throw error;
        });
    return session.current;
  };
  return (
    <Context.Provider
      value={{
        existingFiles,
        formId,
        guest,
        ensureSession,
        pending,
        setPending: (change) =>
          setPending((value) => Math.max(0, value + change)),
        attachments,
        remember: (id, file) =>
          setAttachments((value) => ({ ...value, [id]: file })),
        discard: async (ids) => {
          const unclaimed = ids.filter((id) => !existingFiles.includes(id));
          if (!unclaimed.length) return;
          setPending((count) => count + 1);
          try {
            const token = await ensureSession();
            for (const id of unclaimed) {
              const response = await fetch(`/api/forms/${formId}/files/${id}`, {
                method: "DELETE",
                headers: {
                  "x-form-session": token,
                  ...(guest ? { "x-form-guest": "true" } : {}),
                },
              });
              if (!response.ok && response.status !== 404)
                throw new Error(
                  "Berkas pada jalur yang dilewati belum dapat dihapus. Muat ulang halaman sebelum memilih berkas baru.",
                );
            }
          } finally {
            setPending((count) => Math.max(0, count - 1));
          }
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}
export const useFormUploads = (): UploadContext | null => useContext(Context);
