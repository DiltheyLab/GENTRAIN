import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.spec.ts",
    supportFile: "cypress/support/e2e.ts",

    //artifacts
    video: true,
    screenshotOnRunFailure: true,

    env: {
      SUPERUSER_ROLE: "superuser",
      USER_ROLE: "user",
      ADMIN_SUPERUSER: "admin",
      ADMIN_PASSWORD: "SecretPassword123!",
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
