/**
 * Role Management Tests
 * Tests for role CRUD operations and constraint enforcement
 *
 * Test Cases:
 * Create Role (Superuser only)
 * Delete Role With User Dependency (Constraint)
 * Delete Unused Role (Success)
 */

import * as helpers from "../../support/helpers";

describe("Role Management - CRUD Operations", () => {
  beforeEach(() => {
    cy.loginAs();
    cy.navigateToResource("Role");
  });

  it("should create a new role and delete it afterward", () => {
    cy.contains("Create new").click({ force: true });
    cy.get("form").should("be.visible");

    // Fill form
    const roleName = `analyst-role-${Date.now()}`;
    cy.get("[data-testid='property-edit-name'] input").clear().type(roleName).blur();
    cy.get('[data-testid="property-edit-description"] input')
      .clear()
      .type("Data analyst role for pathogen analysis")
      .blur();

    // Submit
    helpers.submitForm();

    // Verify success
    helpers.assertRowInTable(roleName);

    // Cleanup - Delete created role for test isolation
    helpers.clickShowRecord(roleName);
    helpers.deleteRecord("Role");
  });

  it("should validate required fields when creating role", () => {
    cy.contains("Create new").click({ force: true });
    cy.get("form").should("be.visible");

    // Try to submit without name
    helpers.submitForm();

    // Still on form
    cy.get("form").should("be.visible");
    cy.url().should("include", "/resources/Role/actions/new");
  });

  it("should prevent deletion of role with assigned users", () => {
    // Attempt to delete 'superuser' role which has the seeded assigned admin user
    helpers.clickShowRecord(Cypress.env("SUPERUSER_ROLE"));
    cy.get("[data-testid=action-delete]").click();
    cy.get('button[label="Confirm"]').click();

    // Should show confirmation modal or page
    cy.contains("This role cannot be deleted as there are still users associated with it.").should("exist");
    cy.url().should("include", "show");
    cy.navigateToResource("Role");
    helpers.assertRowInTable(Cypress.env("SUPERUSER_ROLE"));
  });

  it("should display roles list with a superuser role", () => {
    cy.navigateToResource("Role");
    // Verify superuser role exists
    helpers.assertRowInTable(Cypress.env("SUPERUSER_ROLE"));
  });

  it("should change a role name and description", () => {
    const roleName = `test-role-${Date.now()}`;

    // Create role for test isolation
    cy.contains("Create new").click({ force: true });
    cy.get("form").should("be.visible");
    cy.get("[data-testid='property-edit-name'] input").clear().type(roleName).blur();
    cy.get('[data-testid="property-edit-description"] input').clear().type("Temporary role for editing test").blur();
    helpers.submitForm();
    helpers.assertRowInTable(roleName);

    // Edit role
    helpers.clickShowRecord(roleName);
    cy.get("[data-testid=action-edit]").click();
    cy.get("[data-testid='property-edit-name'] input").clear().type(`${roleName}-edited`).blur();
    cy.get('[data-testid="property-edit-description"] input').clear().type("Edited description").blur();
    helpers.submitForm();
    helpers.assertRowInTable(`${roleName}-edited`);

    // Cleanup
    helpers.clickShowRecord(`${roleName}-edited`);
    helpers.deleteRecord("Role");
  });
});
