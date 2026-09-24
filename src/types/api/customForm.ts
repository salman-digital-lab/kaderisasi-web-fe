import type { SectionNavigation } from "@/features/customForm/form-routing";

export interface CustomFormField {
  file?: {
    accept: "pdf" | "image" | "pdf_or_image";
    maxFiles: number;
    maxSizeMB: number;
  };
  key: string;
  label: string;
  required: boolean;
  type: string;
  placeholder?: string;
  helpText?: string;
  description?: string;
  options?: CustomFormOption[];
  validation?: CustomFormValidation;
  defaultValue?: any;
  hidden?: boolean;
  disabled?: boolean;
}

export interface CustomFormOption {
  label: string;
  value?: string | number | boolean;
  disabled?: boolean;
}

export interface CustomFormValidation {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  customMessage?: string;
}

export interface CustomFormSection {
  id?: string;
  section_name: string;
  description?: string;
  navigation?: SectionNavigation;
  fields: CustomFormField[];
}

export interface CustomFormSchema {
  settings?: { accessMode: "public" | "members" };
  version?: number;
  fields: CustomFormSection[];
}

export interface CustomForm {
  schema_hash: string;
  id: number;
  form_name: string;
  form_description: string;
  post_submission_info?: string;
  feature_type:
    "activity_registration" | "club_registration" | "independent_form";
  feature_id: number | null;
  form_schema: CustomFormSchema;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// API Request/Response types
export interface GetCustomFormByFeatureReq {
  feature_type:
    "activity_registration" | "club_registration" | "independent_form";
  feature_id?: number;
}

export interface GetCustomFormByFeatureResp {
  message: string;
  data: CustomForm;
}

export interface PostCustomFormRegistrationReq {
  session_token?: string;
  feature_type:
    "activity_registration" | "club_registration" | "independent_form";
  feature_id?: number;
  custom_form_data: Record<string, any>;
}

export interface PostCustomFormRegistrationResp {
  message: string;
  data: any;
}

export interface CustomFormSuccessInfo {
  id: number;
  post_submission_info?: string | null;
}
