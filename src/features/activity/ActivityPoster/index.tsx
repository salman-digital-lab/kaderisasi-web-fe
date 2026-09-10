"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import Image from "next/image";
import {
  ActionIcon,
  Group,
  Modal,
  Paper,
  Skeleton,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconArrowLeft,
  IconArrowRight,
  IconPhotoOff,
  IconZoomIn,
} from "@tabler/icons-react";
import classes from "./index.module.css";

type ActivityPosterProps = {
  images: string[];
  activityName: string;
  imageBaseUrl: string;
};

function PosterImage({
  src,
  alt,
  sizes,
  eager = false,
  onError,
}: {
  src: string;
  alt: string;
  sizes: string;
  eager?: boolean;
  onError?: () => void;
}): ReactElement {
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");
  return (
    <span className={classes.imageFrame}>
      {state === "loading" ? (
        <Skeleton className={classes.loading} aria-hidden="true" />
      ) : null}
      {state === "error" ? (
        <Text component="span" className={classes.imageError}>
          {alt ? (
            "Poster belum dapat dimuat."
          ) : (
            <IconPhotoOff size={24} aria-hidden="true" />
          )}
        </Text>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : undefined}
          className={classes.image}
          onLoad={() => setState("loaded")}
          onError={() => {
            setState("error");
            onError?.();
          }}
        />
      )}
    </span>
  );
}

export default function ActivityPoster({
  images,
  activityName,
  imageBaseUrl,
}: ActivityPosterProps): ReactElement | null {
  const [activeIndex, setActiveIndex] = useState(0);
  const [opened, setOpened] = useState(false);
  const [failedPosters, setFailedPosters] = useState<string[]>([]);
  const fullScreen = useMediaQuery("(max-width: 48em)");
  const selectedIndex = activeIndex < images.length ? activeIndex : 0;
  const selected = images[selectedIndex];
  if (!selected) return null;
  const src = `${imageBaseUrl}/${selected}`;
  const alt = `Poster ${selectedIndex + 1}: ${activityName}`;

  function movePoster(direction: number): void {
    setActiveIndex(
      (current) => (current + direction + images.length) % images.length,
    );
  }

  return (
    <Stack gap="sm">
      {failedPosters.includes(selected) ? (
        <Paper withBorder radius="md" p="lg" id="active-activity-poster">
          <Text size="sm" fw={600}>
            Poster belum dapat dimuat.
          </Text>
          <Text size="sm" c="dimmed" mt="xs">
            Informasi kegiatan dan pendaftaran tetap tersedia di bawah.
          </Text>
        </Paper>
      ) : (
        <UnstyledButton
          className={classes.poster}
          aria-label={`Perbesar poster ${selectedIndex + 1}: ${activityName}`}
          aria-haspopup="dialog"
          onClick={() => setOpened(true)}
        >
          <span className={classes.posterVisual} id="active-activity-poster">
            <PosterImage
              key={src}
              src={src}
              alt={alt}
              sizes="(max-width: 768px) calc(100vw - 32px), 596px"
              eager
              onError={() =>
                setFailedPosters((current) =>
                  current.includes(selected) ? current : [...current, selected],
                )
              }
            />
          </span>
          <Group
            component="span"
            justify="space-between"
            wrap="nowrap"
            className={classes.caption}
          >
            <Text component="span" size="sm" fw={600}>
              Perbesar poster
            </Text>
            <IconZoomIn size={18} aria-hidden="true" />
          </Group>
        </UnstyledButton>
      )}

      {images.length > 1 ? (
        <>
          <Text size="sm" c="dimmed" aria-live="polite" aria-atomic="true">
            Poster {selectedIndex + 1} dari {images.length}
          </Text>
          <Group gap="xs" role="group" aria-label="Pilih poster kegiatan">
            {images.map((image, index) => (
              <UnstyledButton
                key={`${image}-${index}`}
                className={classes.thumbnail}
                aria-label={`Tampilkan poster ${index + 1}`}
                aria-pressed={selectedIndex === index}
                aria-controls="active-activity-poster"
                onClick={() => setActiveIndex(index)}
              >
                <span className={classes.thumbnailVisual}>
                  <PosterImage
                    src={`${imageBaseUrl}/${image}`}
                    alt=""
                    sizes="64px"
                  />
                </span>
                <Text
                  component="span"
                  size="xs"
                  fw={600}
                  className={classes.thumbnailNumber}
                >
                  {index + 1}
                </Text>
              </UnstyledButton>
            ))}
          </Group>
        </>
      ) : null}

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={`Poster ${activityName}`}
        fullScreen={fullScreen}
        size="min(960px, 100%)"
        centered
        removeScrollProps={{ allowPinchZoom: true }}
        closeButtonProps={{ "aria-label": "Tutup poster", size: 44 }}
        classNames={{ title: classes.modalTitle }}
        onKeyDown={(event) => {
          if (images.length < 2) return;
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            movePoster(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
      >
        <div className={classes.expandedVisual}>
          <PosterImage
            key={src}
            src={src}
            alt={alt}
            sizes="(max-width: 768px) 100vw, 900px"
            eager
          />
        </div>
        {images.length > 1 ? (
          <Group justify="space-between" mt="md">
            <ActionIcon
              size={44}
              variant="default"
              aria-label="Poster sebelumnya"
              onClick={() => movePoster(-1)}
            >
              <IconArrowLeft size={20} aria-hidden="true" />
            </ActionIcon>
            <Text size="sm" aria-live="polite" aria-atomic="true">
              Poster {selectedIndex + 1} dari {images.length}
            </Text>
            <ActionIcon
              size={44}
              variant="default"
              aria-label="Poster berikutnya"
              onClick={() => movePoster(1)}
            >
              <IconArrowRight size={20} aria-hidden="true" />
            </ActionIcon>
          </Group>
        ) : null}
      </Modal>
    </Stack>
  );
}
