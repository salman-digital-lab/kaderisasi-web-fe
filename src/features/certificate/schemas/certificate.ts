import { z } from "zod";
import type {
  CertificateData,
  CertificateLifecycleSummary,
  CertificateVerificationData,
} from "@/types/model/certificate";

const nullableTextSchema = z.string().nullable();
const optionalPositiveIdSchema = z.number().int().positive().optional();

export const certificateCodeInputSchema = z
  .string()
  .trim()
  .min(1, "Masukkan kode sertifikat.")
  .max(96, "Kode sertifikat terlalu panjang.")
  .regex(
    /^[A-Za-z0-9-]+$/,
    "Kode hanya dapat berisi huruf, angka, atau tanda hubung.",
  )
  .transform((value) => value.toUpperCase());

export const certificateElementSchema = z.object({
  id: z.string().min(1),
  type: z.enum([
    "static-text",
    "variable-text",
    "image",
    "qr-code",
    "signature",
  ]),
  name: z.string().optional(),
  x: z.number().finite(),
  y: z.number().finite(),
  width: z.number().positive().finite(),
  height: z.number().positive().finite(),
  content: z.string().optional(),
  variable: z.string().optional(),
  fontSize: z.number().positive().finite().optional(),
  fontFamily: z.string().optional(),
  color: z.string().optional(),
  textAlign: z.enum(["left", "center", "right"]).optional(),
  verticalAlign: z.enum(["top", "middle", "bottom"]).optional(),
  fontWeight: z.enum(["normal", "bold"]).optional(),
  fontStyle: z.enum(["normal", "italic"]).optional(),
  textDecoration: z.enum(["none", "underline"]).optional(),
  lineHeight: z.number().positive().finite().optional(),
  letterSpacing: z.number().finite().optional(),
  imageUrl: z.string().optional(),
  opacity: z.number().min(0).max(100).optional(),
  rotation: z.number().finite().optional(),
  borderRadius: z.number().min(0).finite().optional(),
  objectFit: z.enum(["contain", "cover", "fill"]).optional(),
  visible: z.boolean().optional(),
  locked: z.boolean().optional(),
});

export const certificateTemplateDataSchema = z.object({
  backgroundUrl: nullableTextSchema,
  elements: z.array(certificateElementSchema).max(500),
  canvasWidth: z.number().positive().finite().max(10000),
  canvasHeight: z.number().positive().finite().max(10000),
});

const certificateCodeSchema = z
  .string()
  .trim()
  .min(1)
  .max(96)
  .regex(/^[A-Z0-9-]+$/);

const certificateRecordSchema = z.object({
  id: optionalPositiveIdSchema,
  certificate_code: certificateCodeSchema,
  registration_id: optionalPositiveIdSchema,
  activity_id: optionalPositiveIdSchema,
  template_id: optionalPositiveIdSchema,
  issued_at: z.string().min(1),
  revoked_at: nullableTextSchema,
  revoked_reason: nullableTextSchema,
});

const certificateRenderBaseSchema = z.object({
  activity: z.object({
    id: optionalPositiveIdSchema,
    name: z.string().min(1),
    activity_start: nullableTextSchema,
  }),
  template: z.object({
    id: optionalPositiveIdSchema,
    name: z.string().min(1),
    background_image: nullableTextSchema,
    template_data: certificateTemplateDataSchema,
  }),
  participant: z.object({
    registration_id: optionalPositiveIdSchema,
    user_id: z.number().int().positive().nullable().optional(),
    name: z.string().min(1),
    email: z.string().nullish(),
    university: z.string().nullish(),
    gender: z.string().nullish(),
    activity_name: z.string().min(1),
    activity_date: z.string().min(1),
  }),
  certificate: certificateRecordSchema,
});

export const certificateDataSchema: z.ZodType<CertificateData> =
  certificateRenderBaseSchema;

export const publicCertificateDataSchema = certificateRenderBaseSchema
  .extend({
    state: z.enum(["issued_active", "issued_revoked"]),
    activity: certificateRenderBaseSchema.shape.activity.extend({
      activity_date: z.string().min(1),
    }),
  })
  .superRefine((value, context) => {
    const isRevoked = Boolean(value.certificate.revoked_at);
    if ((value.state === "issued_revoked") !== isRevoked) {
      context.addIssue({
        code: "custom",
        message: "Public certificate state does not match revocation data",
        path: ["state"],
      });
    }
  });

export const legacyCertificateDataSchema = certificateRenderBaseSchema.extend({
  certificate: certificateRecordSchema.optional(),
});

export const certificateLifecycleSchema: z.ZodType<CertificateLifecycleSummary> =
  z
    .object({
      state: z.enum([
        "not_eligible",
        "eligible_not_issued",
        "issued_active",
        "issued_revoked",
      ]),
      registration_id: z.number().int().positive(),
      certificate_code: certificateCodeSchema.nullable(),
      issued_at: nullableTextSchema,
      revoked_at: nullableTextSchema,
    })
    .superRefine((value, context) => {
      const isIssued =
        value.state === "issued_active" || value.state === "issued_revoked";
      if (isIssued && (!value.certificate_code || !value.issued_at)) {
        context.addIssue({
          code: "custom",
          message: "Issued certificates require a code and issue date",
          path: ["certificate_code"],
        });
      }
      if (!isIssued && (value.certificate_code || value.issued_at)) {
        context.addIssue({
          code: "custom",
          message: "Unissued certificates cannot have issuance data",
          path: ["certificate_code"],
        });
      }
      if (value.state === "issued_revoked" && !value.revoked_at) {
        context.addIssue({
          code: "custom",
          message: "Revoked certificates require a revocation date",
          path: ["revoked_at"],
        });
      }
      if (value.state !== "issued_revoked" && value.revoked_at) {
        context.addIssue({
          code: "custom",
          message: "Only revoked certificates can have a revocation date",
          path: ["revoked_at"],
        });
      }
    });

export const certificateVerificationSchema: z.ZodType<CertificateVerificationData> =
  z
    .object({
      valid: z.boolean(),
      state: z.enum(["issued_active", "issued_revoked", "not_found"]),
      certificate_code: certificateCodeSchema,
      participant_name: nullableTextSchema,
      activity_name: nullableTextSchema,
      activity_date: nullableTextSchema,
      issued_at: nullableTextSchema,
      revoked_at: nullableTextSchema,
      revoked_reason: nullableTextSchema,
    })
    .superRefine((value, context) => {
      if ((value.state === "issued_active") !== value.valid) {
        context.addIssue({
          code: "custom",
          message: "Verification validity does not match certificate state",
          path: ["valid"],
        });
      }
      if (value.state === "issued_revoked" && !value.revoked_at) {
        context.addIssue({
          code: "custom",
          message: "Revoked verification results require a revocation date",
          path: ["revoked_at"],
        });
      }
    });
