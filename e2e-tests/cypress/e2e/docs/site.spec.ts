/**
 * Documentation Test
 * Tests for verifying the documentation site functionality
 *
 * Coverage:
 * 1. Load Documentation Homepage
 * 2. Navigate to Application Section
 * 3. Navigate to Development Section
 * 4. Navigate to Admin Section
 * 5. Switch Language to English
 */

describe("Documentation Test", () => {
  beforeEach(() => {
    cy.visit(Cypress.env("DOCS_URL"));
  });

  it("should load the documentation homepage", () => {
    cy.contains("GENTRAIN - Dokumentation").should("be.visible");
    cy.url().should("eq", Cypress.env("DOCS_URL") + "/");
  });

  it("should navigate to the Application section", () => {
    cy.contains("a", "Anwendung").click();
    cy.contains("Navigationsleiste").should("be.visible");
  });

  it("should navigate to the Development section", () => {
    cy.contains("a", "Entwicklung").click();
    cy.contains("Getting Started").should("be.visible");
  });

  it("should navigate to the Admin section", () => {
    cy.contains("a", "Administration").click();
    cy.contains("Allgemeines zum Admin-Panel").should("be.visible");
  });

  it("should switch to English version of the docs", () => {
    cy.get(".navbar__item.dropdown").within(() => {
      cy.get("a.navbar__link").click();
      cy.contains("a.dropdown__link", "English").click({ force: true });
    });

    cy.contains("GENTRAIN - Documentation").should("be.visible");
    cy.url().should("include", "/en/");
  });
});
