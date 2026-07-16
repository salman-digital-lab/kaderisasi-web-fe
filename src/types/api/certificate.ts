import type { APIResponse } from "../helper";
import type {
  CertificateData,
  CertificateLifecycleSummary,
  CertificateVerificationData,
} from "../model/certificate";

export type CertificateRenderResponse = APIResponse<CertificateData>;
export type CertificateLifecycleResponse =
  APIResponse<CertificateLifecycleSummary>;
export type CertificateVerificationResponse =
  APIResponse<CertificateVerificationData>;

// Kept for callers outside the certificate feature during the API transition.
export type PostGenerateSingleCertificateResp = CertificateRenderResponse;
