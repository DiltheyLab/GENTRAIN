/**
 * Smoke Test - Quick End-to-End Validation
 * Tests all major workflows in rapid succession
 * Purpose: Catch major regressions in < 2 minutes
 *
 * Coverage Admin Panel:
 * 1. Login → Admin
 * 2. Navigate Users → Create → Delete
 * 3. Navigate Roles → View list
 * 4. Navigate Pathogens → Create
 * 5. Logout from Admin
 * 6. Auth boundary check → Non-superuser access and permissions
 *
 * Coverage Dashboard:
 * 1. Go to Dashboard
 * 2. Select Pathogen
 * 3. Navigate to Data Management
 * 4. Upload Case, Contact, Sequence Data
 * 5. Navigate to Dashboard
 * 6. Verify Sequence Analysis Graph Rendering
 *
 * Note: This test is designed to run quickly and catch critical issues.
 * It does not cover every edge case or detail, but ensures core functionality works.
 */

import * as helpers from "../../support/helpers";

describe("Smoke Test - Admin Panel (Critical Workflows)", () => {
  it("should execute all critical admin panel workflows without errors", () => {
    // 1. LOGIN
    cy.loginAs();

    // 2. ROLES WORKFLOW
    cy.navigateToResource("Role");
    cy.contains(Cypress.env("SUPERUSER_ROLE")).should("exist");

    // 3. USERS WORKFLOW
    cy.navigateToResource("User");
    helpers.assertRowInTable(Cypress.env("ADMIN_SUPERUSER"));

    // Create user
    const smokeUser = `smoke-user-${Date.now()}`;
    helpers.createUser(smokeUser, "SmokeUserPass123!", Cypress.env("USER_ROLE"));
    helpers.assertRowInTable(smokeUser);

    // Delete user
    helpers.clickShowRecord(smokeUser);
    helpers.deleteRecord("User");
    helpers.assertRowNotInTable(smokeUser);

    // 4. PATHOGENS WORKFLOW
    cy.navigateToResource("Pathogen");

    // Create pathogen
    cy.contains("Create new", { matchCase: false }).click();
    cy.get("form").should("be.visible");
    const smokePathogen = `smoke-pathogen-${Date.now()}`;
    cy.get('input[name="name"]').clear().type(smokePathogen);
    cy.get(".css-1o5aihk").click(); // Open select
    cy.contains("div", "Viral").click();
    cy.get('input[name="genetic_distance_threshold"]').clear().type("2");
    cy.contains("label", "Activated").click();

    // Upload files (scheme, example data)
    const schemePath = "/sars-cov-2_scheme.zip";
    cy.get('[data-testid="property-edit-scheme"]').find("input").attachFile(schemePath);
    const exampleCaseDataPath = "/sars-cov-2_falldaten.csv";
    cy.get('[data-testid="property-edit-example_cases_file"]').find("input").attachFile(exampleCaseDataPath);
    const exampleSequenceDataPath = "/sars-cov-2_sequenzdaten.fasta";
    cy.get('[data-testid="property-edit-example_sequences_file"]').find("input").attachFile({
      filePath: exampleSequenceDataPath,
      mimeType: "application/octet-stream",
    });
    const exampleContactsDataPath = "/sars-cov-2_kontaktdaten.csv";
    cy.get('[data-testid="property-edit-example_contacts_file"]').find("input").attachFile(exampleContactsDataPath);

    helpers.submitForm();
    cy.contains(smokePathogen, { timeout: 15000 }).should("exist");

    // 5. LOGOUT
    cy.logout();
    cy.url().should("include", "/login");
  });

  /**
   * Auth boundary check
   */
  it("should enforce authentication boundaries of admin panel", () => {
    // Unauthenticated access attempt
    cy.clearCookie("adminjs");
    cy.visit(`${Cypress.env("ADMIN_PANEL_URL")}/resources/User`);

    // Should redirect to login
    cy.url().should("include", "/login");

    // Login and verify access
    cy.loginAs();
    cy.navigateToResource("User");

    // Create user with non-superuser role
    const normalUsername = `user-${Date.now()}`;
    const normalPassword = "UserPass123!";
    cy.contains("Create new").click();
    cy.get("form").should("be.visible");

    cy.get('[data-testid="property-edit-username"]').type(normalUsername);
    cy.get('[data-testid="property-edit-password"]').type(normalPassword);
    cy.get('[data-testid="property-edit-role"]').click().should("contain", Cypress.env("USER_ROLE"));

    cy.contains(new RegExp(`^${Cypress.env("USER_ROLE")}$`)).click();
    helpers.submitForm();
    helpers.assertRowInTable(normalUsername);

    // Non-superuser cannot access users
    cy.logout();
    cy.loginAs(normalUsername, normalPassword);

    cy.visit(`${Cypress.env("ADMIN_PANEL_URL")}/resources/User`);
    cy.contains("Page not found").should("exist");
    cy.visit(`${Cypress.env("ADMIN_PANEL_URL")}/resources/Role`);
    cy.contains("Page not found").should("exist");
    cy.visit(`${Cypress.env("ADMIN_PANEL_URL")}/resources/Log`);
    cy.contains("Page not found").should("exist");

    // Cleanup - delete created user
    cy.logout();
    cy.loginAs();
    cy.navigateToResource("User");
    helpers.clickShowRecord(normalUsername);
    helpers.deleteRecord("User");
  });
});

describe("Smoke Test - Dashboard Sequence Analysis", () => {
  beforeEach(() => {
    cy.visit(Cypress.env("APP_URL"));
    cy.wait(1000); // wait for app to load
    cy.clearIndexedDB("gentrain");
  });

  it("should complete a sequence analysis and render the graph", () => {
    cy.contains("Pathogen auswählen").click();
    cy.contains("pathogen").click();
    cy.contains("Starten").click();
    cy.contains("a", "Datenverwaltung").click();

    // Upload case data
    cy.get('[data-testid="file-dropzone-input-case"]').attachFile("/sars-cov-2_falldaten.csv", {
      subjectType: "drag-n-drop",
    });
    cy.contains("Falldaten hinzufügen").click();
    cy.contains("Datei wurde erfolgreich hochgeladen").should("exist");

    // Upload contact data
    cy.get('[data-testid="file-dropzone-input-contact"]').attachFile("/sars-cov-2_kontaktdaten.csv", {
      subjectType: "drag-n-drop",
    });
    cy.contains("Kontaktpersonendaten hinzufügen").click();
    cy.contains("Import war erfolgreich").should("exist");

    // Upload sequence data
    cy.get('[data-testid="file-dropzone-input-sequence"]').attachFile("/sars-cov-2_sequenzdaten.fasta", {
      subjectType: "drag-n-drop",
    });
    cy.contains("Sequenzdaten werden hinzugefügt").should("exist");
    // wait some time until the button appears
    cy.contains("Datei wurde erfolgreich hochgeladen", { timeout: 60000 }).should("exist");

    cy.contains("a", "Dashboard").click();
    helpers.checkIfCanvasHasContent(".force-graph-container > canvas");
  });
});
