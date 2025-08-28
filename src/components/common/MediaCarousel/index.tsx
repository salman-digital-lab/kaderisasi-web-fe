"use client";

import {
  Paper,
  Group,
  Title,
  Divider,
  Box,
  Image,
  rem,
  Button,
  Text,
} from "@mantine/core";
import { IconUsers, IconChevronLeft, IconChevronRight, IconAlertCircle, IconRefresh, IconPlayerPlay } from "@tabler/icons-react";
import { Carousel } from "@mantine/carousel";
import { useState, useRef, useEffect } from "react";
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

// YouTube error handling component
function YouTubePlayer({ videoUrl, clubName, index }: { videoUrl: string; clubName: string; index: number }) {
  // Extract video ID from the full YouTube embed URL
  const extractVideoId = (url: string): string | null => {
    if (!url) return null;
    
    // Handle direct video IDs
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
      return url;
    }
    
    // Handle various YouTube URL formats
    const patterns = [
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    
    // Fallback: try to extract from any string that might contain a video ID
    const fallbackMatch = url.match(/([a-zA-Z0-9_-]{11})/);
    return fallbackMatch ? fallbackMatch[1] : null;
  };
  
  const videoId = extractVideoId(videoUrl);
  
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [errorType, setErrorType] = useState<'network' | 'video' | 'timeout' | 'invalid_url' | 'unknown'>('unknown');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const maxRetries = 3;
  const loadTimeout = 15000; // 15 seconds timeout

  // Check if we have a valid video ID
  useEffect(() => {
    if (!videoId) {
      setHasError(true);
      setErrorType('invalid_url');
      setIsLoading(false);
      return;
    }
    
    setHasError(false);
    setIsLoading(true);
    setRetryCount(0);
    setErrorType('unknown');
    
    // Set initial timeout
    timeoutRef.current = setTimeout(handleTimeout, loadTimeout);
    
    // Cleanup timeout on unmount or videoUrl change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [videoUrl, videoId]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
    setErrorType('unknown');
    
    // Clear timeout when video loads successfully
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
    
    // Clear timeout when error occurs
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Try to determine error type based on retry count and other factors
    if (retryCount === 0) {
      setErrorType('network');
    } else {
      setErrorType('video');
    }
  };

  const handleTimeout = () => {
    setIsLoading(false);
    setHasError(true);
    setErrorType('timeout');
  };

  const handleRetry = () => {
    if (!videoId) return;
    
    setRetryCount(prev => prev + 1);
    setHasError(false);
    setIsLoading(true);
    
    // Set timeout for this retry attempt
    timeoutRef.current = setTimeout(handleTimeout, loadTimeout);
    
    // Force iframe reload by changing the src
    if (iframeRef.current) {
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = '';
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = currentSrc;
        }
      }, 100);
    }
  };

  const openInYouTube = () => {
    if (videoId) {
      window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    } else {
      // Fallback to original URL if no video ID extracted
      window.open(videoUrl, '_blank');
    }
  };

  const getErrorMessage = () => {
    switch (errorType) {
      case 'network':
        return 'Masalah koneksi internet. Periksa koneksi Anda dan coba lagi.';
      case 'video':
        return 'Video tidak tersedia atau dibatasi. Silakan buka video di YouTube.';
      case 'timeout':
        return 'Video membutuhkan waktu terlalu lama untuk dimuat. Coba lagi atau buka di YouTube.';
      case 'invalid_url':
        return 'URL video YouTube tidak valid. Silakan periksa link video.';
      default:
        return 'Terjadi kesalahan saat memuat video YouTube. Silakan coba lagi nanti.';
    }
  };

  const getErrorTitle = () => {
    switch (errorType) {
      case 'network':
        return 'Masalah Koneksi';
      case 'video':
        return 'Video Tidak Tersedia';
      case 'timeout':
        return 'Video Terlalu Lama Dimuat';
      case 'invalid_url':
        return 'URL Video Tidak Valid';
      default:
        return 'Video tidak dapat diputar';
    }
  };

  // If no valid video ID, show invalid URL error
  if (!videoId) {
    return (
      <Box
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }}
      >
        <IconAlertCircle size={48} color="var(--mantine-color-red-6)" />
        <Text size="lg" fw={600} mt="md" mb="xs">
          {getErrorTitle()}
        </Text>
        <Text size="sm" c="dimmed" mb="lg" style={{ maxWidth: '300px' }}>
          {getErrorMessage()}
        </Text>
        <Text size="xs" c="dimmed" mt="md" style={{ maxWidth: '300px' }}>
          URL yang diberikan: {videoUrl}
        </Text>
      </Box>
    );
  }

  if (hasError && retryCount >= maxRetries) {
    return (
      <Box
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }}
      >
        <IconAlertCircle size={48} color="var(--mantine-color-red-6)" />
        <Text size="lg" fw={600} mt="md" mb="xs">
          {getErrorTitle()}
        </Text>
        <Text size="sm" c="dimmed" mb="lg" style={{ maxWidth: '300px' }}>
          {getErrorMessage()}
        </Text>
        <Group gap="sm">
          <Button
            variant="light"
            leftSection={<IconRefresh size={16} />}
            onClick={handleRetry}
            size="sm"
          >
            Coba Lagi
          </Button>
          <Button
            variant="filled"
            leftSection={<IconPlayerPlay size={16} />}
            onClick={openInYouTube}
            size="sm"
          >
            Buka di YouTube
          </Button>
        </Group>
        <Text size="xs" c="dimmed" mt="md" style={{ maxWidth: '300px' }}>
          Jika masalah berlanjut, video mungkin dibatasi atau tidak tersedia di wilayah Anda.
        </Text>
      </Box>
    );
  }

  return (
    <Box style={{ position: 'relative', height: '100%', width: '100%' }}>
      {isLoading && (
        <Box
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            zIndex: 1,
          }}
        >
          <Box style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '3px solid #e9ecef',
              borderTop: '3px solid #228be6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }} />
            <Text size="sm" c="dimmed">Memuat video...</Text>
          </Box>
        </Box>
      )}
      
      {hasError && retryCount < maxRetries && (
        <Box
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            zIndex: 2,
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <IconAlertCircle size={32} />
          <Text size="sm" mt="xs" mb="md">
            Gagal memuat video (Percobaan {retryCount + 1}/{maxRetries})
          </Text>
          <Text size="xs" c="dimmed" mb="md" style={{ maxWidth: '250px' }}>
            {getErrorMessage()}
          </Text>
          <Button
            variant="light"
            size="sm"
            onClick={handleRetry}
            leftSection={<IconRefresh size={16} />}
          >
            Coba Lagi
          </Button>
        </Box>
      )}

      <iframe
        ref={iframeRef}
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=0&controls=1`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none',
          opacity: isLoading || hasError ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={`${clubName} video ${index + 1}`}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
      />
    </Box>
  );
}

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
                  <YouTubePlayer 
                    videoUrl={item.media_url} 
                    clubName={clubName} 
                    index={index} 
                  />
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
                    zIndex: 3,
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
                    zIndex: 3,
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
