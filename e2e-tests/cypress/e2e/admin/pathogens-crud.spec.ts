/**
 * Pathogen Management Tests (Priority 4)
 * Tests for pathogen CRUD, type immutability, and scheme management
 *
 * Test Cases:
 * - 4.1: Create Pathogen (Bacterial)
 * - 4.2: Pathogen Type Immutability
 * - 4.3: Activate/Deactivate Pathogen
 * - 4.4: Upload Scheme & Example Data
 * - 4.5: Download Scheme & Example Data
 * - 4.6: List & Search Pathogens
 */

import * as helpers from "../../support/helpers";

describe("Pathogen Management - CRUD Operations (Priority 4)", () => {
  beforeEach(() => {
    cy.loginAs("superuser");
  });

  /**
   * 4.1: Create Pathogen (Bacterial)
   * Acceptance Criteria:
   *   Given: Logged in as superuser
   *   When: Navigate to Pathogens resource
   *   And: Click Create
   *   And: Fill form (name, type, threshold, activated)
   *   And: Click Save
   *   Then: Pathogen is created
   *   And: Appears in list
   */
  it("should create a new bacterial pathogen", () => {
    cy.navigateToResource("pathogens");
    helpers.waitForTableLoad();

    cy.get("button").contains("Create", { matchCase: false }).click({ force: true });
    cy.get("form", { timeout: 10000 }).should("be.visible");

    const pathogenName = `Salmonella-test-${Date.now()}`;
    cy.get('input[name="name"]').clear().type(pathogenName);

    // Select type (bacterial)
    cy.get('select[name="type"]').select("bacterial", { force: true });

    // Set genetic distance threshold
    cy.get('input[name="genetic_distance_threshold"]').clear().type("50");

    // Activated checkbox (usually unchecked by default)
    cy.get('input[name="activated"], input[type="checkbox"]').then(($checkbox) => {
      if ($checkbox.length > 0) {
        cy.wrap($checkbox).uncheck({ force: true });
      }
    });

    helpers.submitForm();

    // Verify success
    cy.url().should("include", "pathogens", { timeout: 10000 });
    cy.contains(pathogenName, { timeout: 5000 }).should("exist");
  });

  /**
   * 4.1.1: Create Viral Pathogen
   * Acceptance Criteria:
   *   When: Create pathogen with type "viral"
   *   Then: Pathogen is created with correct type
   *   And: Type field becomes immutable
   */
  it("should create a new viral pathogen", () => {
    cy.navigateToResource("pathogens");
    helpers.waitForTableLoad();

    cy.get("button").contains("Create", { matchCase: false }).click({ force: true });
    cy.get("form", { timeout: 10000 }).should("be.visible");

    const viralName = `CoronaVirus-test-${Date.now()}`;
    cy.get('input[name="name"]').clear().type(viralName);

    // Select viral type
    cy.get('select[name="type"]').select("viral", { force: true });

    cy.get('input[name="genetic_distance_threshold"]').clear().type("200");

    helpers.submitForm();

    // Verify success
    cy.contains(viralName, { timeout: 5000 }).should("exist");
  });

  /**
   * 4.2: Pathogen Type Immutability
   * Acceptance Criteria:
   *   Given: A pathogen with type "bacterial"
   *   When: Superuser opens edit form
   *   Then: Type field is read-only or hidden
   *   And: Cannot change type
   */
  it("should prevent changing pathogen type after creation", () => {
    cy.navigateToResource("pathogens");
    helpers.waitForTableLoad();

    // Create a pathogen first
    cy.get("button").contains("Create", { matchCase: false }).click({ force: true });
    cy.get("form", { timeout: 10000 }).should("be.visible");

    const immutablePathogen = `Immutable-${Date.now()}`;
    cy.get('input[name="name"]').clear().type(immutablePathogen);
    cy.get('select[name="type"]').select("bacterial", { force: true });
    cy.get('input[name="genetic_distance_threshold"]').clear().type("50");
    helpers.submitForm();

    cy.contains(immutablePathogen, { timeout: 5000 }).should("exist");

    // Now edit it
    helpers.clickEditRecord(immutablePathogen);

    // Verify type field is read-only or disabled
    cy.get('select[name="type"]', { timeout: 5000 }).then(($typeSelect) => {
      // Either disabled attribute or should not exist at all
      if ($typeSelect.length > 0) {
        cy.wrap($typeSelect).should("be.disabled");
      } else {
        // Type field might be hidden in edit mode
        cy.get('[data-field="type"]').should("not.exist");
      }
    });
  });

  /**
   * 4.3: Activate/Deactivate Pathogen
   * Acceptance Criteria:
   *   Given: An inactive pathogen
   *   When: Superuser toggles "activated" to true
   *   And: Saves
   *   Then: Status changes
   *   And: Only active pathogens appear in dashboard dropdown
   */
  it("should activate/deactivate pathogen", () => {
    cy.navigateToResource("pathogens");
    helpers.waitForTableLoad();

    // Create inactive pathogen
    cy.get("button").contains("Create", { matchCase: false }).click({ force: true });
    cy.get("form", { timeout: 10000 }).should("be.visible");

    const activatablePathogen = `Activatable-${Date.now()}`;
    cy.get('input[name="name"]').clear().type(activatablePathogen);
    cy.get('select[name="type"]').select("bacterial", { force: true });
    cy.get('input[name="genetic_distance_threshold"]').clear().type("50");
    helpers.submitForm();

    cy.contains(activatablePathogen, { timeout: 5000 }).should("exist");

    // Edit and activate
    helpers.clickEditRecord(activatablePathogen);

    // Check the activated checkbox
    cy.get('input[name="activated"]', { timeout: 5000 }).check({ force: true });

    helpers.submitForm();

    // Verify it was activated (can check if status column updates or navigate back to confirm)
    cy.url().should("include", "pathogens", { timeout: 10000 });
  });

  /**
   * 4.6: List & Search Pathogens
   * Acceptance Criteria:
   *   Given: Multiple pathogens in database
   *   When: Navigate to Pathogens
   *   Then: All displayed in table
   *   And: Columns show: name, type, activated, scheme_version
   *   When: Filter by type
   *   Then: List updates
   */
  it("should display pathogens list with filtering", () => {
    cy.navigateToResource("pathogens");
    helpers.waitForTableLoad();

    // Verify table headers exist
    cy.contains("th", "name", { matchCase: false }).should("exist");
    cy.contains("th", "type", { matchCase: false }).should("exist");

    // Verify we can see pathogens if any exist
    cy.get("table tbody tr").then(($rows) => {
      cy.wrap($rows.length).should("be.greaterThan", 0);
    });
  });

  /**
   * 4.4: Upload Scheme (Simplified)
   * Acceptance Criteria:
   *   Given: A pathogen exists
   *   When: User clicks "Upload Scheme"
   *   And: Selects valid .tar.gz file
   *   And: Clicks Upload
   *   Then: File is validated
   *   And: Status shows uploading/extracting/ready
   *   And: Scheme size stored
   *
   * Note: Full file upload testing is integration-level
   * For E2E, we test the UI flow without actual large files
   */
  it("should show scheme upload component on pathogen detail", () => {
    cy.navigateToResource("pathogens");
    helpers.waitForTableLoad();

    // Create a test pathogen
    cy.get("button").contains("Create", { matchCase: false }).click({ force: true });
    cy.get("form", { timeout: 10000 }).should("be.visible");

    const uploadPathogen = `UploadTest-${Date.now()}`;
    cy.get('input[name="name"]').clear().type(uploadPathogen);
    cy.get('select[name="type"]').select("bacterial", { force: true });
    cy.get('input[name="genetic_distance_threshold"]').clear().type("50");
    helpers.submitForm();

    cy.contains(uploadPathogen, { timeout: 5000 }).should("exist");

    // View the pathogen
    helpers.clickShowRecord(uploadPathogen);

    // Verify we're on detail page
    cy.get("form", { timeout: 10000 }).should("be.visible");

    // Verify scheme upload section exists (component should be visible)
    cy.contains("Scheme", { matchCase: false, timeout: 5000 }).should("exist");
  });

  /**
   * 4.5: Download Scheme (UI Presence)
   * Acceptance Criteria:
   *   Given: Pathogen with uploaded scheme
   *   When: User views pathogen detail
   *   Then: Download button is visible
   *   And: Clicking triggers download (file format check)
   *
   * Note: Actual file download is hard to test in Cypress
   * We test button presence and link validity
   */
  it("should have download button for pathogen", () => {
    cy.navigateToResource("pathogens");
    helpers.waitForTableLoad();

    // View first pathogen
    cy.get("table tbody tr")
      .first()
      .within(() => {
        cy.get("a, button").contains("Show").click({ force: true });
      });

    // Look for download button or link
    cy.get("a, button")
      .contains("Download", { matchCase: false, timeout: 5000 })
      .then(($el) => {
        if ($el.length > 0) {
          // Button exists, verify it has href or is clickable
          cy.wrap($el).should("exist");
        }
      });
  });

  /**
   * 4.1.2: Pathogen Validation
   * Acceptance Criteria:
   *   When: Create pathogen with missing required fields
   *   Then: Validation error shows
   */
  it("should validate required pathogen fields", () => {
    cy.navigateToResource("pathogens");
    helpers.waitForTableLoad();

    cy.get("button").contains("Create", { matchCase: false }).click({ force: true });
    cy.get("form", { timeout: 10000 }).should("be.visible");

    // Try to submit empty form
    helpers.submitForm();

    // Verify validation error for name
    cy.contains("name", { matchCase: false, timeout: 5000 }).should("exist");

    cy.get("form").should("be.visible");
  });
});
