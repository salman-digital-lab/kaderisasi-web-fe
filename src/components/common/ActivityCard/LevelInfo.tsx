"use client";

import { ActionIcon, Tooltip } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import type { ReactElement } from "react";
import { USER_LEVEL_RENDER } from "@/constants/render/activity";
import { USER_LEVEL_ENUM } from "@/types/constants/profile";

const LEVEL_DESCRIPTIONS: Record<USER_LEVEL_ENUM, string> = {
  [USER_LEVEL_ENUM.JAMAAH]:
    "Jamaah adalah jenjang awal sebelum riwayat SSC, LMD, atau SPECTRA tercatat. Kegiatan ini terbuka untuk semua jenjang, sesuai persyaratan lainnya.",
  [USER_LEVEL_ENUM.AKTIVIS]:
    "Aktivis adalah jenjang dengan riwayat Salman Spiritual Camp (SSC) yang tercatat. Kegiatan ini dapat diikuti Aktivis, Kader, dan Kader Lanjut, sesuai persyaratan lainnya.",
  [USER_LEVEL_ENUM.KADER]:
    "Kader adalah jenjang dengan riwayat Latihan Mujtahid Dakwah (LMD) yang tercatat. Kegiatan ini dapat diikuti Kader dan Kader Lanjut, sesuai persyaratan lainnya.",
  [USER_LEVEL_ENUM.KADER_LANJUT]:
    "Kader Lanjut adalah jenjang dengan riwayat SPECTRA yang tercatat. Kegiatan ini ditujukan untuk Kader Lanjut, sesuai persyaratan lainnya.",
};

export default function LevelInfo({
  level,
}: {
  level: USER_LEVEL_ENUM;
}): ReactElement {
  return (
    <Tooltip
      label={LEVEL_DESCRIPTIONS[level]}
      multiline
      w={280}
      maw="calc(100vw - 32px)"
      withArrow
      closeDelay={150}
      style={{ pointerEvents: "auto" }}
      events={{ hover: true, focus: true, touch: true }}
    >
      <ActionIcon
        variant="subtle"
        color="blue"
        size={32}
        aria-label={`Tentang jenjang ${USER_LEVEL_RENDER[level]}`}
      >
        <IconInfoCircle size={18} aria-hidden />
      </ActionIcon>
    </Tooltip>
  );
}
