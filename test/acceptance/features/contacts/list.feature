@contacts-list @ignore
Feature: View Collection of contacts
  As an existing user
  I would like to view all the Contacts in one place
  And be able to read the contact details as expected

  @contacts-list--name
  Scenario: View first and last name of contact under collections

    Given I create a new contact
    When I search for this Contact name
    And I view a contacts tab
    And I click on contacts tab
    Then I see first and last name of the contact

  @contacts-list--company
  Scenario: View company name of contact under collections

    Given I create a new contact
    When I search for this Contact name
    And I view a contacts tab
    And I click on contacts tab
    Then I see Company name of the contact

  @contacts-list--sector
  Scenario: View sector of contact under collections

    Given I create a new contact
    And I search for this Contact name
    And I view a contacts tab
    And I click on contacts tab
    Then I see Sector of the contact

  @contacts-list--country
  Scenario: View country of contact under collections

    Given I create a new contact
    And I search for this Contact name
    And I view a contacts tab
    And I click on contacts tab
    Then I see Country of the contact

  @contacts-list--timestamp
  Scenario: View time stamp of contact under collections

    Given I create a new contact
    And I search for this Contact name
    And I view a contacts tab
    And I click on contacts tab
    Then I see a time stamp of the contact

  @contacts-list--primary
  Scenario: View primary status of contact under collections

    Given I create a new contact
    And I search for this Contact name
    And I view a contacts tab
    And I click on contacts tab
    Then I see Primary or not status of the contact

  @contacts-list--link
  Scenario: Verify link to contact details page

    Given I create a new contact
    And I search for this Contact name
    And I view a contacts tab
    And I click on contacts tab
    And I click on the first contact collection link
    Then I navigate to his contact details page

  @contacts-list--address-same-as-company
  Scenario: Verify contact with same address as company

    Given I create a new contact with same address as company
    And I search for this Contact name
    And I view a contacts tab
    And I click on contacts tab
    Then I see Country of the contact same as the company

  @contacts-list--all
  Scenario: View Collection of contacts

    Given I create a new contact
    And I search for this Contact name
    And I view a contacts tab
    And I click on contacts tab
    Then I see first and last name of the contact
    And I see Company name of the contact
    And I see Sector of the contact
    And I see Country of the contact
    And I see a time stamp of the contact
    And I see Primary or not status of the contact
    And I logout of Data Hub website
