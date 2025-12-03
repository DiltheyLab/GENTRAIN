/**
 * Custom command type definitions for Cypress
 */

declare namespace Cypress {
  type Resource = "User" | "Role" | "Pathogen" | "Log";

  interface Chainable {
    /**
     * Login to admin panel as a specific user
     * @param username - optional custom username; default admin
     * @param password - optional custom password; default secretPassword
     */
    loginAs(username?: string, password?: string): Chainable<void>;

    /**
     * Logout from admin panel
     */
    logout(): Chainable<void>;

    /**
     * Seed a test user via API
     * @param username - username
     * @param password - plain text password
     * @param roleId - role ID (1 for superuser, 2 for user, etc.)
     */
    seedUser(username: string, password: string, roleId: number): Chainable<{ id: number; username: string }>;

    /**
     * Delete a user via API
     * @param userId - user ID
     */
    deleteUser(userId: number): Chainable<void>;

    /**
     * Seed a test role via API
     * @param name - role name
     * @param description - optional description
     */
    seedRole(name: string, description?: string): Chainable<{ id: number; name: string }>;

    /**
     * Delete a role via API
     * @param roleId - role ID
     */
    deleteRole(roleId: number): Chainable<void>;

    /**
     * Seed a test pathogen via API
     * @param data - pathogen data
     */
    seedPathogen(data: {
      name: string;
      type: "bacterial" | "viral";
      genetic_distance_threshold: number;
      activated?: boolean;
    }): Chainable<{ id: number; name: string; type: string }>;

    /**
     * Delete a pathogen via API
     * @param pathogenId - pathogen ID
     */
    deletePathogen(pathogenId: number): Chainable<void>;

    /**
     * Clear IndexedDB storage
     * @param dbName - database name
     * @param storeName - optional store name
     */
    clearIndexedDB(dbName: string, storeName?: string): Chainable<void>;

    /**
     * Navigate to a resource list page
     * @param resource - resource type (users, roles, pathogens, logs)
     */
    navigateToResource(resource: Resource): Chainable<void>;

    /**
     * Fill a form with given field values
     * @param fields - object with field names and values
     */
    fillForm(fields: Record<string, string>): Chainable<void>;

    /**
     * Confirm a delete action in modal
     */
    confirmDelete(): Chainable<void>;

    /**
     * Expect an error message to be visible
     * @param text - partial or full error text
     */
    expectErrorMessage(text: string): Chainable<void>;

    /**
     * Expect a success message to be visible
     * @param text - partial or full success text
     */
    expectSuccessMessage(text: string): Chainable<void>;
  }
}
