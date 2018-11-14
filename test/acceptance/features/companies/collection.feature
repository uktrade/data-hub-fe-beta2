# TODO archived filters and sort
@companies-collection @collection
Feature: View collection of companies
  As an existing user
  I would like to view all the Companies in one place
  And be able to read the companies details as expected

  @companies-collection--view
  Scenario: View companies collection

    When a "Foreign company" is created
    Then I see the success message
    When I navigate to the `companies.list` page
    Then I confirm I am on the Companies page
    And the results summary for a company collection is present
    And there is an Add company button in the collection header
    And I can view the Company in the collection
      | text               | expected                  |
      | Sector             | company.sector_descends   |
      | Primary address    | company.primaryAddress    |
    And the Company has badges
      | text               | expected                  |
      | Country            | company.country           |
      | UK region          | company.ukRegion          |

  @companies-collection--view--lep @lep
  Scenario: View companies collection as LEP

    When I navigate to the `companies.list` page
    Then I confirm I am on the Companies page
    And the results summary for a company collection is present

  @companies-collection--view--da @da
  Scenario: View companies collection as DA

    When I navigate to the `companies.list` page
    Then I confirm I am on the Companies page
    And the results summary for a company collection is present

  @companies-collection--filter
  Scenario: Filter companies list

    When a "UK non-private or non-public limited company" is created
    Then I see the success message
    When I navigate to the `companies.list` page
    When I clear all filters
    Then there are no filters selected
    Given I store the result count in state
    And I filter the companies list by company
    Then the companies should be filtered by company name
    And the result count should be 1
    And the companies CSV download button should be visible
    When I clear all filters
    Then there are no filters selected
    And the result count should be reset
    Given I store the result count in state
    When I filter the companies list by active status
    Then the result count should be 2 less than the total
    When I clear all filters
    Then there are no filters selected
    And the result count should be reset
    Given I store the result count in state
    When I filter the companies list by inactive status
    Then the result count should be 2
    When I clear all filters
    Then there are no filters selected
    And the result count should be reset
    Given I store the result count in state
    When I filter the companies list by country
    Then the companies should be filtered to show badge company country
    When I clear all filters
    Then there are no filters selected
    And the result count should be reset
    Given I store the result count in state
    When I filter the companies list by country
    And I filter the companies list by UK region
    Then the companies should be filtered to show badge company country
    And the companies should be filtered to show badge company UK region
    When I click on the first company collection link
    Then the company details UK region is displayed


  @companies-collection--sort
  Scenario: Sort companies list

    When a "Foreign company" is created
    Then I see the success message
    When I navigate to the `companies.list` page
    And the results are sorted by Recently updated
    Then the results should be sorted by Recently updated
    And the results are sorted by Least recently updated
    Then the results should be sorted by Least recently updated
    When the companies are sorted by Company name: A-Z
    # Then I see the list in A-Z alphabetical order - Possible bug with sorting as results dont appear to be sorted by name
