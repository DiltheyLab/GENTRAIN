describe("My First Test", () => {
    it('It finds the content "type"', () => {
        cy.visit("https://example.cypress.io");
        cy.contains("type").click();
        cy.url().should("include", "https://example.cypress.io/commands/actions");
        cy.get(".action-email").type("philipp@test.de");
        cy.get(".action-email").should("have.value", "philipp@test.de");
    });
});
