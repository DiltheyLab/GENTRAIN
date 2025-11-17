import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.spec.ts",
    supportFile: "cypress/support/e2e.ts",
    video: true,
    screenshotOnRunFailure: true,
    env: {
      ADMIN_SUPERUSER_ROLE: "superuser",
      ADMIN_USER_ROLE: "user",
      ADMIN_SUPERUSER: "admin",
      ADMIN_PASSWORD: "secretPassword",
      ADMIN_PANEL_URL: "https://admin.localhost",
      APP_URL: "https://app.localhost",
      API_URL: "https://api.localhost",
      DOCS_URL: "https://docs.localhost",
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
