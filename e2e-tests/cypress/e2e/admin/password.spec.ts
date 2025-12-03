/**
 * Password Management Tests
 * Tests for password change workflows and validation
 *
 * Test Cases:
 * - Change Own Password
 * - Password Validation
 */

import * as helpers from "../../support/helpers";

describe("Password Management", () => {
  beforeEach(() => {
    cy.loginAs();
  });

  it("should change own password", () => {
    // Navigate to password change
    cy.contains("Change password").click({ force: true });
    cy.url().should("include", "/resources/password");
    cy.get("form").should("be.visible");

    const oldPassword = Cypress.env("ADMIN_PASSWORD");
    const newPassword = "NewAdminSecure123!";

    // Fill form
    cy.get('input[name="current_password"]').clear({ force: true }).type(oldPassword).blur();
    cy.get('input[name="new_password"]').clear({ force: true }).type(newPassword).blur();
    cy.get('input[name="repeat_password"]').clear({ force: true }).type(newPassword).blur();

    helpers.submitForm();

    // Verify success
    cy.contains("successfully", { matchCase: false, timeout: 10000 }).should("exist");

    // Logout and login with new password
    cy.logout();
    cy.loginAs(Cypress.env("ADMIN_SUPERUSER"), newPassword);

    // Change it back to original for other tests
    cy.contains("Change password").click({ force: true });
    cy.url().should("include", "/resources/password");
    cy.get("form").should("be.visible");
    cy.get('input[name="current_password"]').clear({ force: true }).type(newPassword).blur();
    cy.get('input[name="new_password"]').clear({ force: true }).type(oldPassword).blur();
    cy.get('input[name="repeat_password"]').clear({ force: true }).type(oldPassword).blur();
    helpers.submitForm();

    cy.contains("successfully", { matchCase: false, timeout: 10000 }).should("exist");
  });

  it("should validate password strength when changing own password", () => {
    cy.contains("Change password").click({ force: true });
    cy.url().should("include", "/resources/password");
    cy.get("form").should("be.visible");

    // Fill form with short password
    cy.get('input[name="current_password"]').clear({ force: true }).type(Cypress.env("ADMIN_PASSWORD")).blur();
    cy.get('input[name="new_password"]').clear({ force: true }).type("Short1!").blur();
    cy.get('input[name="repeat_password"]').clear({ force: true }).type("Short1!").blur();
    helpers.submitForm();
    helpers.checkPasswordValidation();

    // Try Password that misses uppercase character
    cy.get('input[name="new_password"]').clear({ force: true }).type("weakpass1!").blur();
    cy.get('input[name="repeat_password"]').clear({ force: true }).type("weakpass1!").blur();
    helpers.submitForm();
    helpers.checkPasswordValidation();

    // Try Password that misses digit
    cy.get('input[name="new_password"]').clear({ force: true }).type("Weakpass!").blur();
    cy.get('input[name="repeat_password"]').clear({ force: true }).type("Weakpass!").blur();
    helpers.submitForm();
    helpers.checkPasswordValidation();

    // Try Password that misses special character
    cy.get('input[name="new_password"]').clear({ force: true }).type("Weakpass1").blur();
    cy.get('input[name="repeat_password"]').clear({ force: true }).type("Weakpass1").blur();
    helpers.submitForm();
    helpers.checkPasswordValidation();

    // Try Password that misses lowercase character
    cy.get('input[name="new_password"]').clear({ force: true }).type("WEAKPASS1!").blur();
    cy.get('input[name="repeat_password"]').clear({ force: true }).type("WEAKPASS1!").blur();
    helpers.submitForm();
    helpers.checkPasswordValidation();

    // Try blank password
    cy.get('input[name="new_password"]').clear({ force: true }).blur();
    cy.get('input[name="repeat_password"]').clear({ force: true }).blur();
    helpers.submitForm();
    helpers.checkPasswordValidation();

    // Try with mismatched new passwords
    cy.get('input[name="new_password"]').clear({ force: true }).type("ValidPass1!").blur();
    cy.get('input[name="repeat_password"]').clear({ force: true }).type("DifferentPass1!").blur();
    helpers.submitForm();
    helpers.checkPasswordValidation();

    // Try with false old password
    cy.get('input[name="current_password"]').clear({ force: true }).type("WrongOldPass123!").blur();
    cy.get('input[name="new_password"]').clear({ force: true }).type("ValidPass1!").blur();
    cy.get('input[name="repeat_password"]').clear({ force: true }).type("ValidPass1!").blur();
    helpers.submitForm();
    helpers.checkPasswordValidation();
  });

  it("should validate password strength when changing another user's password", () => {
    cy.navigateToResource("User");

    const testUser = `password-validation-user-${Date.now()}`;
    const testUserPassword = "InitialPass1!";
    helpers.createUser(testUser, testUserPassword, "user");
    helpers.assertRowInTable(testUser);

    // Click to edit
    helpers.clickShowRecord(testUser);
    cy.get('[data-testid="action-edit"]').click();
    cy.get("form").should("be.visible");

    // Try short password
    cy.get('[data-testid="property-edit-password"] input').clear().type("Short1!").blur();
    helpers.submitForm();
    helpers.checkPasswordValidation("otherUserPasswordChange");

    // Try Password that misses uppercase character
    cy.get('[data-testid="property-edit-password"] input').clear().type("weakpass1!").blur();
    helpers.submitForm();
    helpers.checkPasswordValidation("otherUserPasswordChange");

    // Try Password that misses digit
    cy.get('[data-testid="property-edit-password"] input').clear().type("Weakpass!").blur();
    helpers.submitForm();
    helpers.checkPasswordValidation("otherUserPasswordChange");

    // Try Password that misses special character
    cy.get('[data-testid="property-edit-password"] input').clear().type("Weakpass1").blur();
    helpers.submitForm();
    helpers.checkPasswordValidation("otherUserPasswordChange");

    // Try Password that misses lowercase character
    cy.get('[data-testid="property-edit-password"] input').clear().type("WEAKPASS1!").blur();
    helpers.submitForm();
    helpers.checkPasswordValidation("otherUserPasswordChange");

    // Cleanup - delete user
    helpers.deleteRecord("User");
  });
});
