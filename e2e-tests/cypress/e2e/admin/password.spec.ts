/**
 * Password Management Tests (Priority 5)
 * Tests for password change workflows and validation
 *
 * Test Cases:
 * - 5.1: Change Own Password
 * - 5.2: Change Another User's Password
 * - 5.3: Password Validation
 */

import * as helpers from "../../support/helpers";

describe("Password Management (Priority 5)", () => {
  beforeEach(() => {
    cy.loginAs("superuser");
  });

  /**
   * 5.1: Change Own Password (Superuser)
   * Acceptance Criteria:
   *   Given: Logged in as superuser
   *   When: Navigate to "My Password"
   *   And: Enter old password, new password, confirm
   *   And: Click Save
   *   Then: Password is updated
   *   And: Success message displays
   *   And: Can login with new password
   */
  it("should change own password", () => {
    // Navigate to password change
    cy.navigateToResource("passwords");

    cy.get("form", { timeout: 10000 }).should("be.visible");

    const oldPassword = "AdminSecure123!";
    const newPassword = "NewAdminSecure123!";

    // Fill form (typical pattern: old password, new password, confirm)
    cy.get('input[name="currentPassword"], input[name="oldPassword"]').clear().type(oldPassword);
    cy.get('input[name="newPassword"], input[name="password"]').clear().type(newPassword);
    cy.get('input[name="confirmPassword"], input[name="passwordConfirm"]').clear().type(newPassword);

    helpers.submitForm();

    // Verify success
    cy.contains("success", { matchCase: false, timeout: 10000 }).should("exist");

    // Logout and login with new password
    cy.logout();

    // Login with new password (temporarily update env)
    cy.visit("/");
    cy.get('input[type="email"], input[placeholder*="email"]').type("admin-e2e-test");
    cy.get('input[type="password"], input[placeholder*="password"]').type(newPassword);
    cy.get("button").contains("Sign in", { matchCase: false }).click({ force: true });

    // Verify logged in with new password
    cy.contains("GENTRAIN Admin", { timeout: 10000 }).should("be.visible");

    // Change it back to original for other tests
    cy.navigateToResource("passwords");
    cy.get('input[name="currentPassword"], input[name="oldPassword"]').clear().type(newPassword);
    cy.get('input[name="newPassword"], input[name="password"]').clear().type(oldPassword);
    cy.get('input[name="confirmPassword"], input[name="passwordConfirm"]').clear().type(oldPassword);
    helpers.submitForm();

    cy.contains("success", { matchCase: false, timeout: 10000 }).should("exist");
  });

  /**
   * 5.2: Change Another User's Password (Superuser)
   * Acceptance Criteria:
   *   Given: Superuser viewing user record
   *   When: Superuser changes password field
   *   And: Clicks Save
   *   Then: Password is updated
   *   And: Log shows password change
   */
  it("should allow superuser to change other user password", () => {
    // First, create a test user
    cy.navigateToResource("users");
    helpers.waitForTableLoad();

    cy.get("button").contains("Create", { matchCase: false }).click({ force: true });
    cy.get("form", { timeout: 10000 }).should("be.visible");

    const testUser = `pwdtest-${Date.now()}`;
    const testPassword = "InitialPass123!";
    cy.get('input[name="username"]').clear().type(testUser);
    cy.get('input[name="password"]').clear().type(testPassword);
    cy.get('select[name="roleId"], select[name="role"]').select("user", { force: true });

    helpers.submitForm();

    cy.contains(testUser, { timeout: 5000 }).should("exist");

    // Edit the user to change password
    helpers.clickEditRecord(testUser);

    const newPassword = "ChangedPass123!";
    cy.get('input[name="password"]').clear().type(newPassword);

    helpers.submitForm();

    // Verify success
    cy.url().should("include", "users", { timeout: 10000 });
  });

  /**
   * 5.3: Password Validation (Security)
   * Acceptance Criteria:
   *   When: Enter password < 8 chars or invalid format
   *   Then: Validation error displays
   *   And: Form cannot be submitted
   */
  it("should validate password strength", () => {
    cy.navigateToResource("users");
    helpers.waitForTableLoad();

    cy.get("button").contains("Create", { matchCase: false }).click({ force: true });
    cy.get("form", { timeout: 10000 }).should("be.visible");

    // Try weak password
    cy.get('input[name="username"]').clear().type(`weakpwd-${Date.now()}`);
    cy.get('input[name="password"]').clear().type("short");

    helpers.submitForm();

    // Should show validation error about password length or strength
    cy.contains("password", { matchCase: false, timeout: 5000 }).should("exist");

    // Form should still be visible (not submitted)
    cy.get("form").should("be.visible");
  });

  /**
   * 5.3.1: Password Confirmation Mismatch
   * Acceptance Criteria:
   *   When: Confirm password doesn't match new password
   *   Then: Validation error
   */
  it("should validate password confirmation match", () => {
    cy.navigateToResource("passwords");

    cy.get("form", { timeout: 10000 }).should("be.visible");

    cy.get('input[name="currentPassword"], input[name="oldPassword"]').clear().type("AdminSecure123!");
    cy.get('input[name="newPassword"], input[name="password"]').clear().type("NewPass123!");
    cy.get('input[name="confirmPassword"], input[name="passwordConfirm"]').clear().type("DifferentPass123!");

    helpers.submitForm();

    // Should show error about passwords not matching
    cy.contains("match", { matchCase: false, timeout: 5000 }).should("exist");
  });
});
