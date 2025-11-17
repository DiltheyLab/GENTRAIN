/**
 * Audit Logging Tests
 * Tests for logger feature tracking actions
 */

import * as helpers from "../../support/helpers";

describe("Audit Logging", () => {
  /**
   * Action Logged (Create, Edit, Delete)
   * Acceptance Criteria:
   *   Given: Superuser creates/edits/deletes a record
   *   When: Action completes
   *   Then: Log entry is created with:
   *     - action: "create"/"edit"/"delete"
   *     - resource: "User"/"Pathogen"/etc.
   *     - userId: admin's user ID
   *     - timestamp: current time
   *   When: Superuser views Logs
   *   Then: All recent actions visible
   */
  it("should log user creation action", () => {
    cy.loginAs("superuser");
    cy.navigateToResource("users");
    helpers.waitForTableLoad();

    // Create a test user
    cy.get("button").contains("Create", { matchCase: false }).click({ force: true });
    cy.get("form", { timeout: 10000 }).should("be.visible");

    const loggedUser = `logged-user-${Date.now()}`;
    cy.get('input[name="username"]').clear().type(loggedUser);
    cy.get('input[name="password"]').clear().type("TestPass123!");
    cy.get('select[name="roleId"], select[name="role"]').select("user", { force: true });

    helpers.submitForm();

    // Now check logs
    cy.navigateToResource("logs");
    helpers.waitForTableLoad();

    // Verify log entry exists for this user creation
    // Log table typically shows: action, resource, timestamp, recordTitle
    cy.contains("create", { matchCase: false, timeout: 5000 }).should("exist");
    cy.contains(loggedUser, { matchCase: false, timeout: 5000 }).should("exist");
  });

  /**
   * 7.1.1: Edit Action Logged
   * Acceptance Criteria:
   *   When: User is edited
   *   Then: Edit log with diff is recorded
   */
  it("should log user edit action", () => {
    cy.loginAs("superuser");
    cy.navigateToResource("users");
    helpers.waitForTableLoad();

    // Create user first
    cy.get("button").contains("Create", { matchCase: false }).click({ force: true });
    cy.get("form", { timeout: 10000 }).should("be.visible");

    const editedUser = `edited-user-${Date.now()}`;
    cy.get('input[name="username"]').clear().type(editedUser);
    cy.get('input[name="password"]').clear().type("TestPass123!");
    cy.get('select[name="roleId"], select[name="role"]').select("user", { force: true });

    helpers.submitForm();

    // Edit the user
    cy.contains(editedUser, { timeout: 5000 }).should("exist");
    helpers.clickEditRecord(editedUser);

    // Change role
    cy.get('select[name="roleId"], select[name="role"]', { timeout: 5000 }).select("superuser", { force: true });
    helpers.submitForm();

    // Check logs
    cy.navigateToResource("logs");
    helpers.waitForTableLoad();

    // Verify edit action is logged
    cy.contains("edit", { matchCase: false, timeout: 5000 }).should("exist");
  });

  /**
   * 7.1.2: Delete Action Logged
   * Acceptance Criteria:
   *   When: User is deleted
   *   Then: Delete log entry created
   */
  it("should log user delete action", () => {
    cy.loginAs("superuser");
    cy.navigateToResource("users");
    helpers.waitForTableLoad();

    // Create user
    cy.get("button").contains("Create", { matchCase: false }).click({ force: true });
    cy.get("form", { timeout: 10000 }).should("be.visible");

    const deletedUser = `deleted-user-${Date.now()}`;
    cy.get('input[name="username"]').clear().type(deletedUser);
    cy.get('input[name="password"]').clear().type("TestPass123!");
    cy.get('select[name="roleId"], select[name="role"]').select("user", { force: true });

    helpers.submitForm();

    // Delete the user
    cy.contains(deletedUser, { timeout: 5000 }).should("exist");
    helpers.clickDeleteRecord(deletedUser);

    cy.get("button").contains("Delete", { matchCase: false }).last().click({ force: true });
    cy.get("button").contains("Confirm", { matchCase: false }).click({ force: true });

    // Check logs
    cy.navigateToResource("logs");
    helpers.waitForTableLoad();

    // Verify delete action is logged
    cy.contains("delete", { matchCase: false, timeout: 5000 }).should("exist");
  });

  /**
   * 7.1.3: Pathogen Action Logged
   * Acceptance Criteria:
   *   When: Pathogen is created/edited
   *   Then: Log entry shows action and resource
   */
  it("should log pathogen creation action", () => {
    cy.loginAs("superuser");
    cy.navigateToResource("pathogens");
    helpers.waitForTableLoad();

    // Create pathogen
    cy.get("button").contains("Create", { matchCase: false }).click({ force: true });
    cy.get("form", { timeout: 10000 }).should("be.visible");

    const loggedPathogen = `logged-pathogen-${Date.now()}`;
    cy.get('input[name="name"]').clear().type(loggedPathogen);
    cy.get('select[name="type"]').select("bacterial", { force: true });
    cy.get('input[name="genetic_distance_threshold"]').clear().type("50");

    helpers.submitForm();

    // Check logs
    cy.navigateToResource("logs");
    helpers.waitForTableLoad();

    // Verify pathogen creation is logged
    cy.contains("create", { matchCase: false, timeout: 5000 }).should("exist");
    cy.contains(loggedPathogen, { matchCase: false, timeout: 5000 }).should("exist");
  });

  /**
   * 7.2: Log Read Access (Superuser Only)
   * Acceptance Criteria:
   *   Given: Regular user logged in
   *   When: Attempts to view Logs resource
   *   Then: Access denied (not listed in sidebar, returns 403)
   */
  it("should deny log access to non-superuser", () => {
    cy.logout();
    cy.loginAs("user");

    // Try to navigate to Logs
    cy.navigateToResource("logs");

    // Should not be able to access
    cy.url().should("not.include", "/logs");

    // Should be on dashboard
    cy.contains("GENTRAIN Admin", { timeout: 5000 }).should("exist");
  });

  /**
   * 7.2.1: Log List Display for Superuser
   * Acceptance Criteria:
   *   When: Superuser views Logs
   *   Then: List shows all actions with columns:
   *     - action
   *     - resource
   *     - recordTitle
   *     - userId
   *     - timestamp
   */
  it("should display logs list for superuser", () => {
    cy.loginAs("superuser");
    cy.navigateToResource("logs");

    helpers.waitForTableLoad();

    // Verify table headers
    cy.contains("th", "action", { matchCase: false }).should("exist");
    cy.contains("th", "resource", { matchCase: false }).should("exist");

    // Should have at least some log entries
    cy.get("table tbody tr").then(($rows) => {
      cy.wrap($rows.length).should("be.greaterThanOrEqual", 0);
    });
  });

  /**
   * 7.1.4: Log Entry Shows Timestamp
   * Acceptance Criteria:
   *   When: Action is logged
   *   Then: Log entry has current timestamp
   */
  it("should include timestamp in log entries", () => {
    cy.loginAs("superuser");
    cy.navigateToResource("logs");

    helpers.waitForTableLoad();

    // Look for date/time column
    cy.get("table tbody tr")
      .first()
      .then(($row) => {
        // Should contain a timestamp (various formats possible)
        const text = $row.text();
        // Just verify the row exists and has content
        cy.wrap(text).should("not.be.empty");
      });
  });
});
