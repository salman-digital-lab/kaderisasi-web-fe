"use client";

import { Avatar } from "@mantine/core";
import { getImageProps } from "next/image";
import { useCallback, useState } from "react";
import type { ReactElement } from "react";

interface ProfilePictureProps {
  src?: string;
  token?: string;
  size?: number;
}

export default function ProfilePictureNav({
  src,
  size = 38,
}: ProfilePictureProps): ReactElement {
  const [failedSource, setFailedSource] = useState<string>();
  const imageRef = useCallback(
    (image: HTMLImageElement | null): void => {
      // Cached failures can finish before React attaches the error handler.
      if (image?.complete && image.naturalWidth === 0) setFailedSource(src);
    },
    [src],
  );
  const imageProps = src && src !== failedSource
    ? getImageProps({
        src: `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${src}`,
        alt: "",
        width: size,
        height: size,
      }).props
    : undefined;

  return (
    <Avatar
      radius="xl"
      size={size}
      src={imageProps?.src}
      alt=""
      imageProps={{
        ...imageProps,
        ref: imageRef,
        onError: () => setFailedSource(src),
      }}
    />
  );
}
