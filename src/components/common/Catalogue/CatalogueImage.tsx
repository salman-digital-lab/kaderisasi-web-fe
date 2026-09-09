"use client";

import Image from "next/image";
import { useState } from "react";
import type { ReactElement, ReactNode } from "react";
import classes from "./Catalogue.module.css";

type CatalogueImageProps = {
  src?: string;
  alt: string;
  variant: "poster" | "logo";
  fallback: ReactNode;
};

export default function CatalogueImage({
  src,
  alt,
  variant,
  fallback,
}: CatalogueImageProps): ReactElement {
  const [failedSource, setFailedSource] = useState<string>();
  if (!src || src === failedSource) {
    return (
      <div className={classes.placeholder} aria-hidden>
        {fallback}
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={variant === "logo" ? 112 : 400}
      height={variant === "logo" ? 112 : 180}
      sizes={
        variant === "logo"
          ? "112px"
          : "(max-width: 48em) 100vw, (max-width: 75em) 50vw, 25vw"
      }
      className={variant === "logo" ? classes.logo : classes.image}
      onError={() => setFailedSource(src)}
    />
  );
}
