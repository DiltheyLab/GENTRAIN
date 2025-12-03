/**
 * Helper utilities for admin panel E2E tests
 * Selector wrappers, assertion helpers, and common patterns
 */

/**
 * Get selector for AdminJS action button (edit, delete, show)
 */
export const getActionButtonSelector = (action: "edit" | "delete" | "show"): string => {
  const actionMap = {
    edit: "Edit",
    delete: "Delete",
    show: "Show",
  };
  return actionMap[action];
};

/**
 * Get selector for list row containing text
 */
export const getTableRowSelector = (text: string): string => {
  return `tr:contains("${text}")`;
};

/**
 * Assert that a row exists in the table with given text
 */
export const assertRowInTable = (text: string): void => {
  cy.contains("table tbody tr", text).should("exist");
};

/**
 * Assert that a row does NOT exist in the table
 */
export const assertRowNotInTable = (text: string): void => {
  cy.contains("table tbody tr", text).should("not.exist");
};

/**
 * Click a button by exact or partial text match
 */
export const clickButton = (text: string, options?: { partial?: boolean; timeout?: number }): void => {
  const { partial = false, timeout = 10000 } = options || {};
  const selector = partial
    ? cy.get("button").contains(text, { matchCase: false, timeout })
    : cy.get("button").contains(new RegExp(`^${text}$`), { matchCase: false, timeout });
  selector.click({ force: true });
};

/**
 * Fill an input field by label or name
 */
export const fillInput = (labelOrName: string, value: string): void => {
  cy.get(`label:contains("${labelOrName}")`, { timeout: 5000 }).then(($label) => {
    const inputId = $label.attr("for");
    if (inputId) {
      cy.get(`#${inputId}`).clear().type(value);
    } else {
      cy.get(`input[name="${labelOrName}"]`).clear().type(value);
    }
  });
};

/**
 * Select an option from a select dropdown
 */
export const selectDropdown = (labelOrName: string, optionText: string): void => {
  cy.get(`label:contains("${labelOrName}")`, { timeout: 5000 }).then(($label) => {
    const selectId = $label.attr("for");
    if (selectId) {
      cy.get(`#${selectId}`).select(optionText);
    } else {
      cy.get(`select[name="${labelOrName}"]`).select(optionText);
    }
  });
};

/**
 * Toggle a checkbox by label
 */
export const toggleCheckbox = (label: string, shouldBeChecked?: boolean): void => {
  cy.get(`label:contains("${label}")`, { timeout: 5000 }).then(($label) => {
    const inputId = $label.attr("for");
    if (inputId) {
      cy.get(`#${inputId}`).then(($checkbox) => {
        const isChecked = $checkbox.is(":checked");
        if (shouldBeChecked !== undefined && isChecked !== shouldBeChecked) {
          cy.wrap($checkbox).click();
        } else if (shouldBeChecked === undefined) {
          cy.wrap($checkbox).click();
        }
      });
    }
  });
};

/**
 * Verify form has required error message
 */
export const assertFormError = (fieldName: string, errorText?: string): void => {
  const text = errorText || "required";
  cy.contains(`${fieldName}.*${text}`, { matchCase: false }).should("exist");
};

/**
 * Get the current logged-in user's info from UI (if displayed)
 */
export const getCurrentUser = (): Cypress.Chainable<string> => {
  return cy.get('[data-testid="current-user"], .current-user, .user-info').invoke("text");
};

/**
 * Get count of rows in table
 */
export const getTableRowCount = (): Cypress.Chainable<number> => {
  return cy.get("table tbody tr").then(($rows) => $rows.length);
};

/**
 * Click show/view action for a record by name
 */
export const clickShowRecord = (recordName: string): void => {
  cy.contains("table tbody tr", recordName).click();
  cy.get("h2").should("contain", "Show");
};

/**
 * Submit a form
 */
export const submitForm = (): void => {
  cy.get('form button[type="submit"]').click();
};

/**
 * Assert notification message type (success, error, info, warning)
 */
export const assertNotification = (type: "success" | "error" | "info" | "warning", text?: string): void => {
  const selector = `[role="alert"], .notification, .message-box, [class*="alert-${type}"]`;
  cy.get(selector, { timeout: 10000 }).should("be.visible");
  if (text) {
    cy.get(selector).contains(text).should("exist");
  }
};

/**
 * Check if a canvas is not empty
 */
export const checkIfCanvasHasContent = (selector: string, waitUntilRendering = 2000): void => {
  cy.wait(waitUntilRendering);
  cy.get(selector).then(($canvas: JQuery<HTMLCanvasElement>) => {
    const canvas = $canvas[0];
    const ctx = canvas.getContext("2d");

    // Check if canvas is not empty
    const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const hasContent = Array.from(pixelData).some((value) => value !== 0);
    expect(hasContent).to.be.true;
  });
};

/*
 * Create a user with given username, password, and role
 */
export const createUser = (username: string, password: string, role: string): void => {
  cy.contains("Create new").click();
  cy.get("form").should("be.visible");
  cy.get('[data-testid="property-edit-username"] input').type(username);
  cy.get('[data-testid="property-edit-password"] input').type(password);
  cy.get('[data-testid="property-edit-role"]').click().should("contain", role);
  cy.contains(new RegExp(`^${role}$`)).click();
  submitForm();
};

/**
 * Delete the currently viewed user
 */
export const deleteRecord = (resource: Cypress.Resource): void => {
  cy.get("[data-testid=action-delete]").click();
  cy.get('button[label="Confirm"]').click();
  cy.url().should("equal", `${Cypress.env("ADMIN_PANEL_URL")}/resources/${resource}`);
};

/**
 * Validate password change error handling
 */
export const checkPasswordValidation = (
  type: "ownPasswordChangeDialog" | "otherUserPasswordChange" = "ownPasswordChangeDialog"
): void => {
  if (type === "ownPasswordChangeDialog") {
    cy.contains("Password was not changed", { matchCase: false }).should("exist");
    cy.get("form").should("be.visible");
    cy.url().should("include", "/resources/password");
  } else {
    cy.contains("User was not updated", { matchCase: false }).should("exist");
    cy.get("form").should("be.visible");
    cy.url().should("include", "/edit");
  }
};
