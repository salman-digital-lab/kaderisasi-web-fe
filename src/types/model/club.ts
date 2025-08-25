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
  short_description: string | null;
  logo: string;
  media: MediaStructure;
  start_period: string | null;
  end_period: string | null;
  is_show: boolean;
  created_at: string;
  updated_at: string;
};
