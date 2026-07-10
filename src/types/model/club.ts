import type { Activity } from './activity';

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

export type ClubType = 'UKM' | 'AVISMAN';

export type ClubLeadershipRole = {
  id: number;
  club_registration_id: number;
  role_name: string;
  start_date?: string | null;
  end_date?: string | null;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  registration?: {
    id: number;
    member?: {
      id: number;
      email?: string | null;
      profile?: {
        name?: string;
        picture?: string;
      };
    };
  };
};

export type Club = {
  id: number;
  name: string;
  club_type: ClubType;
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

export type ClubDetail = Club & {
  activities?: Activity[];
  leadership?: ClubLeadershipRole[];
};
