import { MantineProvider } from "@mantine/core";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import ActivityPagination from "./index";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
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
      const activePages = Array.from(
        html.matchAll(/<button\b[^>]*aria-current="page"[^>]*>(.*?)<\/button>/g),
        (match) => match[1],
      );

      expect(activePages).toEqual([String(current)]);
    },
  );
});
