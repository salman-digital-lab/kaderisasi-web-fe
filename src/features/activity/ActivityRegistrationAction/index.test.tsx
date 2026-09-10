import { MantineProvider } from "@mantine/core";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { verifySession } from "@/functions/server/session";
import { FetcherError } from "@/functions/common/fetcher";
import { getActivityRegistration } from "@/services/activity";
import { getProfile } from "@/services/profile";
import type { Activity } from "@/types/model/activity";
import { ActivityRegistrationAction } from "./index";
import ActivityRegistrationStatus from "../ActivityRegistrationStatus";
import { formatActivityDate, formatActivityDateRange } from "../activity-dates";

vi.mock("@/functions/server/session", () => ({ verifySession: vi.fn() }));
vi.mock("@/services/activity", () => ({ getActivityRegistration: vi.fn() }));
vi.mock("@/services/profile", () => ({ getProfile: vi.fn() }));

const activity: Activity = {
  id: 1,
  slug: "kegiatan-uji",
  name: "Kegiatan uji",
  description: "",
  activity_start: "2026-09-13",
  activity_end: "2026-09-13",
  registration_start: "2026-09-01",
  registration_end: "2026-09-12",
  selection_start: "",
  selection_end: "",
  minimum_level: 0,
  activity_type: 1,
  activity_category: 0,
  images: [],
  additional_config: {
    allow_guest_registration: true,
    certificate_template_id: 1,
  },
  is_registration_open: true,
  is_published: 1,
  created_at: "",
  updated_at: "",
};

function renderStatus(
  props: Parameters<typeof ActivityRegistrationStatus>[0],
): string {
  return renderToStaticMarkup(
    <MantineProvider>
      <ActivityRegistrationStatus {...props} />
    </MantineProvider>,
  );
}

describe("Activity detail registration", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("does not request protected data for visitors, and preserves the guest join flow", async () => {
    vi.mocked(verifySession).mockResolvedValue({
      session: undefined,
      name: undefined,
      profilePicture: undefined,
    });
    const ui = await ActivityRegistrationAction({ activity });
    const html = renderToStaticMarkup(<MantineProvider>{ui}</MantineProvider>);
    expect(getProfile).not.toHaveBeenCalled();
    expect(getActivityRegistration).not.toHaveBeenCalled();
    expect(html).toContain('href="/activity/kegiatan-uji/join"');
    expect(html).toContain("lanjut tanpa akun");
  });

  it("offers a login return path for closed activities without a registration link", () => {
    const html = renderStatus({
      activity: { ...activity, is_registration_open: false },
    });
    expect(html).toContain("/login?redirect=%2Factivity%2Fkegiatan-uji");
    expect(html).not.toContain("/join");
  });

  it("does not offer guest registration when that option is disabled", () => {
    const html = renderStatus({
      activity: { ...activity, additional_config: {} },
    });
    expect(html).toContain("Masuk atau buat akun");
    expect(html).not.toContain("tanpa akun");
  });

  it("explains an insufficient level and does not link to the form", () => {
    const html = renderStatus({
      activity: { ...activity, minimum_level: 6 },
      participant: { level: 0, registration: { status: "BELUM TERDAFTAR" } },
    });
    expect(html).toContain("Kader atau lebih tinggi");
    expect(html).toContain("Jenjang Anda saat ini: Jamaah");
    expect(html).not.toContain("/custom-form/");
  });

  it("offers the form only to eligible unregistered participants while open", () => {
    const participant = {
      level: 6 as const,
      registration: { status: "BELUM TERDAFTAR" },
    };
    expect(renderStatus({ activity, participant })).toContain(
      'href="/custom-form/activity/1"',
    );
    const closed = renderStatus({
      activity: { ...activity, is_registration_open: false },
      participant,
    });
    expect(closed).not.toContain("/custom-form/");
    expect(closed).toContain("Anda belum terdaftar");
  });

  it("retains participant status and issued certificates after registration closes", () => {
    const html = renderStatus({
      activity: { ...activity, is_registration_open: false, minimum_level: 6 },
      participant: {
        level: 0,
        registration: {
          status: "LULUS KEGIATAN",
          certificate_state: "issued_active",
          certificate_code: "CERT-1",
          registration_id: 9,
        },
      },
    });
    expect(html).toContain("LULUS KEGIATAN");
    expect(html).toContain('href="/certificate/CERT-1"');
    expect(html).not.toContain("Persyaratan jenjang");
  });

  it("renders pending announcements in Jakarta time without inviting duplicate registration", () => {
    const html = renderStatus({
      activity,
      participant: {
        level: 0,
        registration: {
          status: "BELUM DIUMUMKAN",
          visible_at: "2026-09-13T03:00:00Z",
        },
      },
    });
    expect(html).toContain("13 September 2026");
    expect(html).toContain("10.00 WIB");
    expect(html).not.toContain("/custom-form/");
  });

  it.each([401, 500])(
    "provides recovery on protected data error %i instead of allowing another registration",
    async (status) => {
      vi.mocked(verifySession).mockResolvedValue({
        session: "test-only",
        name: undefined,
        profilePicture: undefined,
      });
      vi.mocked(getProfile).mockRejectedValue(
        new FetcherError("Test failure", status),
      );
      vi.mocked(getActivityRegistration).mockResolvedValue({
        status: "BELUM TERDAFTAR",
      });
      const ui = await ActivityRegistrationAction({ activity });
      const html = renderToStaticMarkup(
        <MantineProvider>{ui}</MantineProvider>,
      );
      expect(html).toContain(
        status === 401 ? "Masuk kembali" : "Muat ulang status",
      );
      expect(html).not.toContain("/custom-form/");
    },
  );
});

describe("Activity date display", () => {
  it("avoids invalid dates and redundant one-day ranges", () => {
    expect(formatActivityDate(null)).toBe("Belum ditentukan");
    expect(formatActivityDate("invalid")).toBe("Belum ditentukan");
    expect(formatActivityDateRange(undefined, undefined)).toBe(
      "Jadwal belum ditentukan",
    );
    expect(formatActivityDateRange("2026-09-13", "2026-09-13")).toBe(
      "13 September 2026",
    );
    expect(formatActivityDateRange("2026-09-13", "2026-09-14")).toBe(
      "13 September 2026 – 14 September 2026",
    );
  });
});
