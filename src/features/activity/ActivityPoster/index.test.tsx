import { MantineProvider } from "@mantine/core";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ActivityPoster from "./index";

function renderPoster(images: string[]): string {
  return renderToStaticMarkup(
    <MantineProvider>
      <ActivityPoster
        images={images}
        activityName="Kegiatan Salman"
        imageBaseUrl="https://nos.wjv-1.neo.id/kaderisasi-prod"
      />
    </MantineProvider>,
  );
}

describe("Activity poster presentation", () => {
  it("loads the main poster eagerly and labels the enlargement action", () => {
    const html = renderPoster(["poster-1.webp"]);
    expect(html).toContain('aria-label="Perbesar poster 1: Kegiatan Salman"');
    expect(html).toContain('alt="Poster 1: Kegiatan Salman"');
    expect(html).toContain('loading="eager"');
    expect(html).toContain('fetchPriority="high"');
    expect(html).not.toContain('aria-label="Pilih poster kegiatan"');
  });

  it("selects only the first thumbnail initially and leaves other images lazy", () => {
    const html = renderPoster([
      "poster-1.webp",
      "poster-2.webp",
      "poster-3.webp",
    ]);
    expect(html.match(/aria-pressed="true"/g)).toHaveLength(1);
    expect(html.match(/aria-pressed="false"/g)).toHaveLength(2);
    expect(html.match(/loading="lazy"/g)).toHaveLength(3);
    expect(html).toContain('aria-label="Tampilkan poster 3"');
    expect(html).toContain('aria-controls="active-activity-poster"');
  });

  it("omits the poster interface entirely if no images exist", () => {
    const html = renderPoster([]);
    expect(html).not.toContain("Perbesar poster");
    expect(html).not.toContain("active-activity-poster");
    expect(html).not.toContain("Pilih poster kegiatan");
  });
});
