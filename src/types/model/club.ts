export type MediaItem = {
  media_url: string;
  media_type: 'image' | 'video';
  video_source?: 'youtube'; // Only present when media_type is 'video'
};

export type MediaStructure = {
  items: MediaItem[];
};

export type Club = {
  id: number;
  name: string;
  description: string;
  logo: string;
  media: MediaStructure;
  startPeriod: string | null;
  endPeriod: string | null;
  isShow: boolean;
  createdAt: string;
  updatedAt: string;
};
