@companies-subsidiaries @subsidiaries
Feature: Company subsidiaries

  @companies-subsidiaries--set-hq
  Scenario: Set a company to a Global HQ
    When I navigate to the `companies.fixture` page using `company` `Lambda plc` fixture
    Then I click the "Edit company details" link
    And I change "headquarter_type" radio button option to "Global HQ"
    And I submit the form
    Then I see the success message

  @companies-subsidiaries--link
  Scenario: Add a subsidiary
    When I navigate to the `companies.fixture` page using `company` `Lambda plc` fixture
    Then I click the "Subsidiaries" link
    Then I click the "Link a subsidiary" link
    And I change form text field "term" to Mars
    And I submit the form
    And I choose the first item in the collection
    Then I see the success message

  @companies-subsidiaries--details
  Scenario: View subsidiaries
    When I navigate to the `companies.fixture` page using `company` `Lambda plc` fixture
    Then I click the "Subsidiaries" link
    And I can view the collection

  @companies-subsidiaries--remove-subsidiary
  Scenario: Remove a subsidiary
    When I navigate to the `companies.fixture` page using `company` `Lambda plc` fixture
    Then I click the "Subsidiaries" link
    And I click the "Remove subsidiary" link
    Then I see the success message

  @companies-subsidiaries--teardown
  Scenario: Company can be set back to 'not a headquarters' again
    When I navigate to the `companies.fixture` page using `company` `Lambda plc` fixture
    Then I click the "Edit company details" link
    And I change "headquarter_type" radio button option to "Not a headquarters"
    And I submit the form
    Then I see the success message

  @companies-subsidiaries--archived-company
  Scenario: Archived company without Link a subsidiary button
    When I navigate to the `companies.subsidiaries` page using `company` `Archived Ltd` fixture
    And I should not see the "Link a subsidiary" button
    And I can view the collection
    And I should not see the "Remove subsidiary" link
    And the page should contain text "Why can I not link a subsidiary"

