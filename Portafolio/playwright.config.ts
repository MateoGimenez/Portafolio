import { defineConfig } from "@playwright/test";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:4321/";

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "./test-results",
  timeout: 45_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  workers: 4,
  reporter: [["list"]],
  use: {
    baseURL: BASE_URL,
    // Usa el Google Chrome instalado: no hace falta `playwright install`.
    channel: "chrome",
    headless: true,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } },
  ],
  webServer: {
    command: "npm run build && npx astro preview --port 4321",
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
