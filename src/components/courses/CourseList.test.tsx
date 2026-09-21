import { MantineProvider } from "@mantine/core";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";
import { getToken } from "@/functions/auth/getToken";
import { readCourseData } from "@/services/course";
import CourseList from "./CourseList";

vi.mock("@/functions/auth/getToken", () => ({ getToken: vi.fn() }));
vi.mock("@/services/course", () => ({ readCourseData: vi.fn() }));

it("does not fetch protected courses for guests and preserves the login return path", async () => {
  vi.mocked(getToken).mockResolvedValue(null);
  const ui = await CourseList({
    searchParams: Promise.resolve({ search: "video", page: "2" }),
  });
  const html = renderToStaticMarkup(<MantineProvider>{ui}</MantineProvider>);
  expect(readCourseData).not.toHaveBeenCalled();
  expect(html).toContain("untuk melihat daftar kelas");
  expect(html).toContain(
    'href="/login?redirect=%2Fkelas%3Fsearch%3Dvideo%26page%3D2"',
  );
  expect(html).not.toContain('role="search"');
});
