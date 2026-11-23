export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  const fallbackMatch = url.match(/([a-zA-Z0-9_-]{11})/);
  return fallbackMatch?.[1] ?? null;
}

export function isValidYouTubeVideoId(videoId: string): boolean {
  if (!videoId) return false;

  // YouTube video IDs are exactly 11 characters long and contain only alphanumeric characters, hyphens, and underscores
  return /^[a-zA-Z0-9_-]{11}$/.test(videoId);
}

export function isValidYouTubeUrl(url: string): boolean {
  if (!url) return false;

  if (isValidYouTubeVideoId(url)) {
    return true;
  }

  const videoId = extractYouTubeVideoId(url);
  return videoId !== null;
}

export function generateYouTubeEmbedUrl(
  videoId: string,
  options: {
    autoplay?: boolean;
    controls?: boolean;
    modestbranding?: boolean;
    rel?: boolean;
    start?: number;
    end?: number;
  } = {},
): string {
  if (!isValidYouTubeVideoId(videoId)) {
    throw new Error("Invalid YouTube video ID");
  }

  const {
    autoplay = false,
    controls = true,
    modestbranding = true,
    rel = false,
    start,
    end,
  } = options;

  const params = new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    controls: controls ? "1" : "0",
    modestbranding: modestbranding ? "1" : "0",
    rel: rel ? "1" : "0",
  });

  if (start !== undefined) {
    params.append("start", start.toString());
  }

  if (end !== undefined) {
    params.append("end", end.toString());
  }

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

export function generateYouTubeEmbedUrlFromUrl(
  videoUrl: string,
  options: {
    autoplay?: boolean;
    controls?: boolean;
    modestbranding?: boolean;
    rel?: boolean;
    start?: number;
    end?: number;
  } = {},
): string | null {
  const videoId = extractYouTubeVideoId(videoUrl);
  if (!videoId) {
    return null;
  }

  return generateYouTubeEmbedUrl(videoId, options);
}

export function getYouTubeThumbnailUrls(videoId: string): {
  default: string;
  medium: string;
  high: string;
  standard: string;
  maxres: string;
} {
  if (!isValidYouTubeVideoId(videoId)) {
    throw new Error("Invalid YouTube video ID");
  }

  const baseUrl = `https://img.youtube.com/vi/${videoId}`;

  return {
    default: `${baseUrl}/default.jpg`,
    medium: `${baseUrl}/mqdefault.jpg`,
    high: `${baseUrl}/hqdefault.jpg`,
    standard: `${baseUrl}/sddefault.jpg`,
    maxres: `${baseUrl}/maxresdefault.jpg`,
  };
}

export function getYouTubeThumbnailUrlsFromUrl(videoUrl: string): {
  default: string;
  medium: string;
  high: string;
  standard: string;
  maxres: string;
} | null {
  const videoId = extractYouTubeVideoId(videoUrl);
  if (!videoId) {
    return null;
  }

  return getYouTubeThumbnailUrls(videoId);
}

export async function checkYouTubeVideoAvailability(videoId: string): Promise<{
  available: boolean;
  error?: string;
}> {
  if (!isValidYouTubeVideoId(videoId)) {
    return {
      available: false,
      error: "Invalid video ID format",
    };
  }

  try {
    // Try to fetch the video thumbnail as a basic availability check
    const thumbnailUrl = getYouTubeThumbnailUrls(videoId).default;
    const response = await fetch(thumbnailUrl, { method: "HEAD" });

    if (response.ok) {
      return { available: true };
    } else if (response.status === 404) {
      return {
        available: false,
        error: "Video not found or removed",
      };
    } else {
      return {
        available: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }
  } catch (error) {
    return {
      available: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}

export async function checkYouTubeVideoAvailabilityFromUrl(
  videoUrl: string,
): Promise<{
  available: boolean;
  error?: string;
}> {
  const videoId = extractYouTubeVideoId(videoUrl);
  if (!videoId) {
    return {
      available: false,
      error: "Invalid YouTube URL or video ID",
    };
  }

  return checkYouTubeVideoAvailability(videoId);
}

export const YOUTUBE_ERROR_MESSAGES = {
  network: "Masalah koneksi internet. Periksa koneksi Anda dan coba lagi.",
  video: "Video tidak tersedia atau dibatasi. Silakan buka video di YouTube.",
  timeout:
    "Video membutuhkan waktu terlalu lama untuk dimuat. Coba lagi atau buka di YouTube.",
  unavailable: "Video tidak tersedia atau telah dihapus.",
  restricted: "Video dibatasi dan tidak dapat diputar di wilayah ini.",
  private: "Video bersifat pribadi dan tidak dapat diakses.",
  invalid_url: "URL video YouTube tidak valid. Silakan periksa link video.",
  unknown:
    "Terjadi kesalahan saat memuat video YouTube. Silakan coba lagi nanti.",
} as const;

export function getYouTubeErrorMessage(
  errorType: keyof typeof YOUTUBE_ERROR_MESSAGES,
): string {
  return YOUTUBE_ERROR_MESSAGES[errorType] || YOUTUBE_ERROR_MESSAGES.unknown;
}
