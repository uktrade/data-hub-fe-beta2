@companies-export-save
Feature: Company export save

  @companies-export-save--save
  Scenario: Save company export details
    When I navigate to the `companies.exports` page using `company` `Lambda plc` fixture
    Then the Exports details are displayed
      | key                          | value                             |
      | Export win category          | None                              |
      | Currently exporting to       | company.currentlyExportingTo      |
      | Future countries of interest | company.futureCountriesOfInterest |
    When I click the "Edit export markets" link
    And I update the company Exports details
    And I submit the form
    Then the Exports details are displayed
      | key                          | value                             |
      | Export win category          | company.exportWinCategory         |
      | Currently exporting to       | company.currentlyExportingTo      |
      | Future countries of interest | company.futureCountriesOfInterest |

  @companies-export--archived-company
  Scenario: Archived company without Edit export markets button
    When I navigate to the `companies.exports` page using `company` `Archived Ltd` fixture
    And I should not see the "Edit export markets" button
