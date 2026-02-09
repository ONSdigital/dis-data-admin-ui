import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "tests/component",
    testMatch: "tests/component/**/*.spec.js",
    use: {
        // Base URL to use in actions like `await page.goto("/")`.
        baseURL: "http://127.0.0.1:29400/data-admin/",

        // Collect trace when retrying the failed test.
        trace: "on-first-retry",
    },
    projects: [
        {
          name: "chromium",
          use: { ...devices["Desktop Chrome"] },
        },
      ],
    webServer: {
        command: "API_ROUTER_URL=http://127.0.0.1:29401 MIGRATION_SERVICE_URL=http://127.0.0.1:29401/v1 npm run dev",
        port: 29400,
        reuseExistingServer: !process.env.CI,
    },
});
