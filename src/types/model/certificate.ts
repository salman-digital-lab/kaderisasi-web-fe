export type CertificateElement = {
  id: string;
  type: "static-text" | "variable-text" | "image" | "qr-code" | "signature";
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
  imageUrl?: string;
};

export type CertificateTemplateData = {
  backgroundUrl: string | null;
  elements: CertificateElement[];
  canvasWidth: number;
  canvasHeight: number;
};

export type CertificateData = {
  activity: {
    id: number;
    name: string;
    activity_start: string;
  };
  template: {
    id: number;
    name: string;
    background_image: string | null;
    template_data: CertificateTemplateData;
  };
  participant: {
    registration_id: number;
    user_id: number;
    name: string;
    email: string;
    university: string;
    activity_name: string;
    activity_date: string;
  };
};
