@companies-interaction-collection @collection
Feature: View collection of interactions for a company

  @companies-interactions-collection--view
  Scenario: View companies interaction collection
    When I navigate to the `companies.interactions` page using `company` `Venus Ltd` fixture
    And the results summary for a interaction collection is present
    And I can view the collection
    And the result count should be greater than 0

  @companies-interactions-collection--view-archived-company
  Scenario: View companies interaction collection for archived company without contacts
    When I navigate to the `companies.interactions` page using `company` `Contactless Archived Ltd` fixture
    Then I should not see the "add a contact" link

  @companies-interactions-collection--filter # TODO

  @companies-interactions-collection--sort # TODO

  @companies-interactions-collection--lep @lep
  Scenario: Navigate to interactions as LEP
    When I navigate to the `companies.interactions` page using `company` `Lambda plc` fixture
    Then I see the 403 error page

  @companies-interactions-collection--da @da
  Scenario: Navigate to interactions as DA
    When I navigate to the `companies.interactions` page using `company` `Lambda plc` fixture
    Then I see the 403 error page
