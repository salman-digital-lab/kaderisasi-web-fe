export type CertificateElement = {
  id: string;
  type: "static-text" | "variable-text" | "image" | "qr-code" | "signature";
  name?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  variable?: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  textAlign?: "left" | "center" | "right";
  verticalAlign?: "top" | "middle" | "bottom";
  fontWeight?: "normal" | "bold";
  fontStyle?: "normal" | "italic";
  textDecoration?: "none" | "underline";
  lineHeight?: number;
  letterSpacing?: number;
  imageUrl?: string;
  opacity?: number;
  rotation?: number;
  borderRadius?: number;
  objectFit?: "contain" | "cover" | "fill";
  visible?: boolean;
  locked?: boolean;
};

export type CertificateTemplateData = {
  backgroundUrl: string | null;
  elements: CertificateElement[];
  canvasWidth: number;
  canvasHeight: number;
};

export type CertificateRecord = {
  certificate_code: string;
  issued_at: string;
  revoked_at: string | null;
  revoked_reason: string | null;
  id?: number;
  registration_id?: number;
  activity_id?: number;
  template_id?: number;
};

/**
 * Backend render DTO. The optional fields are only present in authenticated owner
 * responses; public pages must convert this value to PublicCertificateData first.
 */
export type CertificateData = {
  activity: {
    name: string;
    activity_start: string | null;
    id?: number;
  };
  template: {
    name: string;
    background_image: string | null;
    template_data: CertificateTemplateData;
    id?: number;
  };
  participant: {
    name: string;
    activity_name: string;
    activity_date: string;
    university?: string | null;
    gender?: string | null;
    email?: string | null;
    registration_id?: number;
    user_id?: number | null;
  };
  certificate: CertificateRecord;
};

/** Safe DTO permitted to cross the public React Server Component boundary. */
export type PublicCertificateData = {
  state: "issued_active" | "issued_revoked";
  activity: Pick<CertificateData["activity"], "name" | "activity_start">;
  template: Pick<
    CertificateData["template"],
    "name" | "background_image" | "template_data"
  >;
  participant: Pick<
    CertificateData["participant"],
    "name" | "activity_name" | "activity_date" | "university" | "gender"
  >;
  certificate: Pick<
    CertificateRecord,
    "certificate_code" | "issued_at" | "revoked_at" | "revoked_reason"
  >;
};

export type CertificateLifecycleState =
  "not_eligible" | "eligible_not_issued" | "issued_active" | "issued_revoked";

export type CertificateLifecycleSummary = {
  state: CertificateLifecycleState;
  registration_id: number;
  certificate_code: string | null;
  issued_at: string | null;
  revoked_at: string | null;
};

export type CertificateVerificationState =
  "issued_active" | "issued_revoked" | "not_found";

export type CertificateVerificationData = {
  valid: boolean;
  state: CertificateVerificationState;
  certificate_code: string;
  participant_name: string | null;
  activity_name: string | null;
  activity_date: string | null;
  issued_at: string | null;
  revoked_at: string | null;
  revoked_reason: string | null;
};
