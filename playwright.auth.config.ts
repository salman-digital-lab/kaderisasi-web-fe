import { defineConfig } from "@playwright/test";
import config from "./playwright.config";

export default defineConfig({
  ...config,
  testDir: "./tests/auth",
  webServer: {
    ...config.webServer,
    command: "GOOGLE_AUTH_BROWSER_TEST=1 node scripts/instant-server.mjs",
    url: "http://localhost:3000",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
