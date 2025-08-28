import { Club } from "./club";

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
}

export interface ClubRegistrationRequest {
  additional_data?: Record<string, any>;
}

export interface ClubRegistrationUpdateRequest {
  additional_data?: Record<string, any>;
}

export interface ClubRegistrationStatus {
  isRegistered: boolean;
  registration: ClubRegistration | null;
}
