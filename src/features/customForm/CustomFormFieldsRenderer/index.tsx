"use client";

import { useState, type RefObject } from "react";
import {
  Button,
  Stack,
  TextInput,
  Select,
  MultiSelect,
  Textarea,
  NumberInput,
  Checkbox,
  Radio,
  Group,
  Title,
  Text,
  Box,
  Modal,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconAlertCircle } from "@tabler/icons-react";
import { CustomFormSection } from "@/types/api/customForm";
import { validateCustomFormFields } from "./validation";
import classes from "./index.module.css";

// Helper function to render text with newlines
const renderTextWithNewlines = (text: string) => {
  if (!text) return text;
  const lines = text.split("\n");
  if (lines.length === 1) return text;

  return (
    <>
      {lines.map((line, index) => (
        <span key={index}>
          {line}
          {index < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  );
};

type CustomFormFieldsRendererProps = {
  section: CustomFormSection;
  formData: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  loading?: boolean;
  isLastSection: boolean;
  formRef?: RefObject<HTMLFormElement | null>;
};

export default function CustomFormFieldsRenderer({
  section,
  formData,
  onSubmit,
  loading,
  isLastSection,
  formRef,
}: CustomFormFieldsRendererProps) {
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<Record<
    string,
    any
  > | null>(null);

  // Build initial values - combine all sections data
  const initialValues: Record<string, any> = { ...formData };

  section.fields.forEach((field) => {
    if (initialValues[field.key] === undefined) {
      if (field.type === "checkbox") {
        // If checkbox has options, treat it as an array (multiple selection)
        // Otherwise, treat it as a boolean (single checkbox)
        initialValues[field.key] =
          (field.options?.length ?? 0) > 0
            ? (field.defaultValue ?? [])
            : (field.defaultValue ?? false);
      } else if (field.type === "multiselect") {
        initialValues[field.key] = field.defaultValue ?? [];
      } else {
        initialValues[field.key] = field.defaultValue ?? "";
      }
    }
  });

  const form = useForm({
    mode: "uncontrolled",
    initialValues,
    validate: (values) => {
      return validateCustomFormFields(section.fields, values);
    },
  });

  const renderField = (field: any) => {
    if (field.hidden) return null;

    const fieldKey = form.key(field.key);
    const commonProps = {
      label: renderTextWithNewlines(field.label),
      description: renderTextWithNewlines(field.helpText || field.description),
      required: field.required,
      disabled: field.disabled,
      size: "md" as const,
      ...form.getInputProps(field.key, {
        type:
          field.type === "checkbox" && !field.options?.length
            ? "checkbox"
            : "input",
      }),
    };

    switch (field.type) {
      case "text":
        return (
          <TextInput
            key={fieldKey}
            {...commonProps}
            type={field.type}
            placeholder="Isi di sini"
          />
        );

      case "textarea":
        return (
          <Textarea
            key={fieldKey}
            {...commonProps}
            placeholder="Isi di sini"
            minRows={3}
            autosize
          />
        );

      case "number":
        return (
          <NumberInput
            key={fieldKey}
            {...commonProps}
            placeholder="Isi di sini"
            min={field.validation?.min}
            max={field.validation?.max}
          />
        );

      case "select":
      case "dropdown":
        return (
          <Select
            key={fieldKey}
            {...commonProps}
            placeholder="Pilih opsi"
            data={
              field.options?.map((opt: any) => ({
                label: opt.label,
                value: opt.value?.toString() || opt.label,
                disabled: opt.disabled,
              })) || []
            }
            searchable
          />
        );

      case "multiselect":
        return (
          <MultiSelect
            key={fieldKey}
            {...commonProps}
            placeholder="Pilih opsi"
            data={
              field.options?.map((opt: any) => ({
                label: opt.label,
                value: opt.value?.toString() || opt.label,
                disabled: opt.disabled,
              })) || []
            }
            searchable={false}
            hidePickedOptions={false}
            clearable={false}
            classNames={{
              label: classes.multiSelectLabel,
              description: classes.multiSelectDescription,
              input: classes.multiSelectInput,
              pill: classes.multiSelectPill,
              pillsList: classes.multiSelectPillsList,
              dropdown: classes.multiSelectDropdown,
              options: classes.multiSelectOptions,
              option: classes.multiSelectOption,
              inputField:
                Array.isArray(form.values[field.key]) &&
                form.values[field.key].length > 0
                  ? classes.multiSelectInputHidden
                  : undefined,
            }}
          />
        );

      case "radio":
        return (
          <Radio.Group key={fieldKey} {...commonProps}>
            <Stack gap="xs" mt="xs">
              {field.options?.map((opt: any, idx: number) => (
                <Radio.Card
                  key={idx}
                  value={opt.value?.toString() || opt.label}
                  disabled={opt.disabled}
                  radius="md"
                  className={classes.optionCard}
                >
                  <Group wrap="nowrap" align="flex-start">
                    <Radio.Indicator />
                    <Text className={classes.optionCardLabel}>{opt.label}</Text>
                  </Group>
                </Radio.Card>
              ))}
            </Stack>
          </Radio.Group>
        );

      case "checkbox":
        if (field.options?.length > 0) {
          return (
            <Checkbox.Group key={fieldKey} {...commonProps}>
              <Stack gap="xs" mt="xs">
                {field.options?.map((opt: any, idx: number) => (
                  <Checkbox.Card
                    key={idx}
                    value={opt.value?.toString() || opt.label}
                    disabled={opt.disabled}
                    radius="md"
                    className={classes.optionCard}
                  >
                    <Group wrap="nowrap" align="flex-start">
                      <Checkbox.Indicator />
                      <Text className={classes.optionCardLabel}>
                        {opt.label}
                      </Text>
                    </Group>
                  </Checkbox.Card>
                ))}
              </Stack>
            </Checkbox.Group>
          );
        }
        return (
          <Checkbox
            key={fieldKey}
            {...commonProps}
            label={renderTextWithNewlines(field.label)}
            description={renderTextWithNewlines(
              field.helpText || field.description,
            )}
          />
        );

      case "date":
        return (
          <DateInput
            key={fieldKey}
            {...commonProps}
            placeholder="Isi di sini"
            valueFormat="DD/MM/YYYY"
          />
        );

      default:
        return (
          <TextInput
            key={fieldKey}
            {...commonProps}
            placeholder="Isi di sini"
          />
        );
    }
  };

  const handleSubmit = (values: Record<string, any>) => {
    // If it's the last section, show confirmation modal
    if (isLastSection) {
      setPendingValues(values);
      setConfirmModalOpen(true);
    } else {
      // If not the last section, just proceed
      onSubmit(values);
    }
  };

  const handleConfirmSubmit = () => {
    if (pendingValues) {
      setConfirmModalOpen(false);
      onSubmit(pendingValues);
      setPendingValues(null);
    }
  };

  const handleCancelSubmit = () => {
    setConfirmModalOpen(false);
    setPendingValues(null);
  };

  return (
    <>
      <form ref={formRef} onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="xl">
          <Box>
            <Title order={4}>{section.section_name}</Title>
            {section.fields.length > 0 && (
              <Text size="md" c="dimmed" mt="xs">
                Silakan lengkapi formulir di bawah ini
              </Text>
            )}
          </Box>

          {section.fields.map((field) => (
            <div key={field.key}>{renderField(field)}</div>
          ))}
        </Stack>
      </form>

      {/* Confirmation Modal */}
      <Modal
        opened={confirmModalOpen}
        onClose={handleCancelSubmit}
        title={
          <Group gap="xs">
            <IconAlertCircle size={24} color="var(--mantine-color-blue-6)" />
            <Text size="md" fw={600}>
              Konfirmasi Pengiriman
            </Text>
          </Group>
        }
        centered
        size="md"
      >
        <Stack gap="lg">
          <Text size="md">
            Pastikan semua data yang Anda isi sudah benar. Setelah mengirim,
            data tidak dapat diubah kembali.
          </Text>
          <Text size="md" fw={500}>
            Apakah Anda yakin ingin mengirim formulir ini?
          </Text>

          <Group justify="flex-end" gap="sm">
            <Button
              variant="default"
              onClick={handleCancelSubmit}
              disabled={loading}
            >
              Batal
            </Button>
            <Button onClick={handleConfirmSubmit} loading={loading}>
              Ya, Kirim
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
