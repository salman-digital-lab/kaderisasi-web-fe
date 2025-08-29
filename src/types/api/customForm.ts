export interface CustomFormField {
  key: string
  label: string
  required: boolean
  type: string
  placeholder?: string
  helpText?: string
  description?: string
  options?: CustomFormOption[]
  validation?: CustomFormValidation
  defaultValue?: any
  hidden?: boolean
  disabled?: boolean
}

export interface CustomFormOption {
  label: string
  value?: string | number | boolean
  disabled?: boolean
}

export interface CustomFormValidation {
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
  pattern?: string
  customMessage?: string
}

export interface CustomFormSection {
  section_name: string
  fields: CustomFormField[]
}

export interface CustomFormSchema {
  fields: CustomFormSection[]
}

export interface CustomForm {
  id: number
  form_name: string
  form_description: string
  feature_type: 'activity_registration' | 'club_registration'
  feature_id: number
  form_schema: CustomFormSchema
  is_active: boolean
  created_at: string
  updated_at: string
}

// API Request/Response types
export interface GetCustomFormByFeatureReq {
  feature_type: 'activity_registration' | 'club_registration'
  feature_id: number
}

export interface GetCustomFormByFeatureResp {
  message: string
  data: CustomForm
}

export interface PostCustomFormRegistrationReq {
  feature_type: 'activity_registration' | 'club_registration'
  feature_id: number
  profile_data: Record<string, any>
  custom_form_data: Record<string, any>
}

export interface PostCustomFormRegistrationResp {
  message: string
  data: any
}
