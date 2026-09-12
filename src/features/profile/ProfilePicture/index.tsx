"use client";

import { Avatar, Button, FileButton, Stack, Text } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import { useId, useRef, useState } from "react";
import type { ReactElement } from "react";
import { postProfilePicture } from "@/services/profile";
import updateProfilePictureCookie from "@/functions/server/updateProfilePictureCookie";
import { validateProfilePicture } from "../picture-validation";

interface ProfilePictureProps {
  src?: string;
  size?: number;
  radius?: number;
  token: string;
}
export function ProfilePicture({
  src,
  size = 72,
  radius = 72,
  token,
}: ProfilePictureProps): ReactElement {
  const [uploadedPicture, setUploadedPicture] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const busy = useRef(false);
  const resetRef = useRef<() => void>(null);
  const hintId = useId();
  async function upload(file: File | null): Promise<void> {
    if (!file || busy.current) return;
    setMessage("");
    const problem = validateProfilePicture(file);
    setError(problem ?? "");
    if (problem) {
      resetRef.current?.();
      return;
    }
    busy.current = true;
    setLoading(true);
    try {
      const response = await postProfilePicture(token, file);
      setUploadedPicture(response.data.picture);
      await updateProfilePictureCookie(response.data.picture);
      setMessage("Foto berhasil diperbarui.");
    } catch {
      setError(
        "Foto belum berhasil diperbarui. Silakan pilih foto dan coba lagi.",
      );
    } finally {
      busy.current = false;
      setLoading(false);
      resetRef.current?.();
    }
  }
  const picture = uploadedPicture ?? src;
  return (
    <Stack align="center" gap={4} maw={180}>
      <Avatar
        size={size}
        radius={radius}
        alt="Foto profil"
        src={
          picture
            ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${picture}`
            : undefined
        }
      />
      <FileButton
        onChange={upload}
        accept="image/png,image/jpeg"
        resetRef={resetRef}
      >
        {(props) => (
          <Button
            {...props}
            variant="subtle"
            px="xs"
            loading={loading}
            aria-describedby={hintId}
            leftSection={<IconPencil size={16} aria-hidden />}
          >
            Ubah foto
          </Button>
        )}
      </FileButton>
      <Text id={hintId} size="xs" c="dimmed" ta="center">
        JPG / PNG, maks. 2 MB
      </Text>
      {error && (
        <Text role="alert" size="sm" c="red" ta="center">
          {error}
        </Text>
      )}
      <Text role="status" size="sm" ta="center">
        {loading ? "Mengunggah foto..." : message}
      </Text>
    </Stack>
  );
}
