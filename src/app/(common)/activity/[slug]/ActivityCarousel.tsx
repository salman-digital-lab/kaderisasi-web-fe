"use client";

import { Image } from "@mantine/core";
import { Carousel, CarouselSlide } from "@mantine/carousel";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import type { ReactElement } from "react";
import classes from "./index.module.css";

type ActivityCarouselProps = {
  images: string[];
  activityName: string;
  imageBaseUrl: string;
};

export default function ActivityCarousel({
  images,
  activityName,
  imageBaseUrl,
}: ActivityCarouselProps): ReactElement | null {
  if (images.length === 0) return null;
  return (
    <Carousel
      classNames={{
        control: classes["carousel-control"],
        indicator: classes["carousel-indicator"],
        slide: classes["carousel-slide"],
      }}
      slideGap="md"
      withIndicators={images.length > 1}
      controlsOffset="sm"
      controlSize={44}
      emblaOptions={{ loop: true, align: "start" }}
      nextControlProps={{ "aria-label": "Gambar berikutnya" }}
      previousControlProps={{ "aria-label": "Gambar sebelumnya" }}
      nextControlIcon={<IconArrowRight size={24} aria-hidden />}
      previousControlIcon={<IconArrowLeft size={24} aria-hidden />}
      withControls={images.length > 1}
    >
      {images.map((image, index) => (
        <CarouselSlide key={image}>
          <Image
            src={`${imageBaseUrl}/${image}`}
            alt={`${activityName} — gambar ${index + 1}`}
            className={classes["carousel-image"]}
          />
        </CarouselSlide>
      ))}
    </Carousel>
  );
}
