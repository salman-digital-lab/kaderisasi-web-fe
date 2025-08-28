export type MediaItem = {
  media_url: string;
  media_type: 'image' | 'video';
  video_source?: 'youtube'; // Only present when media_type is 'video'
};

export type MediaStructure = {
  items: MediaItem[];
};

export type RegistrationInfo = {
  registration_info: string;
  after_registration_info: string;
};

export type Club = {
  id: number;
  name: string;
  description: string;
  short_description: string | null;
  logo: string;
  media: MediaStructure;
  registration_info?: RegistrationInfo;
  start_period: string | null;
  end_period: string | null;
  is_show: boolean;
  is_registration_open?: boolean;
  registration_end_date?: string | null;
  created_at: string;
  updated_at: string;
};
