import "server-only";

import type { z } from "zod";
import { getApiConfig } from "@/config/apiConfig";
import fetcher, { FetcherError } from "@/functions/common/fetcher";
import {
  certificateDataSchema,
  certificateLifecycleSchema,
  publicCertificateDataSchema,
  certificateVerificationSchema,
  legacyCertificateDataSchema,
} from "@/features/certificate/schemas/certificate";
import { toPublicCertificateData } from "@/features/certificate/utils/certificateData";
import type { APIResponse } from "@/types/helper";
import type {
  CertificateData,
  CertificateLifecycleSummary,
  CertificateVerificationData,
  PublicCertificateData,
} from "@/types/model/certificate";

const JSON_HEADERS = { "Content-Type": "application/json" } as const;

function getCertificateApiUrl(): string {
  const { beApi } = getApiConfig();

  if (!beApi) {
    throw new FetcherError(
      "Certificate API is not configured",
      500,
      "API_NOT_CONFIGURED",
    );
  }

  return `${beApi}/certificates`;
}

function parseResponse<T>(schema: z.ZodType<T>, value: unknown): T {
  const parsed = schema.safeParse(value);

  if (!parsed.success) {
    throw new FetcherError(
      "Certificate API returned an invalid response",
      502,
      "INVALID_CERTIFICATE_RESPONSE",
    );
  }

  return parsed.data;
}

async function fetchCertificateData(
  path: string,
  init: RequestInit,
): Promise<unknown> {
  const response = await fetcher<APIResponse<unknown>>(
    `${getCertificateApiUrl()}${path}`,
    init,
  );

  return response.data;
}

export async function getCertificateByCode(
  certificateCode: string,
): Promise<PublicCertificateData> {
  const data = await fetchCertificateData(
    `/code/${encodeURIComponent(certificateCode)}`,
    {
      method: "GET",
      headers: JSON_HEADERS,
      cache: "no-store",
    },
  );

  return toPublicCertificateData(
    parseResponse(publicCertificateDataSchema, data),
  );
}

export async function getCertificateVerification(
  certificateCode: string,
): Promise<CertificateVerificationData> {
  const data = await fetchCertificateData(
    `/verify/${encodeURIComponent(certificateCode)}`,
    {
      method: "GET",
      headers: JSON_HEADERS,
      cache: "no-store",
    },
  );

  return parseResponse(certificateVerificationSchema, data);
}

async function getLegacyCertificateLifecycle(
  token: string,
  registrationId: number,
): Promise<CertificateLifecycleSummary> {
  try {
    const data = await fetchCertificateData(`/${registrationId}/download`, {
      method: "POST",
      headers: {
        ...JSON_HEADERS,
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    const legacyData = parseResponse(legacyCertificateDataSchema, data);

    if (!legacyData.certificate) {
      return {
        state: "eligible_not_issued",
        registration_id: registrationId,
        certificate_code: null,
        issued_at: null,
        revoked_at: null,
      };
    }

    return {
      state: legacyData.certificate.revoked_at
        ? "issued_revoked"
        : "issued_active",
      registration_id: registrationId,
      certificate_code: legacyData.certificate.certificate_code,
      issued_at: legacyData.certificate.issued_at,
      revoked_at: legacyData.certificate.revoked_at,
    };
  } catch (error) {
    if (error instanceof FetcherError && [400, 409].includes(error.status)) {
      return {
        state: error.status === 409 ? "eligible_not_issued" : "not_eligible",
        registration_id: registrationId,
        certificate_code: null,
        issued_at: null,
        revoked_at: null,
      };
    }
    throw error;
  }
}

export async function getCertificateLifecycle(
  token: string,
  registrationId: number,
): Promise<CertificateLifecycleSummary> {
  try {
    const data = await fetchCertificateData(
      `/registrations/${registrationId}`,
      {
        method: "GET",
        headers: {
          ...JSON_HEADERS,
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );

    return parseResponse(certificateLifecycleSchema, data);
  } catch (error) {
    // During rolling deployment, a missing preferred route falls back to the
    // existing authenticated owner endpoint. Public numeric generation is never used.
    if (error instanceof FetcherError && error.status === 404) {
      return getLegacyCertificateLifecycle(token, registrationId);
    }
    throw error;
  }
}

export async function getOwnedCertificateForDownload(
  token: string,
  certificateCode: string,
): Promise<CertificateData> {
  const data = await fetchCertificateData(
    `/code/${encodeURIComponent(certificateCode)}/download`,
    {
      method: "GET",
      headers: {
        ...JSON_HEADERS,
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  return parseResponse(certificateDataSchema, data);
}

/** Authenticated numeric compatibility endpoint; never call from a public page. */
export async function downloadCertificate(
  token: string,
  registrationId: number,
): Promise<CertificateData> {
  const data = await fetchCertificateData(`/${registrationId}/download`, {
    method: "POST",
    headers: {
      ...JSON_HEADERS,
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return parseResponse(certificateDataSchema, data);
}
