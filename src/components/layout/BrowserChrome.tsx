"use client";

import { useComputedColorScheme, useMantineTheme } from "@mantine/core";
import { useEffect } from "react";

/** Browser chrome follows the rendered surface, including saved Mantine preferences. */
export default function BrowserChrome({
  surface = "body",
}: {
  surface?: "body" | "subtle";
}): null {
  const scheme = useComputedColorScheme("light");
  const theme = useMantineTheme();
  const color =
    scheme === "dark"
      ? theme.colors.dark[7]
      : surface === "subtle"
        ? theme.colors.gray[0]
        : theme.white;

  useEffect(() => {
    function syncChrome(): void {
      for (const [name, content] of [
        ["theme-color", color],
        ["color-scheme", scheme],
      ] as const) {
        const tag = document.head.querySelector(`meta[name="${name}"]`);
        if (tag && tag.getAttribute("content") !== content) {
          tag.setAttribute("content", content);
        }
      }
    }

    // Next can replace viewport tags when a streamed route commits after this effect.
    const observer = new MutationObserver(syncChrome);
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["content"],
    });
    syncChrome();
    return () => observer.disconnect();
  }, [color, scheme]);

  return null;
}
