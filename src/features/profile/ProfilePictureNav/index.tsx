"use client";

import { getProfile } from "@/services/profile";
import { Avatar } from "@mantine/core";
import { useEffect, useState } from "react";

interface ProfilePictureProps {
  src?: string;
  token: string;
}

export default function ProfilePictureNav({ src, token }: ProfilePictureProps) {
  const [fileName, setFileName] = useState<string | null>(src || "");

  useEffect(() => {
    const fetchProfilePicture = async () => {
      const cachedPicture = localStorage.getItem(`profile-picture-${token}`);
      if (cachedPicture) {
        setFileName(cachedPicture);
        return;
      }

      const resp = await getProfile(token);
      const picture = resp?.profile?.picture || "";
      setFileName(picture);
      localStorage.setItem(`profile-picture-${token}`, picture);
    };
    fetchProfilePicture();
  }, [token]);

  return (
    <Avatar
      radius="xl"
      src={
        fileName && fileName !== ""
          ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${fileName}`
          : undefined
      }
    />
  );
}
