/**
 * User Management Tests
 * Tests for user CRUD operations, permissions, and role management
 *
 * Test Cases:
 * - Create User (Superuser only)
 * - Edit User (Role change)
 * - Edit User (Name change)
 * - Edit User (Password change)
 * - Delete User
 * - Duplicate Username Prevention
 */

import * as helpers from "../../support/helpers";

describe("User Management - CRUD Operations", () => {
  const testUser = `testuser-${Date.now()}`;
  const testPassword = "TestUserPass123!";
  /**
   * Create User (Superuser Only)
   * Acceptance Criteria:
   *   Given: Logged in as superuser
   *   When: Navigate to Users resource
   *   And: Click Create button
   *   And: Fill form (username, password, role)
   *   And: Click Save
   *   Then: User is created and visible in list
   *   And: Audit log shows creation event
   */
  it("should create a new user as superuser", () => {
    cy.loginAs(); // Default login is superuser
    cy.navigateToResource("User");

    // Create user
    helpers.createUser(testUser, testPassword, Cypress.env("USER_ROLE"));
    helpers.assertRowInTable(testUser);

    // Cleanup - Delete created user for test isolation
    helpers.clickShowRecord(testUser);
    helpers.deleteUser();
  });

  /**
   * Edit User (Superuser Role Change)
   * Acceptance Criteria:
   *   Given: A user record exists
   *   When: Superuser opens user edit form
   *   And: Changes role to "superuser"
   *   And: Clicks Save
   *   Then: Role is updated in database
   */
  it("should edit user role as superuser", () => {
    cy.loginAs();
    cy.navigateToResource("User");

    const editTestUser = `edituser-${Date.now()}`;
    // Create a test user for test isolation
    helpers.createUser(editTestUser, testPassword, "user");

    // Wait for list and find the user
    helpers.assertRowInTable(editTestUser);

    // Click to edit
    helpers.clickShowRecord(editTestUser);
    cy.get('[data-testid="action-edit"]').click();

    // Change role to superuser
    cy.get('[data-testid="property-edit-role"]').click().should("contain", Cypress.env("SUPERUSER_ROLE"));
    cy.contains(Cypress.env("SUPERUSER_ROLE")).click();

    // Submit
    helpers.submitForm();

    // Verify success
    helpers.assertRowInTable(editTestUser);
    cy.get(`table tbody tr:contains(${editTestUser}) [data-testid="property-list-role"]`).should(
      "contain",
      Cypress.env("SUPERUSER_ROLE")
    );

    // Cleanup - delete user
    helpers.clickShowRecord(editTestUser);
    helpers.deleteUser();
  });

  /**
   * Edit User (Name Change)
   * Acceptance Criteria:
   *   Given: A user record exists
   *   When: Superuser opens user edit form
   *   And: Changes name
   *   And: Clicks Save
   *   Then: name is updated in database
   */
  it("should edit user name as superuser", () => {
    cy.loginAs();
    cy.navigateToResource("User");

    const nameEditTestUser = `user-${Date.now()}`;
    const updatedName = `updated-${Date.now()}`;

    // Create a test user for test isolation
    helpers.createUser(nameEditTestUser, testPassword, "user");
    helpers.assertRowInTable(nameEditTestUser);

    // Click to edit
    helpers.clickShowRecord(nameEditTestUser);
    cy.get('[data-testid="action-edit"]').click();

    // Change username
    cy.get('[data-testid="property-edit-username"] input').clear().type(updatedName).blur();
    helpers.submitForm();

    // Verify success
    helpers.assertRowInTable(updatedName);

    // Cleanup - delete user
    helpers.clickShowRecord(updatedName);
    helpers.deleteUser();
  });

  /**
   * Edit User (Password Change)
   * Acceptance Criteria:
   *   Given: A user record exists
   *   When: Superuser opens user edit form
   *   And: Changes password
   *   And: Clicks Save
   *   Then: password is updated in database
   */
  it("should edit user password as superuser", () => {
    cy.loginAs();
    cy.navigateToResource("User");

    const passwordEditTestUser = `passwordedituser-${Date.now()}`;
    const newPassword = "NewPass123!";

    // Create a test user for test isolation
    helpers.createUser(passwordEditTestUser, testPassword, Cypress.env("SUPERUSER_ROLE"));
    helpers.assertRowInTable(passwordEditTestUser);
    // Click to edit
    helpers.clickShowRecord(passwordEditTestUser);
    cy.get('[data-testid="action-edit"]').click();
    // Change password
    cy.get('[data-testid="property-edit-password"] input').clear().type(newPassword).blur();
    helpers.submitForm();
    // Verify success
    helpers.assertRowInTable(passwordEditTestUser);
    // Logout and login with new password to verify
    cy.logout();
    cy.loginAs(passwordEditTestUser, newPassword);
    cy.url().should("equal", `${Cypress.env("ADMIN_PANEL_URL")}/`);

    // Cleanup - delete user
    cy.navigateToResource("User");
    helpers.clickShowRecord(passwordEditTestUser);
    helpers.deleteUser();
  });

  /**
   * Delete User
   * Acceptance Criteria:
   *   Given: A non-superuser record exists
   *   When: Superuser clicks delete action
   *   And: Confirms deletion
   *   Then: User is removed from database
   *   And: List no longer shows user
   */
  it("should delete a user", () => {
    cy.loginAs();
    cy.navigateToResource("User");

    const deleteTestUser = `deleteuser-${Date.now()}`;

    // Create a test user for deletion
    helpers.createUser(deleteTestUser, testPassword, "user");
    helpers.assertRowInTable(deleteTestUser);

    // Delete the user
    helpers.clickShowRecord(deleteTestUser);
    helpers.deleteUser();

    // Verify removed from list
    cy.url().should("equal", `${Cypress.env("ADMIN_PANEL_URL")}/resources/User`);
    helpers.assertRowNotInTable(deleteTestUser);
  });

  /**
   * Duplicate Username Prevention
   * Acceptance Criteria:
   *   Given: User "admin-e2e-test" exists
   *   When: Attempt to create another with same username
   *   Then: Validation error shows
   */
  it("should prevent duplicate username creation", () => {
    cy.loginAs();
    cy.navigateToResource("User");
    const normalUsername = "admin-e2e-test";
    const normalPassword = "AnotherPass123!";

    helpers.createUser(normalUsername, normalPassword, Cypress.env("USER_ROLE"));
    helpers.assertRowInTable(normalUsername);

    // Attempt to create duplicate
    helpers.createUser(normalUsername, normalPassword, Cypress.env("USER_ROLE"));

    // Verify error message
    cy.contains("There was an error updating record, Check out console to see more information.", {
      matchCase: false,
    }).should("exist");

    // Cleanup - delete created user
    cy.navigateToResource("User");
    helpers.clickShowRecord(normalUsername);
    helpers.deleteUser();
  });
});
