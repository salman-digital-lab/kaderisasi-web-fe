"use client";

import {
  Button,
  Stack,
  TextInput,
  Select,
  Textarea,
  NumberInput,
  Checkbox,
  Radio,
  Group,
  Title,
  Text,
  FileInput,
  Box,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { CustomFormSection } from "@/types/api/customForm";

type CustomFormFieldsRendererProps = {
  section: CustomFormSection;
  sections: CustomFormSection[];
  currentSectionIndex: number;
  formData: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  onBack: () => void;
  loading?: boolean;
  isLastSection: boolean;
};

export default function CustomFormFieldsRenderer({
  section,
  sections,
  currentSectionIndex,
  formData,
  onSubmit,
  onBack,
  loading,
  isLastSection,
}: CustomFormFieldsRendererProps) {
  // Build initial values - combine all sections data
  const initialValues: Record<string, any> = { ...formData };
  
  section.fields.forEach((field) => {
    if (initialValues[field.key] === undefined) {
      if (field.type === "checkbox") {
        initialValues[field.key] = field.defaultValue || false;
      } else if (field.type === "multiselect") {
        initialValues[field.key] = field.defaultValue || [];
      } else {
        initialValues[field.key] = field.defaultValue || "";
      }
    }
  });

  const form = useForm({
    mode: "uncontrolled",
    initialValues,
    validate: (values) => {
      const errors: Record<string, string> = {};
      
      section.fields.forEach((field) => {
        if (field.required && !values[field.key]) {
          errors[field.key] = `${field.label} wajib diisi`;
        }
        
        if (field.validation) {
          const val = values[field.key];
          
          if (val !== undefined && val !== null && val !== "") {
            if (field.validation.min !== undefined && Number(val) < field.validation.min) {
              errors[field.key] = field.validation.customMessage || 
                `Minimal ${field.validation.min}`;
            }
            
            if (field.validation.max !== undefined && Number(val) > field.validation.max) {
              errors[field.key] = field.validation.customMessage || 
                `Maksimal ${field.validation.max}`;
            }
            
            if (field.validation.minLength !== undefined && 
                typeof val === "string" && 
                val.length < field.validation.minLength) {
              errors[field.key] = field.validation.customMessage || 
                `Minimal ${field.validation.minLength} karakter`;
            }
            
            if (field.validation.maxLength !== undefined && 
                typeof val === "string" && 
                val.length > field.validation.maxLength) {
              errors[field.key] = field.validation.customMessage || 
                `Maksimal ${field.validation.maxLength} karakter`;
            }
            
            if (field.validation.pattern) {
              const regex = new RegExp(field.validation.pattern);
              if (typeof val === "string" && !regex.test(val)) {
                errors[field.key] = field.validation.customMessage || 
                  `Format ${field.label} tidak valid`;
              }
            }
          }
        }
      });
      
      return errors;
    },
  });

  const renderField = (field: any) => {
    if (field.hidden) return null;

    const commonProps = {
      label: field.label,
      placeholder: field.placeholder || field.label,
      description: field.helpText || field.description,
      required: field.required,
      disabled: field.disabled,
      ...form.getInputProps(field.key),
    };

    switch (field.type) {
      case "text":
      case "email":
      case "url":
      case "tel":
        return <TextInput {...commonProps} type={field.type} />;

      case "textarea":
        return <Textarea {...commonProps} minRows={3} autosize />;

      case "number":
        return (
          <NumberInput
            {...commonProps}
            min={field.validation?.min}
            max={field.validation?.max}
          />
        );

      case "select":
      case "dropdown":
        return (
          <Select
            {...commonProps}
            data={field.options?.map((opt: any) => ({
              label: opt.label,
              value: opt.value?.toString() || opt.label,
              disabled: opt.disabled,
            })) || []}
            searchable
          />
        );

      case "multiselect":
        return (
          <Select
            {...commonProps}
            data={field.options?.map((opt: any) => ({
              label: opt.label,
              value: opt.value?.toString() || opt.label,
              disabled: opt.disabled,
            })) || []}
            multiple
            searchable
          />
        );

      case "radio":
        return (
          <Radio.Group {...commonProps}>
            <Stack gap="xs" mt="xs">
              {field.options?.map((opt: any, idx: number) => (
                <Radio
                  key={idx}
                  value={opt.value?.toString() || opt.label}
                  label={opt.label}
                  disabled={opt.disabled}
                />
              ))}
            </Stack>
          </Radio.Group>
        );

      case "checkbox":
        return (
          <Checkbox
            {...commonProps}
            label={field.label}
            description={field.helpText || field.description}
          />
        );

      case "date":
        return (
          <DateInput
            {...commonProps}
            valueFormat="DD/MM/YYYY"
          />
        );

      case "file":
        return (
          <FileInput
            {...commonProps}
            accept={field.validation?.pattern}
          />
        );

      default:
        return <TextInput {...commonProps} />;
    }
  };

  const handleSubmit = (values: Record<string, any>) => {
    onSubmit(values);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <Box>
          <Title order={4}>{section.section_name}</Title>
          {section.fields.length > 0 && (
            <Text size="sm" c="dimmed" mt="xs">
              Silakan lengkapi formulir di bawah ini
            </Text>
          )}
        </Box>

        {section.fields.map((field) => (
          <div key={field.key}>{renderField(field)}</div>
        ))}

        <Group 
          justify="space-between" 
          mt="xl"
          style={{ 
            flexDirection: 'row',
            gap: '0.5rem'
          }}
        >
          <Button 
            variant="default" 
            onClick={onBack} 
            disabled={loading}
            style={{ flex: '0 1 auto', minWidth: '100px' }}
          >
            Kembali
          </Button>
          <Button 
            type="submit" 
            loading={loading}
            style={{ flex: '1 1 auto', minWidth: '120px' }}
          >
            {isLastSection ? "Kirim" : "Lanjutkan"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

