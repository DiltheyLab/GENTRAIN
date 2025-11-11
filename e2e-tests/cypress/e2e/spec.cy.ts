describe("tutorial", () => {
  function checkIfGraphIsRendered(): void {
    cy.wait(2000); // Wait until graph is rendered
    cy.get(".force-graph-container > canvas").then(($canvas: JQuery<HTMLCanvasElement>) => {
      const canvas = $canvas[0];
      const ctx = canvas.getContext("2d");

      // Check if canvas is not empty
      const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const hasContent = Array.from(pixelData).some((value) => value !== 0);
      expect(hasContent).to.be.true;
    });
  }

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
    cy.visit("https://app.localhost");
    cy.contains("Beispielszenario starten").click();
  });

  it("does the turorial until the end", () => {
    cy.contains("Schritt 1").should("be.visible");
    cy.contains("button", "Weiter").click();
    cy.contains("Schritt 2").should("be.visible");
    cy.contains("button", "Weiter").click();
    cy.contains("Schritt 3").should("be.visible");
    checkIfGraphIsRendered();
    clickUntilNextPageOrEnd();
    cy.url().should("include", "/data-management");
    clickUntilNextPageOrEnd();
    cy.url().should("include", "/outbreak-analysis");
    clickUntilNextPageOrEnd();
    cy.url().should("include", "/outbreak-analysis/1");
    cy.contains("button > span", "Schule A");
    checkIfGraphIsRendered();
    clickUntilNextPageOrEnd();
    cy.url().should("equal", "https://app.localhost/");
  });

  it("refreshes the page during the turorial and checks the turorial step", () => {
    cy.contains("button", "Weiter").click();
    cy.contains("Schritt 2").should("be.visible");
    checkIfGraphIsRendered();
    cy.reload();
    checkIfGraphIsRendered();
    cy.contains("Schritt 2").should("be.visible");
  });

  it("can end the turorial", () => {
    cy.contains("button", "Weiter").click();
    cy.contains("button", "Tutorial beenden").should("be.visible").click();
    cy.contains("Bitte Pathogen auswählen");
  });
});
