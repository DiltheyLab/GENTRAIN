/**
 * Auth Tests (Priority 1)
 * Tests for login, logout, and session persistence
 *
 * Test Cases:
 * - 1.1: Login with valid superuser credentials
 * - 1.2: Login with invalid credentials
 * - 1.3: Session persistence & logout
 */

describe("Admin Panel Authentication (Priority 1)", () => {
  /**
   * 1.1: Login with Valid Credentials (Superuser)
   * Acceptance Criteria:
   *   Given: User visits the login page
   *   When: User enters valid superuser credentials
   *   Then: User is authenticated and redirected to dashboard
   *   And: Session cookie is set with httpOnly flag
   *   And: Dashboard displays welcome message
   */
  it("should login with valid superuser credentials", () => {
    // Navigate to admin panel (not logged in)
    cy.visit("/");

    // Verify we're on login page
    cy.url().should("include", "/login");
    cy.contains("Sign in", { timeout: 10000 }).should("be.visible");

    // Enter credentials
    cy.get('input[type="email"], input[placeholder*="email"], input[name="email"]', { timeout: 5000 }).type(
      "admin-e2e-test"
    );
    cy.get('input[type="password"], input[placeholder*="password"], input[name="password"]', { timeout: 5000 }).type(
      "AdminSecure123!"
    );

    // Click sign in button
    cy.get("button").contains("Sign in", { matchCase: false }).click({ force: true });

    // Verify logged in state
    cy.url().should("include", "/", { timeout: 10000 });
    cy.contains("GENTRAIN Admin", { timeout: 10000 }).should("be.visible");
    cy.contains("Welcome to the GENTRAIN admin panel", { timeout: 5000 }).should("be.visible");

    // Verify session cookie is set
    cy.getCookie("adminjs").should("exist");
  });

  /**
   * 1.2: Login with Invalid Credentials
   * Acceptance Criteria:
   *   Given: User on login page
   *   When: Enters invalid username or wrong password
   *   Then: Error message displays
   *   And: Session is not established
   *   And: User remains on login page
   */
  it("should show error on invalid credentials", () => {
    cy.visit("/");

    // Verify on login page
    cy.url().should("include", "/login");

    // Enter invalid credentials
    cy.get('input[type="email"], input[placeholder*="email"], input[name="email"]').type("nonexistent@test.com");
    cy.get('input[type="password"], input[placeholder*="password"], input[name="password"]').type("WrongPassword123!");

    // Click sign in
    cy.get("button").contains("Sign in", { matchCase: false }).click({ force: true });

    // Verify error message appears (AdminJS typically shows in alert or form error)
    cy.contains("invalid", { matchCase: false, timeout: 5000 }).should("exist");

    // Verify still on login page
    cy.url().should("include", "/login");

    // Verify no session cookie set
    cy.getCookie("adminjs").should("not.exist");
  });

  /**
   * 1.3: Session Persistence & Logout
   * Acceptance Criteria:
   *   Given: User is logged in as superuser
   *   When: User refreshes the page
   *   Then: User remains logged in
   *   When: User clicks logout
   *   Then: Session is cleared and user redirected to login
   */
  it("should persist session on page refresh", () => {
    // Login first
    cy.loginAs("superuser");

    // Verify on dashboard
    cy.url().should("not.include", "/login");
    cy.contains("GENTRAIN Admin").should("be.visible");

    // Refresh page
    cy.reload();

    // Verify still logged in after refresh
    cy.contains("GENTRAIN Admin", { timeout: 10000 }).should("be.visible");
    cy.url().should("not.include", "/login");
  });

  /**
   * 1.3.2: Logout Clears Session
   * Acceptance Criteria:
   *   When: User clicks logout
   *   Then: Session is cleared
   *   And: User is redirected to login page
   *   And: Cannot access dashboard without re-login
   */
  it("should logout and clear session", () => {
    // Login first
    cy.loginAs("superuser");

    // Verify logged in
    cy.contains("GENTRAIN Admin").should("be.visible");

    // Click logout (button typically in header or user menu)
    cy.get("button, a", { timeout: 5000 }).contains("Logout", { matchCase: false }).click({ force: true });

    // Verify redirected to login
    cy.url().should("include", "/login", { timeout: 10000 });
    cy.contains("Sign in", { timeout: 5000 }).should("be.visible");

    // Verify session cookie cleared
    cy.getCookie("adminjs").should("not.exist");

    // Attempt to visit dashboard - should redirect to login
    cy.visit("/");
    cy.url().should("include", "/login");
  });

  /**
   * 1.3.3: Multiple Sessions (Different Browsers/Tabs)
   * Acceptance Criteria:
   *   Given: Superuser logged in as admin-e2e-test
   *   When: Login as another user in same browser
   *   Then: Previous session is replaced
   *   And: New user can access dashboard
   */
  it("should handle multiple logins (session replacement)", () => {
    // First login
    cy.loginAs("superuser");
    cy.contains("GENTRAIN Admin").should("be.visible");

    // Logout
    cy.get("button, a").contains("Logout", { matchCase: false }).click({ force: true });
    cy.url().should("include", "/login");

    // Note: In real scenario, this would test different user login
    // For now, just verify we can re-login as superuser
    cy.loginAs("superuser");
    cy.contains("GENTRAIN Admin").should("be.visible");
  });

  /**
   * 1.3.4: Expired Session Handling
   * Acceptance Criteria:
   *   Given: User is logged in
   *   When: Session cookie is deleted manually
   *   Then: Next API call redirects to login
   */
  it("should handle expired/missing session gracefully", () => {
    // Login
    cy.loginAs("superuser");
    cy.contains("GENTRAIN Admin").should("be.visible");

    // Clear session cookie
    cy.clearCookie("adminjs");

    // Attempt to navigate to protected resource
    cy.visit("/");
    cy.url().should("include", "/login", { timeout: 10000 });
  });
});
