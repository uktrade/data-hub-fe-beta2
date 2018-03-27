@contacts-save
Feature: Create New Contact
  As a data hub user
  I would like to add a contact to data hub
  So that I can collect contact data

  @contacts-save--primary
  Scenario: Add a new primary contact

    When I navigate to the `companies.contacts` page using `company` `Lambda plc` fixture
    And I click the "Add contact" link
    Then there are contact fields
    When a primary contact is added
    And I submit the form
    Then I see the success message
    And I wait and then refresh the page
    When I click the Contacts local nav link
    Then the contact is displayed on the company contact tab
    When the contact is clicked
    Then the Contact details details are displayed
      | key                   | value                                |
      | Job title             | contact.jobTitle                     |
      | Phone number          | contact.primaryPhoneNumber           |
      | Alternative telephone | contact.alternativePhoneNumber       |
      | Address               | contact.address                      |
      | Email                 | contact.emailAddress                 |
      | Alternative email     | contact.alternativeEmail             |
      | Notes                 | contact.notes                        |
      | Email marketing       | contact.acceptsEmailMarketingFromDit |


  @contacts-save--primary-new-company-address
  Scenario: Add a new primary contact with new company address

    When I navigate to the `companies.contacts` page using `company` `Lambda plc` fixture
    And I click the "Add contact" link
    Then there are contact fields
    When a primary contact with new company address is added
    And I submit the form
    Then I see the success message
    When I click the Contacts local nav link
    Then the contact is displayed on the company contact tab
    When the contact is clicked
    Then the Contact details details are displayed
      | key                   | value                                |
      | Job title             | contact.jobTitle                     |
      | Phone number          | contact.primaryPhoneNumber           |
      | Alternative telephone | contact.alternativePhoneNumber       |
      | Address               | contact.address                      |
      | Email                 | contact.emailAddress                 |
      | Alternative email     | contact.alternativeEmail             |
      | Notes                 | contact.notes                        |
      | Email marketing       | contact.acceptsEmailMarketingFromDit |


  @contacts-save--non-primary
  Scenario: Add a new non-primary contact

    When I navigate to the `companies.contacts` page using `company` `Lambda plc` fixture
    And I click the "Add contact" link
    Then there are contact fields
    When a non-primary contact is added
    And I submit the form
    Then I see the success message
    When I click the Contacts local nav link
    Then the contact is displayed on the company contact tab
    When the contact is clicked
    Then the Contact details details are displayed
      | key                   | value                                |
      | Job title             | contact.jobTitle                     |
      | Phone number          | contact.primaryPhoneNumber           |
      | Alternative telephone | contact.alternativePhoneNumber       |
      | Address               | contact.address                      |
      | Email                 | contact.emailAddress                 |
      | Alternative email     | contact.alternativeEmail             |
      | Notes                 | contact.notes                        |
      | Email marketing       | contact.acceptsEmailMarketingFromDit |


  @contacts-save--primary-dashboard
  Scenario: New primary contact is visible on the dashboard

    When I navigate to the `companies.contacts` page using `company` `Lambda plc` fixture
    And I click the "Add contact" link
    Then there are contact fields
    When a primary contact is added
    And I submit the form
    Then I see the success message
    And I wait and then refresh the page
    When I navigate to the `dashboard` page
    Then the contact is displayed on the dashboard


  @contacts-save--mandatory-fields
  Scenario: Contact fields are mandatory

    When I navigate to the `companies.contacts` page using `company` `Lambda plc` fixture
    And I click the "Add contact" link
    Then there are contact fields
    When I submit the form
    Then the contact fields have error messages
    And I see form error summary
