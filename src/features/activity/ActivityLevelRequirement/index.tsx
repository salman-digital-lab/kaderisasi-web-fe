import type { ReactElement } from "react";
import { Alert } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { USER_LEVEL_RENDER } from "@/constants/render/activity";
import type { USER_LEVEL_ENUM } from "@/types/constants/profile";

export function meetsActivityLevel(
  level: USER_LEVEL_ENUM | undefined,
  minimumLevel: USER_LEVEL_ENUM,
): boolean {
  return level !== undefined && level >= minimumLevel;
}

export default function ActivityLevelRequirement({
  level,
  minimumLevel,
}: {
  level: USER_LEVEL_ENUM | undefined;
  minimumLevel: USER_LEVEL_ENUM;
}): ReactElement {
  return (
    <Alert
      color="blue"
      icon={<IconInfoCircle size={18} aria-hidden="true" />}
      title="Persyaratan jenjang"
    >
      Kegiatan ini memerlukan jenjang {USER_LEVEL_RENDER[minimumLevel]} atau
      lebih tinggi.
      {level !== undefined
        ? ` Jenjang Anda saat ini: ${USER_LEVEL_RENDER[level]}.`
        : " Jenjang profil Anda belum tersedia."}
    </Alert>
  );
}
