"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { IconUsersGroup } from "@tabler/icons-react";
import classes from "./index.module.css";

type ClubLogoProps = {
  imageSrc?: string;
  clubName: string;
  size: number;
  priority?: boolean;
  className?: string;
};

export default function ClubLogo({
  imageSrc,
  clubName,
  size,
  priority = false,
  className,
}: ClubLogoProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const hasUsableImage = Boolean(imageSrc && failedSource !== imageSrc);

  return (
    <div
      className={[classes.frame, className].filter(Boolean).join(" ")}
      style={{ "--club-logo-size": `${size}px` } as CSSProperties}
    >
      {hasUsableImage && imageSrc ? (
        <Image
          src={imageSrc}
          alt={`Logo ${clubName}`}
          width={size}
          height={size}
          sizes={`${size}px`}
          preload={priority}
          className={classes.image}
          onError={() => setFailedSource(imageSrc)}
        />
      ) : (
        <span
          className={classes.fallback}
          role="img"
          aria-label={`Logo ${clubName} tidak tersedia`}
        >
          <IconUsersGroup aria-hidden="true" />
        </span>
      )}
    </div>
  );
}
