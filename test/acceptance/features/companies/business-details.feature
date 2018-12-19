@companies-business-details
Feature: Company business details

  @companies-business-details--ghq-one-list
  Scenario: View details for a Dun & Bradstreet GHQ company on the One List

    When I navigate to the `companies.business-details` page using `company` `One List Corp` fixture
    Then the heading should be "Business details"
    And the Company summary key value details are not displayed
    And the One List Corp is known as key value details are displayed
      | key                       | value                        |
      | Trading name              | company.tradingName          |
    And the Global Account Manager – One List key value details are displayed
      | key                       | value                        |
      | One List tier             | company.oneListTier          |
      | Global Account Manager    | company.globalAccountManager |
    And the Business hierarchy key value details are displayed
      | key                       | value                        |
      | Headquarter type          | company.headquarterType      |
      | Subsidiaries              | company.subsidiaries         |
