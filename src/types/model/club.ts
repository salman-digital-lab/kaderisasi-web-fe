import type { Activity } from "./activity";

export type MediaItem = {
  media_url: string;
  media_type: "image" | "video";
  video_source?: "youtube"; // Only present when media_type is 'video'
};

export type MediaStructure = {
  items: MediaItem[];
};

export type RegistrationInfo = {
  registration_info: string;
};

export const CLUB_TYPES = [
  "UNIT",
  "CLUB_KEPROFESIAN",
  "CLUB_BAHASA",
  "AVISMAN_REGIONAL",
] as const;

export type ClubType = (typeof CLUB_TYPES)[number];

export const CLUB_TYPE_LABELS: Record<ClubType, string> = {
  UNIT: "Unit",
  CLUB_KEPROFESIAN: "Club Keprofesian",
  CLUB_BAHASA: "Club Bahasa",
  AVISMAN_REGIONAL: "Avisman Regional",
};

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
