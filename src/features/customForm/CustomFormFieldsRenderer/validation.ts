import type { CustomFormField } from "@/types/api/customForm";

export function validateCustomFormFields(
  fields: CustomFormField[],
  values: Record<string, unknown>,
): Record<string, string> {
  const errors: Record<string, string> = {};

  fields.forEach((field) => {
    if (field.hidden || field.disabled) return;
    const value = values[field.key];
    const empty =
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "") ||
      (Array.isArray(value) && value.length === 0);
    if (
      field.required &&
      (empty || (field.type === "checkbox" && value === false))
    ) {
      errors[field.key] = `${field.label} wajib diisi`;
    }

    if (field.validation) {
      const val = values[field.key];

      if (!empty) {
        if (
          field.validation.min !== undefined &&
          Number(val) < field.validation.min
        ) {
          errors[field.key] =
            field.validation.customMessage || `Minimal ${field.validation.min}`;
        }

        if (
          field.validation.max !== undefined &&
          Number(val) > field.validation.max
        ) {
          errors[field.key] =
            field.validation.customMessage ||
            `Maksimal ${field.validation.max}`;
        }

        if (
          field.validation.minLength !== undefined &&
          typeof val === "string" &&
          val.length < field.validation.minLength
        ) {
          errors[field.key] =
            field.validation.customMessage ||
            `Minimal ${field.validation.minLength} karakter`;
        }

        if (
          field.validation.maxLength !== undefined &&
          typeof val === "string" &&
          val.length > field.validation.maxLength
        ) {
          errors[field.key] =
            field.validation.customMessage ||
            `Maksimal ${field.validation.maxLength} karakter`;
        }

        if (field.validation.pattern) {
          try {
            const regex = new RegExp(field.validation.pattern);
            if (typeof val === "string" && !regex.test(val)) {
              errors[field.key] =
                field.validation.customMessage ||
                `Format ${field.label} tidak valid`;
            }
          } catch {
            errors[field.key] =
              "Konfigurasi formulir tidak valid. Hubungi pengelola.";
          }
        }
      }
    }
  });

  return errors;
}
