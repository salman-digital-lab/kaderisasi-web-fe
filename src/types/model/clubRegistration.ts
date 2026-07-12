import type { Club } from "./club";

export interface ClubRegistrationRole {
  id: number;
  club_registration_id: number;
  role_name: string;
  start_date?: string | null;
  end_date?: string | null;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ClubRegistration {
  id: number;
  club_id: number;
  member_id: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  additional_data: Record<string, any>;
  created_at: string;
  updated_at: string;
  
  // Relations
  club?: Club;
  roles?: ClubRegistrationRole[];
}

export interface ClubRegistrationUpdateRequest {
  additional_data?: Record<string, any>;
}

export interface ClubRegistrationStatus {
  isRegistered: boolean;
  registration: ClubRegistration | null;
}
