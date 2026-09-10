"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import Image from "next/image";
import {
  ActionIcon,
  Group,
  Modal,
  SimpleGrid,
  Skeleton,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconArrowLeft, IconArrowRight, IconZoomIn } from "@tabler/icons-react";
import classes from "./index.module.css";

type MediaGalleryProps = {
  items: { media_type: "image" | "video"; media_url: string }[];
  subjectName: string;
  imageBaseUrl: string;
};

function GalleryImage({
  src,
  alt,
  expanded = false,
}: {
  src: string;
  alt: string;
  expanded?: boolean;
}): ReactElement {
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");

  return (
    <span className={classes.imageFrame}>
      {state === "loading" ? (
        <Skeleton className={classes.imageLoading} aria-label="Memuat gambar" />
      ) : null}
      {state === "error" ? (
        <Text component="span" className={classes.imageError}>
          Gambar belum dapat dimuat.
        </Text>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={
            expanded
              ? "(max-width: 768px) 100vw, 900px"
              : "(max-width: 768px) 50vw, 290px"
          }
          className={classes.image}
          onLoad={() => setState("loaded")}
          onError={() => setState("error")}
        />
      )}
    </span>
  );
}

export default function MediaGallery({
  items,
  subjectName,
  imageBaseUrl,
}: MediaGalleryProps): ReactElement {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const fullScreen = useMediaQuery("(max-width: 48em)");
  const images = items.filter((item) => item.media_type === "image");
  const selected = selectedIndex === null ? undefined : images[selectedIndex];

  function moveImage(direction: number): void {
    setSelectedIndex((current) =>
      current === null
        ? null
        : (current + direction + images.length) % images.length,
    );
  }

  return (
    <>
      <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="md">
        {items.map((item, index) =>
          item.media_type === "image" ? (
            <UnstyledButton
              key={`${item.media_url}-${index}`}
              className={classes.thumbnail}
              aria-label={`Perbesar gambar ${index + 1} dari ${subjectName}`}
              aria-haspopup="dialog"
              onClick={() => setSelectedIndex(images.indexOf(item))}
            >
              <span className={classes.thumbnailVisual}>
                <GalleryImage
                  src={`${imageBaseUrl}/${item.media_url}`}
                  alt={`Gambar ${index + 1} dari ${subjectName}`}
                />
              </span>
              <Group
                component="span"
                justify="space-between"
                wrap="nowrap"
                className={classes.caption}
              >
                <Text component="span" size="sm" fw={600}>
                  Gambar {index + 1}
                </Text>
                <IconZoomIn size={18} aria-hidden="true" />
              </Group>
            </UnstyledButton>
          ) : (
            <figure
              key={`${item.media_url}-${index}`}
              className={classes.videoItem}
            >
              <iframe
                src={item.media_url}
                title={`Video ${index + 1} dari ${subjectName}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className={classes.video}
              />
              <figcaption className={classes.caption}>
                Video {index + 1}
              </figcaption>
            </figure>
          ),
        )}
      </SimpleGrid>

      <Modal
        opened={selected !== undefined}
        onClose={() => setSelectedIndex(null)}
        title={`Galeri ${subjectName}`}
        size="min(960px, 100%)"
        fullScreen={fullScreen}
        removeScrollProps={{ allowPinchZoom: true }}
        centered
        closeButtonProps={{ "aria-label": "Tutup galeri", size: 44 }}
        classNames={{ title: classes.modalTitle }}
        onKeyDown={(event) => {
          if (images.length < 2) return;
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            moveImage(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
      >
        {selected ? (
          <>
            <div className={classes.expandedVisual}>
              <GalleryImage
                key={selected.media_url}
                src={`${imageBaseUrl}/${selected.media_url}`}
                alt={`Gambar ${items.indexOf(selected) + 1} dari ${subjectName}`}
                expanded
              />
            </div>
            <Group justify="space-between" mt="md">
              <ActionIcon
                variant="default"
                aria-label="Gambar sebelumnya"
                onClick={() => moveImage(-1)}
                disabled={images.length < 2}
              >
                <IconArrowLeft size={20} aria-hidden="true" />
              </ActionIcon>
              <Text size="sm" aria-live="polite" aria-atomic="true">
                {(selectedIndex ?? 0) + 1} dari {images.length} gambar
              </Text>
              <ActionIcon
                variant="default"
                aria-label="Gambar berikutnya"
                onClick={() => moveImage(1)}
                disabled={images.length < 2}
              >
                <IconArrowRight size={20} aria-hidden="true" />
              </ActionIcon>
            </Group>
          </>
        ) : null}
      </Modal>
    </>
  );
}
