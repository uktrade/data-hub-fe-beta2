@contacts-collection @collection
Feature: View collection of contacts
  As an existing user
  I would like to view all the Contacts in one place
  And be able to read the contact details as expected

  @contacts-collection--view
  Scenario: View contact collection

    Given I navigate to company fixture Venus Ltd
    When I click the Contacts local nav link
    And I click the "Add contact" link
    And a primary contact is added
    When I submit the form
    Then I see the success message
    Then I wait and then refresh the page
    Then I capture the modified on date for the first item
    When I navigate to the Contact collection page
    Then I confirm I am on the Contacts page
    And the results count header for contact is present
    And I can view the Contact in the collection
      | text         | expected           |
      | Job title    | contact.jobTitle   |
      | Company      | company.name       |
      | Sector       | company.sector     |
      | Updated      | collection.updated |
      | Country      | company.country    |
      | UK region    | company.ukRegion   |
    And the Contact has badges
      | text         | expected           |
      | Contact type | contact.type       |

  @contacts-collection--view--lep @lep
  Scenario: View contact collection as LEP

    When I navigate to the Contact collection page
    Then I confirm I am on the Contacts page
    And the results count header for contact is present

  @contacts-collection--view--da @da
  Scenario: View contact collection as DA

    When I navigate to the Contact collection page
    Then I confirm I am on the Contacts page
    And the results count header for contact is present

  @contacts-collection--filter
  Scenario: Filter contact list

    Given I navigate to company fixture Venus Ltd
    When I click the Contacts local nav link
    And I click the "Add contact" link
    And a primary contact is added
    When I submit the form
    Then I see the success message
    Then I wait and then refresh the page
    When I navigate to the Contact collection page
    And I filter the contacts list by contact
    Then the contacts should be filtered by contact name
    When I clear all filters
    Then there are no filters selected
    When I filter the contacts list by active status
    Then the result count should be reset
    When I filter the contacts list by company
    Then the contacts should be filtered by company name
    When I clear all filters
    Then there are no filters selected
    When I filter the contacts list by active status
    Then the result count should be reset
    When I filter the contacts list by sector
    Then the contacts should be filtered by company sector
    When I clear all filters
    Then there are no filters selected
    When I filter the contacts list by active status
    Then the result count should be reset
    When I filter the contacts list by country
    Then the contacts should be filtered to show badge company country
    When I clear all filters
    Then there are no filters selected
    When I filter the contacts list by active status
    Then the result count should be reset
    When I filter the contacts list by country
    And I filter the contacts list by UK region
    Then the contacts should be filtered to show badge company country
    When I click on the first contact collection link
    And I click the local header link
    Then the company details UK region is displayed


  @contacts-collection--sort
  Scenario: Sort contact list

    When a "Foreign company" is created
    And the company is in the search results
    When the first search result is clicked
    When I click the Contacts local nav link
    And I click the "Add contact" link
    And a primary contact is added
    When I submit the form
    Then I see the success message
    Then I wait and then refresh the page
    When I navigate to the Contact collection page
    When the contacts are sorted by Newest
    When the contacts are sorted by Oldest
    Then the contacts should have been correctly sorted by creation date
    When the contacts are sorted by Recently updated
    When the contacts are sorted by Least recently updated
    Then the contacts should have been correctly sorted for date fields
    When the contacts are sorted by First name: A-Z
    When the contacts are sorted by First name: Z-A
    Then the contacts should have been correctly sorted for text fields
#    When the contacts are sorted by Last name: A-Z
#    When the contacts are sorted by Last name: Z-A
#    Then the contacts should have been correctly sorted for text fields TODO: potential bug being investigated (is the problem when two are identical?)
    When the contacts are sorted by Country: A-Z
    When the contacts are sorted by Country: Z-A
    Then the contacts should have been correctly sorted for text fields
    When the contacts are sorted by Company: A-Z
    When the contacts are sorted by Company: Z-A
    Then the contacts should have been correctly sorted for text fields
    When the contacts are sorted by Sector: A-Z
    When the contacts are sorted by Sector: Z-A
    Then the contacts should have been correctly sorted for text fields
