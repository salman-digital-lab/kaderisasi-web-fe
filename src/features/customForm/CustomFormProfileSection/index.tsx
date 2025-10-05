"use client";

import { Button, Stack, TextInput, Select, Group, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { CustomFormField } from "@/types/api/customForm";
import { Member, PublicUser } from "@/types/model/members";
import { Province } from "@/types/model/province";
import { GENDER_OPTION } from "@/constants/form/profile";
import UniversitySelect from "@/components/common/UniversitySelect";
import editProfile from "@/functions/server/editProfile";
import showNotif from "@/functions/common/notification";

type CustomFormProfileSectionProps = {
  profileFields: CustomFormField[];
  profileData?: {
    userData: PublicUser;
    profile: Member;
  };
  provinceData?: Province[];
  onSubmit: () => void;
  onBack?: () => void;
};

export default function CustomFormProfileSection({
  profileFields,
  profileData,
  provinceData,
  onSubmit,
  onBack,
}: CustomFormProfileSectionProps) {
  // Build initial values from profile data
  const initialValues: Record<string, any> = {};
  
  profileFields.forEach((field) => {
    const profile = profileData?.profile;
    const userData = profileData?.userData;
    
    switch (field.key) {
      case "name":
        initialValues[field.key] = profile?.name || "";
        break;
      case "gender":
        initialValues[field.key] = profile?.gender || "";
        break;
      case "email":
        initialValues[field.key] = userData?.email || "";
        break;
      case "personal_id":
        initialValues[field.key] = profile?.personal_id || "";
        break;
      case "province_id":
        initialValues[field.key] = profile?.province_id?.toString() || "";
        break;
      case "line":
        initialValues[field.key] = profile?.line || "";
        break;
      case "instagram":
        initialValues[field.key] = profile?.instagram || "";
        break;
      case "tiktok":
        initialValues[field.key] = profile?.tiktok || "";
        break;
      case "linkedin":
        initialValues[field.key] = profile?.linkedin || "";
        break;
      case "whatsapp":
        initialValues[field.key] = profile?.whatsapp || "";
        break;
      case "university_id":
        initialValues[field.key] = profile?.university_id?.toString() || "";
        break;
      case "major":
        initialValues[field.key] = profile?.major || "";
        break;
      case "intake_year":
        initialValues[field.key] = profile?.intake_year || "";
        break;
      default:
        initialValues[field.key] = field.defaultValue || "";
    }
  });

  const form = useForm({
    mode: "uncontrolled",
    initialValues,
    validate: (values) => {
      const errors: Record<string, string> = {};
      
      profileFields.forEach((field) => {
        if (field.required && !values[field.key]) {
          errors[field.key] = `${field.label} wajib diisi`;
        }
        
        if (field.validation) {
          const val = values[field.key];
          
          if (val && field.validation.minLength && val.length < field.validation.minLength) {
            errors[field.key] = field.validation.customMessage || 
              `Minimal ${field.validation.minLength} karakter`;
          }
          
          if (val && field.validation.maxLength && val.length > field.validation.maxLength) {
            errors[field.key] = field.validation.customMessage || 
              `Maksimal ${field.validation.maxLength} karakter`;
          }
          
          if (val && field.validation.pattern) {
            const regex = new RegExp(field.validation.pattern);
            if (!regex.test(val)) {
              errors[field.key] = field.validation.customMessage || 
                `Format ${field.label} tidak valid`;
            }
          }
        }
      });
      
      return errors;
    },
  });

  const renderField = (field: CustomFormField) => {
    const commonProps = {
      label: field.label,
      placeholder: field.placeholder || field.label,
      description: field.helpText,
      required: field.required,
      disabled: field.disabled,
      ...form.getInputProps(field.key),
    };

    switch (field.key) {
      case "name":
        return <TextInput {...commonProps} />;
      
      case "gender":
        return (
          <Select
            {...commonProps}
            data={GENDER_OPTION}
          />
        );
      
      case "email":
        return <TextInput {...commonProps} type="email" disabled />;
      
      case "personal_id":
        return <TextInput {...commonProps} />;
      
      case "province_id":
        return (
          <Select
            {...commonProps}
            data={provinceData?.map((province) => ({
              label: province.name,
              value: province.id.toString(),
            })) || []}
            searchable
          />
        );
      
      case "line":
        return <TextInput {...commonProps} />;
      
      case "instagram":
        return <TextInput {...commonProps} />;
      
      case "tiktok":
        return <TextInput {...commonProps} />;
      
      case "linkedin":
        return <TextInput {...commonProps} />;
      
      case "whatsapp":
        return (
          <TextInput
            {...commonProps}
            type="tel"
            pattern="[0-9]*"
            inputMode="numeric"
            onKeyDown={(e) => {
              if (
                !/[0-9]/.test(e.key) &&
                !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)
              ) {
                e.preventDefault();
              }
            }}
          />
        );
      
      case "university_id":
        return (
          <UniversitySelect
            {...commonProps}
            showedValue={profileData?.profile.university?.name}
          />
        );
      
      case "major":
        return <TextInput {...commonProps} />;
      
      case "intake_year":
        return <TextInput {...commonProps} />;
      
      default:
        return <TextInput {...commonProps} />;
    }
  };

  const handleSubmit = async (values: Record<string, any>) => {
    // Save profile data directly to profile table
    try {
      // Convert WhatsApp number format from 0812... to 62812...
      let whatsappNumber = values.whatsapp;
      if (whatsappNumber && typeof whatsappNumber === "string") {
        const whatsappStr = whatsappNumber.trim();
        if (whatsappStr.startsWith("0")) {
          whatsappNumber = "62" + whatsappStr.slice(1);
        }
      }

      const profileUpdateData: Record<string, any> = {};
      
      profileFields.forEach((field) => {
        if (values[field.key] !== undefined) {
          if (field.key === "province_id" || field.key === "university_id") {
            profileUpdateData[field.key] = values[field.key] ? Number(values[field.key]) : undefined;
          } else if (field.key === "whatsapp") {
            profileUpdateData[field.key] = whatsappNumber;
          } else if (field.key !== "email") { // Don't update email
            profileUpdateData[field.key] = values[field.key];
          }
        }
      });

      await editProfile(profileUpdateData);
      
      // Just continue to next step
      onSubmit();
    } catch (error) {
      if (error instanceof Error) showNotif(error.message, true);
      if (typeof error === "string") showNotif(error, true);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <Title order={4}>Data Diri</Title>
        
        {profileFields.filter(f => !f.hidden).map((field) => (
          <div key={field.key}>{renderField(field)}</div>
        ))}

        <Group 
          justify={onBack ? "space-between" : "flex-end"} 
          mt="xl"
          style={{ 
            flexDirection: 'row',
            gap: '0.5rem'
          }}
        >
          {onBack && (
            <Button 
              variant="default" 
              onClick={onBack}
              style={{ flex: '0 1 auto', minWidth: '100px' }}
            >
              Kembali
            </Button>
          )}
          <Button 
            type="submit"
            style={{ flex: '1 1 auto', minWidth: '120px' }}
          >
            Lanjutkan
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

