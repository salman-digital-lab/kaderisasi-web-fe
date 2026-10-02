"use client";

import {
  ActionIcon,
  Avatar,
  FileButton,
  Text,
  VisuallyHidden,
} from "@mantine/core";
import { IconCamera } from "@tabler/icons-react";
import { useId, useRef, useState } from "react";
import type { ReactElement } from "react";
import { postProfilePicture } from "@/services/profile";
import updateProfilePictureCookie from "@/functions/server/updateProfilePictureCookie";
import { validateProfilePicture } from "../picture-validation";
import classes from "../profile.module.css";

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
    <div className={classes.picture}>
      <div className={classes.avatarWrap}>
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
            <ActionIcon
              {...props}
              variant="default"
              radius="xl"
              size="lg"
              loading={loading}
              aria-label="Ubah foto"
              aria-describedby={hintId}
              className={classes.avatarEdit}
            >
              <IconCamera size={18} aria-hidden />
            </ActionIcon>
          )}
        </FileButton>
      </div>
      <VisuallyHidden id={hintId}>
        Format JPG atau PNG, maksimal 2 MB.
      </VisuallyHidden>
      {error && (
        <Text role="alert" size="sm" c="red" maw={220}>
          {error}
        </Text>
      )}
      <Text role="status" size="sm" maw={220}>
        {loading ? "Mengunggah foto..." : message}
      </Text>
    </div>
  );
}
