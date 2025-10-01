"use client";

import { Avatar } from "@mantine/core";

interface ProfilePictureProps {
  src?: string;
  token: string;
}

export default function ProfilePictureNav({ src, token }: ProfilePictureProps) {
  return (
    <Avatar
      radius="xl"
      src={
        src && src !== ""
          ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${src}`
          : undefined
      }
    />
  );
}
