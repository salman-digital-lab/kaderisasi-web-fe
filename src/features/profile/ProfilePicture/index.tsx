"use client";

import showNotif from "@/functions/common/notification";
import { postProfilePicture } from "@/services/profile";
import { Avatar, FileButton, Indicator, LoadingOverlay, Stack } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import { useState } from "react";

interface ProfilePictureProps {
  src?: string;
  size?: number;
  radius?: number;
  token: string;
}

export function ProfilePicture({
  src,
  size = 120,
  radius = 120,
  token,
}: ProfilePictureProps) {
  const [fileName, setFileName] = useState<string | null>(src || "");
  const [loading, setLoading] = useState<boolean>(false);

  const handleUploadPicture = async (file: File | null) => {
    if (!file) return;
    try {
      setLoading(true);
      const resp = await postProfilePicture(token, file);
      if (resp) {
        showNotif(resp.message);
        setFileName(resp.data.picture);
      }
    } catch (error: unknown) {
      if (error instanceof Error) showNotif(error.message, true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack>
      <FileButton onChange={handleUploadPicture} accept="image/png,image/jpeg">
        {(props) => (
          <Indicator
            {...props}
            offset={18}
            label={<IconPencil size={20} />}
            size={30}
            w="fit-content"
            mx="auto"
            style={{ cursor: "pointer" }}
          >
            <LoadingOverlay
              visible={loading}
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
            />
            <Avatar
              size={size}
              radius={radius}
              mx="auto"
              src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${fileName}`}
            />
          </Indicator>
        )}
      </FileButton>
    </Stack>
  );
}
