"use client";

import {
  Paper,
  Group,
  Title,
  Divider,
  Box,
  Image,
  rem,
} from "@mantine/core";
import { IconUsers, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Carousel } from "@mantine/carousel";
import classes from "./index.module.css";

type MediaItem = {
  media_url: string;
  media_type: 'image' | 'video';
  video_source?: 'youtube';
};

type MediaStructure = {
  items: MediaItem[];
};

type MediaCarouselProps = {
  media: MediaStructure;
  clubName: string;
};

export default function MediaCarousel({ media, clubName }: MediaCarouselProps) {
  if (!media || !media.items || media.items.length === 0) {
    return null;
  }

  return (
    <Paper p="xl" radius="md" shadow="sm">
      <Group mb="md">
        <IconUsers size={24} />
        <Title order={2}>Galeri Media</Title>
      </Group>
      <Divider mb="md" />
      
      <Box style={{ position: 'relative' }}>
        <Carousel
          withIndicators
          withControls
          slideGap="md"
          className={classes.carousel}
          classNames={{
            root: classes.carouselRoot,
            viewport: classes.carouselViewport,
            control: classes.carouselControl,
            indicators: classes.carouselIndicators,
          }}
          previousControlIcon={<IconChevronLeft size={20} />}
          nextControlIcon={<IconChevronRight size={20} />}
        >
          {media.items.map((item, index) => (
            <Carousel.Slide key={index}>
              <Box 
                style={{ 
                  height: '60vh',
                  minHeight: '400px',
                  maxHeight: '600px',
                  overflow: 'hidden',
                  position: 'relative',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                }}
              >
                {item.media_type === 'image' ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${item.media_url}`}
                    alt={`${clubName} media ${index + 1}`}
                    fit="cover"
                    style={{ 
                      height: '100%',
                      width: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                    }}
                  />
                ) : item.media_type === 'video' && item.video_source === 'youtube' ? (
                  <Box style={{ position: 'relative', height: '100%', width: '100%' }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${item.media_url}?rel=0&modestbranding=1&autoplay=0&controls=1`}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none',
                      }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={`${clubName} video ${index + 1}`}
                    />
                  </Box>
                ) : (
                  <Box
                    style={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--mantine-color-gray-6)',
                      fontSize: '18px',
                    }}
                  >
                    Media tidak didukung
                  </Box>
                )}
                
                {/* Media Type Indicator */}
                <Box
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>{item.media_type === 'video' ? '🎥' : '📷'}</span>
                  {item.media_type === 'video' ? 'Video' : 'Foto'}
                </Box>
                
                {/* Slide Counter */}
                <Box
                  style={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 500,
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {index + 1} / {media.items.length}
                </Box>
              </Box>
            </Carousel.Slide>
          ))}
        </Carousel>
      </Box>
    </Paper>
  );
}
