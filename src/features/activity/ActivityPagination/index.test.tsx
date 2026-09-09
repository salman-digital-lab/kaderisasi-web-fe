import { MantineProvider } from "@mantine/core";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import ActivityPagination from "./index";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

describe("ActivityPagination", () => {
  it.each([1, 2, 3])(
    "selects the loaded page %i when the list mounts",
    (current) => {
      const html = renderToStaticMarkup(
        <MantineProvider>
          <ActivityPagination total={3} current={current} />
        </MantineProvider>,
      );
      const activeLinks = Array.from(
        html.matchAll(/<a\b[^>]*aria-current="page"[^>]*>/g),
        (match) => match[0].match(/href="([^"]+)"/)?.[1],
      );

      expect(activeLinks).toEqual([`/activity?page=${current}`]);
    },
  );
});
