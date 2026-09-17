"use client";
import { useEffect, useRef, useState, type ReactElement } from "react";
import type { CustomFormField } from "@/types/api/customForm";
import { formErrorMessage, useFormUploads } from "./FormUploadContext";
import styles from "./FormFileInput.module.css";

export function FormFileInput({
  field,
  value,
  onChange,
  error,
}: {
  field: CustomFormField;
  value: unknown;
  onChange: (ids: string[]) => void;
  error?: React.ReactNode;
}): ReactElement {
  const uploads = useFormUploads();
  const inputRef = useRef<HTMLInputElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [failure, setFailure] = useState("");
  const [retry, setRetry] = useState<{ file: File; id: string }>();
  const settings = field.file ?? {
    accept: "pdf_or_image",
    maxFiles: 1,
    maxSizeMB: 10,
  };
  const ids = Array.isArray(value)
    ? value.filter((id): id is string => typeof id === "string")
    : [];
  const allowed =
    settings.accept === "pdf"
      ? ["application/pdf"]
      : settings.accept === "image"
        ? ["image/jpeg", "image/png", "image/webp"]
        : ["application/pdf", "image/jpeg", "image/png", "image/webp"];
  const upload = async (
    file: File,
    id = crypto.randomUUID(),
  ): Promise<void> => {
    if (!uploads) return;
    setFailure("");
    if (
      !allowed.includes(file.type) ||
      file.size > settings.maxSizeMB * 1024 * 1024 ||
      ids.length >= settings.maxFiles
    ) {
      setFailure(
        `Pilih jenis berkas yang sesuai, maksimal ${settings.maxSizeMB} MB dan ${settings.maxFiles} berkas.`,
      );
      return;
    }
    setBusy(true);
    setProgress(0);
    uploads.setPending(1);
    try {
      const token = await uploads.ensureSession();
      const result = await new Promise<{
        id: string;
        name: string;
        size: number;
      }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.timeout = 120_000;
        xhr.ontimeout = () =>
          reject(
            new Error(
              "Unggahan membutuhkan waktu terlalu lama. Coba unggah kembali.",
            ),
          );
        xhr.open(
          "POST",
          `/api/forms/${uploads.formId}/files/${encodeURIComponent(field.key)}`,
        );
        xhr.setRequestHeader("x-form-session", token);
        xhr.setRequestHeader("x-form-upload", id);
        if (uploads.guest) xhr.setRequestHeader("x-form-guest", "true");
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable)
            setProgress(Math.round((event.loaded / event.total) * 100));
        };
        xhr.onerror = () =>
          reject(new Error("Koneksi terputus. Coba unggah kembali."));
        xhr.onload = () => {
          try {
            const body = JSON.parse(xhr.responseText) as {
              data: { id: string; name: string; size: number };
              message?: string;
            };
            if (xhr.status < 200 || xhr.status >= 300)
              reject(
                new Error(formErrorMessage(body.message ?? "Unggah gagal.")),
              );
            else resolve(body.data);
          } catch {
            reject(new Error("Unggah gagal. Coba kembali."));
          }
        };
        const body = new FormData();
        body.append("file", file);
        xhr.send(body);
      });
      uploads.remember(result.id, result);
      onChange([...ids, result.id]);
      setRetry(undefined);
    } catch (cause) {
      setFailure(cause instanceof Error ? cause.message : "Unggah gagal.");
      setRetry({ file, id });
    } finally {
      setBusy(false);
      uploads.setPending(-1);
    }
  };
  const remove = async (id: string): Promise<void> => {
    if (!uploads) return;
    if (uploads.existingFiles.includes(id)) {
      onChange(ids.filter((item) => item !== id));
      return;
    }
    setBusy(true);
    uploads.setPending(1);
    setFailure("");
    try {
      const token = await uploads.ensureSession();
      const response = await fetch(`/api/forms/${uploads.formId}/files/${id}`, {
        method: "DELETE",
        headers: {
          "x-form-session": token,
          ...(uploads.guest ? { "x-form-guest": "true" } : {}),
        },
      });
      if (!response.ok)
        throw new Error("Berkas belum dapat dihapus. Coba lagi.");
      onChange(ids.filter((item) => item !== id));
    } catch (cause) {
      setFailure(cause instanceof Error ? cause.message : "Hapus gagal.");
    } finally {
      setBusy(false);
      uploads.setPending(-1);
    }
  };
  return (
    <div className={styles.field}>
      <label htmlFor={`file-${field.key}`}>
        <strong>
          {field.label}
          {field.required ? " *" : ""}
        </strong>
      </label>
      {field.helpText && <p>{field.helpText}</p>}
      <p id={`file-help-${field.key}`}>
        {settings.accept === "pdf"
          ? "PDF"
          : settings.accept === "image"
            ? "JPEG, PNG, WebP"
            : "PDF, JPEG, PNG, WebP"}
        . Maksimal {settings.maxFiles} berkas, {settings.maxSizeMB} MB per
        berkas.
        {settings.accept !== "pdf" &&
          " Gambar dioptimalkan otomatis menjadi WebP."}
      </p>
      <input
        ref={inputRef}
        hidden
        id={`file-${field.key}`}
        type="file"
        accept={allowed.join(",")}
        disabled={
          !ready ||
          busy ||
          field.disabled ||
          !uploads ||
          ids.length >= settings.maxFiles
        }
        aria-describedby={`file-help-${field.key}`}
        aria-invalid={!!error || !!failure}
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void upload(file);
        }}
      />
      <button
        type="button"
        aria-describedby={`file-help-${field.key}`}
        disabled={
          !ready ||
          busy ||
          field.disabled ||
          !uploads ||
          ids.length >= settings.maxFiles
        }
        onClick={() => inputRef.current?.click()}
      >
        {ids.length >= settings.maxFiles
          ? "Batas berkas tercapai"
          : "Pilih berkas"}
      </button>
      {busy && (
        <div role="status">
          <progress max={100} value={progress} />
          {progress === 100
            ? "Memvalidasi dan memproses berkas…"
            : `Mengunggah ${progress}%`}
        </div>
      )}
      <ul>
        {ids.map((id) => (
          <li key={id}>
            <span>{uploads?.attachments[id]?.name ?? "Berkas terunggah"}</span>
            <button
              type="button"
              disabled={busy}
              onClick={() => void remove(id)}
            >
              Hapus
            </button>
          </li>
        ))}
      </ul>
      {(failure || error) && (
        <div role="alert" className={styles.error}>
          {failure || error}
        </div>
      )}
      {retry && !busy && (
        <button type="button" onClick={() => void upload(retry.file, retry.id)}>
          Coba unggah kembali
        </button>
      )}
    </div>
  );
}
