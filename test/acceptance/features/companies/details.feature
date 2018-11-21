@companies-details
Feature: Company details

  @companies-details--ghq-one-list
  Scenario: View details for a GHQ on the One List

    When I navigate to the `companies.details` page using `company` `One List Corp` fixture
    Then the Company summary key value details are not displayed
    And the Global headquarters summary key value details are displayed
      | key                       | value                        |
      | Business type             | company.businessType         |
      | Primary address           | company.primaryAddress       |
      | Headquarter type          | company.headquarterType      |
      | Sector                    | company.sector               |
      | Business description      | company.description          |
      | Number of employees       | company.employeeRange        |
      | Annual turnover           | company.turnoverRange        |
      | Country                   | company.country              |
    And the Global Account Manager – One List key value details are displayed
      | key                       | value                        |
      | One List tier             | company.oneListTier          |
      | Global Account Manager    | company.globalAccountManager |
    And I should see the "See all advisers on the core team" link


  @companies-details--subsidiary-company-no-one-list
  Scenario: View details for a company not on the One List

    When I navigate to the `companies.details` page using `company` `Mars Exports Ltd` fixture
    Then the Company summary key value details are displayed
      | key                       | value                        |
      | Business type             | company.businessType         |
      | Primary address           | company.primaryAddress       |
      | Headquarter type          | company.headquarterType      |
      | Global HQ                 | company.globalHeadquarters   |
      | Sector                    | company.sector               |
      | Business description      | company.description          |
      | Number of employees       | company.employeeRange        |
      | Annual turnover           | company.turnoverRange        |
      | Country                   | company.country              |
    And the Global headquarters summary key value details are not displayed
    And the Global Account Manager – One List key value details are not displayed
    And I should not see the "See all advisers on the core team" link
