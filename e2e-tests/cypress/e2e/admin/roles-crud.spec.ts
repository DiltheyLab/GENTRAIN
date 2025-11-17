/**
 * Role Management Tests (Priority 3)
 * Tests for role CRUD operations and constraint enforcement
 *
 * Test Cases:
 * - 3.1: Create Role (Superuser only)
 * - 3.2: Delete Role With User Dependency (Constraint)
 * - 3.3: Delete Unused Role (Success)
 */

import * as helpers from "../../support/helpers";

describe("Role Management - CRUD Operations (Priority 3)", () => {
  beforeEach(() => {
    cy.loginAs("superuser");
  });

  /**
   * 3.1: Create Role (Superuser Only)
   * Acceptance Criteria:
   *   Given: Logged in as superuser
   *   When: Navigate to Roles resource
   *   And: Click Create
   *   And: Fill form (name, description)
   *   And: Click Save
   *   Then: Role is persisted
   *   And: Appears in role dropdown on user creation
   */
  it("should create a new role", () => {
    cy.navigateToResource("roles");

    // Wait for roles list
    helpers.waitForTableLoad();

    // Click create
    cy.get("button").contains("Create", { matchCase: false }).click({ force: true });

    // Fill form
    cy.get("form", { timeout: 10000 }).should("be.visible");

    const roleName = `analyst-role-${Date.now()}`;
    cy.get('input[name="name"]').clear().type(roleName);

    // Description is optional but often present
    cy.get('textarea[name="description"], input[name="description"]').then(($desc) => {
      if ($desc.length > 0) {
        cy.wrap($desc).clear().type("Data analyst role for pathogen analysis");
      }
    });

    // Submit
    helpers.submitForm();

    // Verify success
    cy.url().should("include", "roles", { timeout: 10000 });
    cy.contains(roleName, { timeout: 5000 }).should("exist");
  });

  /**
   * 3.1.1: Create Role With Validation
   * Acceptance Criteria:
   *   When: Submit form without name field
   *   Then: Validation error displays
   *   And: Role is NOT created
   */
  it("should validate required fields when creating role", () => {
    cy.navigateToResource("roles");
    helpers.waitForTableLoad();

    cy.get("button").contains("Create", { matchCase: false }).click({ force: true });
    cy.get("form", { timeout: 10000 }).should("be.visible");

    // Try to submit without name
    helpers.submitForm();

    // Verify validation error
    cy.contains("name", { matchCase: false, timeout: 5000 }).should("exist");

    // Still on form
    cy.get("form").should("be.visible");
  });

  /**
   * 3.2: Delete Role With User Dependency (Constraint)
   * Acceptance Criteria:
   *   Given: A role with assigned users
   *   When: Superuser attempts to delete the role
   *   And: Confirms delete
   *   Then: Error message shows: "This role cannot be deleted..."
   *   And: Role is NOT deleted
   *   And: User remains on role detail page
   */
  it("should prevent deletion of role with assigned users", () => {
    cy.navigateToResource("roles");
    helpers.waitForTableLoad();

    // The 'user' role (ID 2) should always have users assigned in a real scenario
    // Click to view/edit the 'user' role
    cy.contains("tr", "user").within(() => {
      cy.get("a, button").contains("Delete", { matchCase: false }).click({ force: true });
    });

    // Should show confirmation modal or page
    cy.get("button").contains("Delete", { matchCase: false }).last().click({ force: true });

    // Accept confirmation if present
    cy.get("button")
      .contains("Confirm", { matchCase: false })
      .then(($btn) => {
        if ($btn.length > 0) {
          cy.wrap($btn).click({ force: true });
        }
      });

    // Verify error message about FK constraint or assigned users
    cy.contains("cannot be deleted", { matchCase: false, timeout: 10000 }).should("exist");

    // Verify still on roles page
    cy.url().should("include", "roles");

    // Verify 'user' role still exists
    cy.contains("user").should("exist");
  });

  /**
   * 3.3: Delete Unused Role (Success)
   * Acceptance Criteria:
   *   Given: A role with no assigned users
   *   When: Superuser deletes the role
   *   And: Confirms deletion
   *   Then: Role is removed
   *   And: Success message displays
   *   And: List no longer shows role
   */
  it("should successfully delete a role with no users", () => {
    // First, create a test role
    cy.navigateToResource("roles");
    helpers.waitForTableLoad();

    cy.get("button").contains("Create", { matchCase: false }).click({ force: true });
    cy.get("form", { timeout: 10000 }).should("be.visible");

    const testRole = `temp-role-${Date.now()}`;
    cy.get('input[name="name"]').clear().type(testRole);

    helpers.submitForm();

    // Wait for list to update
    cy.contains(testRole, { timeout: 5000 }).should("exist");

    // Now delete it
    helpers.clickDeleteRecord(testRole);

    // Confirm deletion
    cy.get("button").contains("Delete", { matchCase: false }).last().click({ force: true });
    cy.get("button").contains("Confirm", { matchCase: false }).click({ force: true });

    // Verify success
    cy.url().should("include", "roles", { timeout: 10000 });

    // Verify role is gone
    cy.contains(testRole).should("not.exist");
  });

  /**
   * 3.2.1: List Roles
   * Acceptance Criteria:
   *   When: Navigate to Roles
   *   Then: All roles displayed in table
   *   And: Has columns: name, description
   */
  it("should display roles list", () => {
    cy.navigateToResource("roles");
    helpers.waitForTableLoad();

    // Verify table headers
    cy.contains("th", "name", { matchCase: false }).should("exist");

    // Verify default roles exist
    cy.contains("superuser").should("exist");
    cy.contains("user").should("exist");
  });

  /**
   * 3.1.2: Non-Superuser Cannot Create Roles
   * Acceptance Criteria:
   *   Given: Regular user logged in
   *   When: Attempts to navigate to Roles resource
   *   Then: Access denied
   *   And: Create button not visible
   */
  it("should prevent non-superuser from creating roles", () => {
    cy.logout();
    cy.loginAs("user");

    // Try to navigate to Roles
    cy.navigateToResource("roles");

    // Should not be able to access or see create button
    cy.get("button").contains("Create", { matchCase: false }).should("not.exist");
  });
});
