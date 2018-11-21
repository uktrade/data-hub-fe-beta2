@companies-save
Feature: Create a new company
  As an existing user
  I would like to create a new company in various locations
  And then view its details on the company summary page

  @companies-save--uk-private-or-public-ltd-company
  Scenario: Create a UK private or public limited company

    When a "UK private or public limited company" is created
    Then I see the success message
    And the company trading name is in the search results
    When the first search result is clicked
    Then the Company summary key value details are displayed
      | key                       | value                      |
      | Business type             | company.businessType       |
      | Primary address           | company.primaryAddress     |
      | Trading name              | company.tradingName        |
      | UK region                 | company.ukRegion           |
      | Headquarter type          | company.headquarterType    |
      | Global HQ                 | company.globalHeadquarters |
      | Sector                    | company.sector             |
      | Website                   | company.website            |
      | Business description      | company.description        |
      | Number of employees       | company.employeeRange      |
      | Annual turnover           | company.turnoverRange      |

  @companies-save--uk-non-private-or-non-public-ltd-company
  Scenario: Create a UK non-private or non-public limited company

    When a "UK non-private or non-public limited company" is created
    Then I see the success message
    And the company is in the search results
    When the first search result is clicked
    Then the Company summary key value details are displayed
      | key                       | value                      |
      | Business type             | company.businessType       |
      | Primary address           | company.primaryAddress     |
      | UK region                 | company.ukRegion           |
      | Headquarter type          | company.headquarterType    |
      | Global HQ                 | company.globalHeadquarters |
      | Sector                    | company.sector             |
      | Website                   | company.website            |
      | Business description      | company.description        |
      | Number of employees       | company.employeeRange      |
      | Annual turnover           | company.turnoverRange      |

  @companies-save--foreign
  Scenario: Create a foreign company

    When a "Foreign company" is created
    Then I see the success message
    And the company is in the search results
    When the first search result is clicked
    Then the Company summary key value details are displayed
      | key                       | value                            |
      | Business type             | company.businessType             |
      | Primary address           | company.primaryAddress           |
      | Headquarter type          | company.headquarterType          |
      | Global HQ                 | company.globalHeadquarters       |
      | Sector                    | company.sector                   |
      | Website                   | company.website                  |
      | Business description      | company.description              |
      | Number of employees       | company.employeeRange            |
      | Annual turnover           | company.turnoverRange            |
      | Country                   | company.registeredAddressCountry |

  @companies-save--foreign-uk-branch
  Scenario: Create a UK branch of a foreign company

    When a "UK branch of a foreign company" is created
    Then I see the success message
    And the company is in the search results
    When the first search result is clicked
    Then the Company summary key value details are displayed
      | key                       | value                      |
      | Business type             | company.businessType       |
      | Primary address           | company.primaryAddress     |
      | UK region                 | company.ukRegion           |
      | Headquarter type          | company.headquarterType    |
      | Global HQ                 | company.globalHeadquarters |
      | Sector                    | company.sector             |
      | Website                   | company.website            |
      | Business description      | company.description        |
      | Number of employees       | company.employeeRange      |
      | Annual turnover           | company.turnoverRange      |
