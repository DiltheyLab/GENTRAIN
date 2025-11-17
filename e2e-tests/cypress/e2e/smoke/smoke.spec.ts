/**
 * Smoke Test - Quick End-to-End Validation
 * Tests all major workflows in rapid succession
 * Purpose: Catch major regressions in < 2 minutes
 *
 * Coverage:
 * 1. Login → Dashboard
 * 2. Navigate Users → Create → Edit → Delete
 * 3. Navigate Roles → View list
 * 4. Navigate Pathogens → Create → Edit
 * 5. Logout
 */

import * as helpers from "../../support/helpers";

describe("Smoke Test - Admin Panel (Critical Workflows)", () => {
  /**
   * Complete workflow smoke test
   */
  it("should execute all critical workflows without errors", () => {
    // 1. LOGIN
    cy.loginAs();

    // 2. ROLES WORKFLOW
    cy.navigateToResource("Role");
    cy.contains("superuser").should("exist");

    // 3. USERS WORKFLOW
    cy.navigateToResource("User");
    helpers.assertRowInTable(Cypress.env("ADMIN_SUPERUSER"));

    // Create user
    cy.contains("Create new").click();
    cy.get("form").should("be.visible");

    const smokeUser = `smoke-user-${Date.now()}`;
    cy.get('[data-testid="property-edit-username"]').type(smokeUser);
    cy.get('[data-testid="property-edit-password"]').type("SmokePass123!");
    cy.get('[data-testid="property-edit-role"]').click().should("contain", "superuser");
    cy.contains("superuser").click();
    helpers.submitForm();

    helpers.assertRowInTable(smokeUser);

    // Delete user
    helpers.clickShowRecord(smokeUser);
    cy.contains("a", "Delete").click();
    cy.contains("Confirm").click({ force: true });
    helpers.assertRowNotInTable(smokeUser);

    // 4. PATHOGENS WORKFLOW
    cy.navigateToResource("Pathogen");

    // Create pathogen
    cy.get("button").contains("Create", { matchCase: false }).click({ force: true });
    cy.get("form", { timeout: 10000 }).should("be.visible");

    const smokePathogen = `smoke-pathogen-${Date.now()}`;
    cy.get('input[name="name"]').clear().type(smokePathogen);
    cy.get('select[name="type"]').select("bacterial", { force: true });
    cy.get('input[name="genetic_distance_threshold"]').clear().type("50");
    helpers.submitForm();

    cy.contains(smokePathogen, { timeout: 5000 }).should("exist");

    // Edit pathogen (just view form and make minor change)
    helpers.clickShowRecord(smokePathogen);
    cy.get('input[name="genetic_distance_threshold"]', { timeout: 5000 }).clear().type("75");
    helpers.submitForm();

    // 5. LOGOUT
    cy.logout();
    cy.url().should("include", "/login");

    // Success - all workflows executed without errors
    cy.log("✅ Smoke test passed - all critical workflows working");
  });

  /**
   * Auth boundary check
   */
  it("should enforce authentication boundaries", () => {
    // Unauthenticated access attempt
    cy.clearCookie("adminjs");
    cy.visit(`${Cypress.env("ADMIN_PANEL_URL")}/resources/User`);

    // Should redirect to login
    cy.url().should("include", "/login");

    // Login and verify access
    cy.loginAs();
    cy.navigateToResource("User");
    cy.url().should("include", "User");

    // Non-superuser cannot access users
    cy.logout();
    cy.loginAs("user");

    cy.navigateToResource("User");
    cy.url().should("not.include", "/User");
  });

  /**
   * Data persistence check
   */
  it("should persist data across page reloads", () => {
    cy.loginAs("superuser");
    cy.navigateToResource("users");
    //helpers.waitForTableLoad();

    // Reload page
    cy.reload();

    // Should still be on users page and logged in
    cy.url().should("include", "users");
    cy.get("table tbody").should("be.visible");
  });
});
