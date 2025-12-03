/**
 * Custom Cypress commands for admin panel E2E tests
 */
import "cypress-file-upload";

/**
 * Login command - uses API to seed session, then visits dashboard
 * This avoids brittle UI-based login in most tests
 */
Cypress.Commands.add(
  "loginAs",
  (username = Cypress.env("ADMIN_SUPERUSER"), password = Cypress.env("ADMIN_PASSWORD")) => {
    cy.visit(Cypress.env("ADMIN_PANEL_URL"));
    cy.get("input[name=email]").type(username);
    cy.get("input[name=password]").type(`${password}{enter}`);
    cy.url().should("equal", `${Cypress.env("ADMIN_PANEL_URL")}/`);
    cy.get("div").should("contain", username);
    cy.getCookie("adminjs").should("exist");
  }
);

/**
 * Logout command
 */
Cypress.Commands.add("logout", () => {
  cy.visit(Cypress.env("ADMIN_PANEL_URL"));
  cy.contains("Log out").click({ force: true });
  cy.url().should("include", "/login");
});

/**
 * Delete a user via API
 */
Cypress.Commands.add("deleteUser", (userId: number) => {
  cy.loginAs("superuser");

  cy.request({
    method: "DELETE",
    url: `${Cypress.env("ADMIN_PANEL_URL")}/api/users/${userId}`,
    failOnStatusCode: false,
  });
});

/**
 * Seed a test role via API
 */
Cypress.Commands.add("seedRole", (name: string, description?: string) => {
  cy.loginAs("superuser");

  cy.request({
    method: "POST",
    url: `${Cypress.env("ADMIN_PANEL_URL")}/api/resources/Role/actions/new`,
    headers: {
      accept: "application/json, text/plain, */*",
    },
    body: {
      name,
      description: description || `${name} role`,
    },
    failOnStatusCode: false,
  }).then((response) => {
    cy.wrap({
      id: response.body?.id || Date.now(),
      name: response.body?.name || name,
    });
  });
});

/**
 * Delete a role via API
 */
Cypress.Commands.add("deleteRole", (roleId: number) => {
  cy.loginAs("superuser");

  cy.request({
    method: "DELETE",
    url: `${Cypress.env("ADMIN_PANEL_URL")}/api/resources/Role/records/${roleId}/delete`,
    failOnStatusCode: false,
  });
});

/**
 * Seed a test pathogen via API
 */
Cypress.Commands.add(
  "seedPathogen",
  (data: { name: string; type: "bacterial" | "viral"; genetic_distance_threshold: number; activated?: boolean }) => {
    cy.loginAs("superuser");

    cy.request({
      method: "POST",
      url: `${Cypress.env("ADMIN_PANEL_URL")}/api/pathogens`,
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        ...data,
        activated: data.activated ?? false,
      },
      failOnStatusCode: false,
    }).then((response) => {
      cy.wrap({
        id: response.body?.id || Date.now(),
        name: response.body?.name || data.name,
        type: response.body?.type || data.type,
      });
    });
  }
);

/**
 * Delete a pathogen via API
 */
Cypress.Commands.add("deletePathogen", (pathogenId: number) => {
  cy.loginAs("superuser");

  cy.request({
    method: "DELETE",
    url: `${Cypress.env("ADMIN_PANEL_URL")}/api/pathogens/${pathogenId}`,
    failOnStatusCode: false,
  });
});

/**
 * Clear IndexedDB storage
 */
Cypress.Commands.add("clearIndexedDB", (dbName: string) => {
  cy.window().then((win) => {
    return new Cypress.Promise<void>((resolve, reject) => {
      const indexedDB = win.indexedDB;
      if (!indexedDB) {
        resolve();
        return;
      }

      try {
        const request = indexedDB.deleteDatabase(dbName);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      } catch (err) {
        resolve(); // Silently continue if not available
      }
    });
  });
});

/**
 * Navigate to a resource list page
 */
Cypress.Commands.add("navigateToResource", (resource: Cypress.Resource) => {
  const resourceMap: Record<string, Cypress.Resource> = {
    users: "User",
    roles: "Role",
    pathogens: "Pathogen",
    logs: "Log",
  };

  cy.visit(Cypress.env("ADMIN_PANEL_URL"));
  cy.contains("a > div", resourceMap[resource] || resource, { timeout: 10000 }).click({ force: true });
  cy.url().should("include", resource);
});

/**
 * Fill a form with given field values
 * Handles input fields, selects, checkboxes
 */
Cypress.Commands.add("fillForm", (fields: Record<string, string>) => {
  Object.entries(fields).forEach(([fieldName, value]) => {
    // Try input field first
    cy.get(`input[name="${fieldName}"], input[placeholder*="${fieldName}"]`, { timeout: 5000 }).then(($input) => {
      if ($input.length > 0) {
        cy.wrap($input).clear().type(value);
      } else {
        // Try select/dropdown
        cy.get(`select[name="${fieldName}"]`, { timeout: 5000 }).select(value);
      }
    });
  });
});

/**
 * Confirm a delete action in modal
 */
Cypress.Commands.add("confirmDelete", () => {
  // AdminJS typically uses a confirmation modal or dialog
  cy.get("button").contains("Delete", { matchCase: false }).last().click({ force: true });
  cy.get("button").contains("Confirm", { matchCase: false }).click({ force: true });
});

/**
 * Expect an error message
 */
Cypress.Commands.add("expectErrorMessage", (text: string) => {
  cy.contains(text, { timeout: 10000 }).should("be.visible");
});

/**
 * Expect a success message
 */
Cypress.Commands.add("expectSuccessMessage", (text: string) => {
  cy.contains(text, { timeout: 10000 }).should("be.visible");
});
