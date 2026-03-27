"use client";

import { Image } from "@mantine/core";
import { Carousel, CarouselSlide } from "@mantine/carousel";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";

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
}: ActivityCarouselProps) {
  return (
    <Carousel
      classNames={{
        control: classes["carousel-control"],
        indicator: classes["carousel-indicator"],
        slide: classes["carousel-slide"],
      }}
      slideGap="md"
      withIndicators
      controlsOffset={0}
      controlSize={40}
      emblaOptions={{ loop: true, align: "start" }}
      nextControlIcon={<IconArrowRight size={24} color="white" />}
      previousControlIcon={<IconArrowLeft size={24} color="white" />}
      withControls={images.length > 1}
    >
      {images.length ? (
        images.map((image) => (
          <CarouselSlide key={image}>
            <Image
              src={`${imageBaseUrl}/${image}`}
              alt="Activity Banner"
              className={classes["carousel-image"]}
              fallbackSrc={"https://placehold.co/700x700?text=" + activityName}
            />
          </CarouselSlide>
        ))
      ) : (
        <CarouselSlide>
          <Image
            src={"https://placehold.co/700x700?text=" + activityName}
            alt="Activity Banner"
            className={classes["carousel-image"]}
          />
        </CarouselSlide>
      )}
    </Carousel>
  );
}
