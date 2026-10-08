import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  timeout: 180000,
  workers: 1,
  use: {
    baseURL: "http://localhost:3000",
    browserName: "chromium",
    headless: true,
  },
  reporter: "list",
});
