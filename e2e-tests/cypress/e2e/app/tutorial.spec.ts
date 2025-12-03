/**
 * Tutorial Tests
 * Tests for the interactive GENTRAIN tutorial
 */
import { checkIfCanvasHasContent } from "../../support/helpers";

describe("tutorial", () => {
  function clickUntilNextPageOrEnd(): void {
    cy.get("body").then(($body) => {
      if ($body.find('button:contains("Zur nächsten Seite")').length) {
        cy.contains("button", "Zur nächsten Seite").click();
        return;
      } else if ($body.find('button:contains("Fertig")').length) {
        cy.contains("button", "Fertig").click();
        return;
      }
      cy.contains("button", "Weiter")
        .click()
        .then(() => {
          clickUntilNextPageOrEnd();
        });
    });
  }

  // Run shared code before each test so tests can always be able to be run independently from one another and still pass.
  beforeEach(() => {
    cy.visit(Cypress.env("APP_URL"));
    cy.wait(1000); //wait for database re-initialization
    cy.contains("Beispielszenario starten").click();
  });

  it("does the turorial until the end without errors", () => {
    // Go through the entire tutorial
    cy.contains("Schritt 1").should("be.visible");
    cy.contains("button", "Weiter").click();
    cy.contains("Schritt 2").should("be.visible");
    cy.contains("button", "Weiter").click();
    cy.contains("Schritt 3").should("be.visible");
    // Check graph is rendered in step 3
    checkIfCanvasHasContent(".force-graph-container > canvas");

    // Continue tutorial until data management page
    clickUntilNextPageOrEnd();
    cy.url().should("include", "/data-management");

    // Continue tutorial until outbreak analysis overview page
    clickUntilNextPageOrEnd();
    cy.url().should("include", "/outbreak-analysis");

    // Continue tutorial until next outbreak analysis page
    clickUntilNextPageOrEnd();
    cy.url().should("include", "/outbreak-analysis/1");

    // Check if page rendered with Outbreak Schule A and graph is rendered
    cy.contains("button > span", "Schule A");
    checkIfCanvasHasContent(".force-graph-container > canvas");

    // Continue tutorial until end and get back to dashboard
    clickUntilNextPageOrEnd();
    cy.url().should("equal", `${Cypress.env("APP_URL")}/`);
  });

  it("refreshes the page during the turorial and checks if the turorial step stays the same", () => {
    // Go to step 2 and check if graph is rendered after reload
    cy.contains("button", "Weiter").click();
    cy.contains("Schritt 2").should("be.visible");
    checkIfCanvasHasContent(".force-graph-container > canvas");
    cy.reload();
    checkIfCanvasHasContent(".force-graph-container > canvas");
    cy.contains("Schritt 2").should("be.visible");
  });

  it("can end the turorial after start", () => {
    cy.contains("button", "Tutorial beenden").should("be.visible").click();
    cy.contains("Bitte Pathogen auswählen");
  });
});
