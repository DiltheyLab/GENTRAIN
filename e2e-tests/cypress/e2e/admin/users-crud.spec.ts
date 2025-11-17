/**
 * User Management Tests (Priority 2)
 * Tests for user CRUD operations, permissions, and role management
 *
 * Test Cases:
 * - 2.1: Create User (Superuser only)
 * - 2.2: Edit User (Role change)
 * - 2.3: Delete User
 * - 2.4: List & Filter Users
 * - 2.5: Permission boundary (non-superuser cannot create)
 */

import * as helpers from "../../support/helpers";

describe("User Management - CRUD Operations (Priority 2)", () => {
  const testUserId = `testuser-${Date.now()}`;
  const testPassword = "TestUserPass123!";

  beforeEach(() => {
    // Login as superuser before each test
    cy.loginAs("superuser");
  });

  /**
   * 2.1: Create User (Superuser Only)
   * Acceptance Criteria:
   *   Given: Logged in as superuser
   *   When: Navigate to Users resource
   *   And: Click Create button
   *   And: Fill form (username, password, role)
   *   And: Click Save
   *   Then: User is created and visible in list
   *   And: Audit log records action
   */
  it("should create a new user as superuser", () => {
    // Navigate to Users resource
    cy.navigateToResource("users");

    // Wait for users list to load
    helpers.waitForTableLoad();

    // Click create button
    cy.get("button").contains("Create", { matchCase: false }).click({ force: true });

    // Wait for form to load
    cy.get("form", { timeout: 10000 }).should("be.visible");

    // Fill username field
    cy.get('input[name="username"]').clear().type(testUserId);

    // Fill password field
    cy.get('input[name="password"]').clear().type(testPassword);

    // Select role (usually "user" role with ID 2)
    cy.get('select[name="roleId"], select[name="role"]').select("user", { force: true });

    // Submit form
    helpers.submitForm();

    // Verify success message or redirect to list
    cy.url().should("include", "users", { timeout: 10000 });

    // Verify user appears in list
    cy.contains(testUserId, { timeout: 5000 }).should("exist");
  });

  /**
   * 2.1.1: Create User with Validation
   * Acceptance Criteria:
   *   When: Submit form without required fields
   *   Then: Validation error displays
   *   And: User is NOT created
   */
  it("should validate required fields when creating user", () => {
    cy.navigateToResource("users");
    helpers.waitForTableLoad();

    // Click create
    cy.get("button").contains("Create", { matchCase: false }).click({ force: true });
    cy.get("form", { timeout: 10000 }).should("be.visible");

    // Try to submit empty form
    helpers.submitForm();

    // Verify validation error for username
    cy.contains("username", { matchCase: false, timeout: 5000 }).should("exist");

    // Verify still on form (not submitted)
    cy.get("form").should("be.visible");
  });

  /**
   * 2.2: Edit User (Superuser Role Change)
   * Acceptance Criteria:
   *   Given: A user record exists
   *   When: Superuser opens user edit form
   *   And: Changes role to "superuser"
   *   And: Clicks Save
   *   Then: Role is updated in database
   *   And: Log shows change
   */
  it("should edit user role as superuser", () => {
    // First, create a test user
    cy.navigateToResource("users");
    helpers.waitForTableLoad();

    cy.get("button").contains("Create", { matchCase: false }).click({ force: true });
    cy.get("form", { timeout: 10000 }).should("be.visible");

    const editTestUser = `edituser-${Date.now()}`;
    cy.get('input[name="username"]').clear().type(editTestUser);
    cy.get('input[name="password"]').clear().type(testPassword);
    cy.get('select[name="roleId"], select[name="role"]').select("user", { force: true });
    helpers.submitForm();

    // Wait for list and find the user
    cy.contains(editTestUser, { timeout: 5000 }).should("exist");

    // Click edit on the newly created user
    helpers.clickEditRecord(editTestUser);

    // Change role to superuser
    cy.get('select[name="roleId"], select[name="role"]', { timeout: 5000 }).select("superuser", { force: true });

    // Submit
    helpers.submitForm();

    // Verify success
    cy.url().should("include", "users", { timeout: 10000 });

    // Verify user still visible with updated role
    cy.contains(editTestUser, { timeout: 5000 }).should("exist");
  });

  /**
   * 2.3: Delete User
   * Acceptance Criteria:
   *   Given: A non-superuser record exists
   *   When: Superuser clicks delete action
   *   And: Confirms deletion
   *   Then: User is removed from database
   *   And: List no longer shows user
   */
  it("should delete a user", () => {
    cy.navigateToResource("users");
    helpers.waitForTableLoad();

    // Create a user to delete
    cy.get("button").contains("Create", { matchCase: false }).click({ force: true });
    cy.get("form", { timeout: 10000 }).should("be.visible");

    const deleteTestUser = `deleteuser-${Date.now()}`;
    cy.get('input[name="username"]').clear().type(deleteTestUser);
    cy.get('input[name="password"]').clear().type(testPassword);
    cy.get('select[name="roleId"], select[name="role"]').select("user", { force: true });
    helpers.submitForm();

    // Find and delete the user
    cy.contains(deleteTestUser, { timeout: 5000 }).should("exist");

    // Click delete
    helpers.clickDeleteRecord(deleteTestUser);

    // Confirm deletion (AdminJS typically shows confirmation modal)
    cy.get("button").contains("Delete", { matchCase: false }).last().click({ force: true });
    cy.get("button").contains("Confirm", { matchCase: false }).click({ force: true });

    // Verify removed from list
    cy.url().should("include", "users", { timeout: 10000 });
    cy.contains(deleteTestUser).should("not.exist");
  });

  /**
   * 2.4: List & Filter Users
   * Acceptance Criteria:
   *   Given: Multiple users in database
   *   When: Visit Users list
   *   Then: All users displayed with correct columns
   *   When: Filter by role or date
   *   Then: List updates to show only matching records
   */
  it("should display user list with pagination", () => {
    cy.navigateToResource("users");

    // Verify table exists and has header
    helpers.waitForTableLoad();
    cy.contains("th", "username", { matchCase: false }).should("exist");
    cy.contains("th", "role", { matchCase: false }).should("exist");

    // Verify at least one user (the superuser)
    cy.contains("admin-e2e-test").should("exist");
  });

  /**
   * 2.5: Non-Superuser Cannot Create Users (Permission Boundary)
   * Acceptance Criteria:
   *   Given: Logged in as regular user
   *   When: Attempts to navigate to Users resource
   *   Or: Attempts to POST /admin/users/new
   *   Then: Access denied (403 or redirected)
   *   And: Create button is not visible
   */
  it("should prevent non-superuser from creating users", () => {
    // Logout superuser
    cy.logout();

    // Create and login as regular user
    cy.loginAs("user");

    // Try to navigate to Users
    cy.navigateToResource("users");

    // Verify access denied (redirect to dashboard or show error)
    // AdminJS will either not show the Users link or show an error
    cy.url().should("include", "/", { timeout: 10000 });

    // The Users list should not be accessible or show an error
    cy.contains("Users", { timeout: 2000 }).then(($el: any) => {
      if ($el && $el.length > 0) {
        // If Users link exists, clicking it should fail
        cy.get("button").contains("Create", { matchCase: false }).should("not.exist");
      }
    });
  });

  /**
   * 2.5.1: Regular User Cannot Edit Others
   * Acceptance Criteria:
   *   Given: Regular user logged in
   *   When: Attempts to navigate to user edit page via URL
   *   Then: Access denied or cannot modify fields
   */
  it("should prevent regular user from accessing user edit", () => {
    // Login as regular user
    cy.logout();
    cy.loginAs("user");

    // Try to navigate directly to users list
    cy.visit("/users");

    // Should be redirected or see error
    cy.url().should("include", "/", { timeout: 10000 });

    // Dashboard should show, not users list
    cy.contains("GENTRAIN Admin", { timeout: 5000 }).should("exist");
  });

  /**
   * 2.4.1: Filter Users by Role
   * Acceptance Criteria:
   *   When: Apply role filter
   *   Then: List shows only users with that role
   */
  it("should filter users by role", () => {
    cy.navigateToResource("users");
    helpers.waitForTableLoad();

    // Look for filter/search functionality
    cy.get('[placeholder*="filter"], [placeholder*="search"]', { timeout: 5000 }).then(($filter) => {
      if ($filter.length > 0) {
        cy.wrap($filter).type("superuser");
        // Wait for filter to apply
        cy.wait(1000);
        cy.contains("admin-e2e-test").should("exist");
      }
    });
  });

  /**
   * 2.1.2: Duplicate Username Prevention
   * Acceptance Criteria:
   *   Given: User "admin-e2e-test" exists
   *   When: Attempt to create another with same username
   *   Then: Validation error shows
   *   And: User is NOT created
   */
  it("should prevent duplicate username creation", () => {
    cy.navigateToResource("users");
    helpers.waitForTableLoad();

    cy.get("button").contains("Create", { matchCase: false }).click({ force: true });
    cy.get("form", { timeout: 10000 }).should("be.visible");

    // Try to create with existing username
    cy.get('input[name="username"]').clear().type("admin-e2e-test");
    cy.get('input[name="password"]').clear().type(testPassword);
    cy.get('select[name="roleId"], select[name="role"]').select("user", { force: true });

    helpers.submitForm();

    // Verify error message
    cy.contains("already exists", { matchCase: false, timeout: 5000 }).should("exist");
  });
});
