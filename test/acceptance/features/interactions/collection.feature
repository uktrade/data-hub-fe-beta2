@interactions-collection @collection
Feature: View collection of interactions
  As an existing user
  I would like to view all the interactions in one place
  And be able to read the interaction details as expected

  @interactions-collection--view-interaction
  Scenario: View interaction in interactions and services collection

    When I navigate to the `companies.interactions` page using `company` `Venus Ltd` fixture
    And I click the "Add interaction" link
    And I select interaction
    When an interaction is added
      | key      | value                 |
    Then I see the success message
    When I navigate to the `interactions.list` page
    Then I confirm I am on the Interactions page
    And the results summary for a interaction collection is present
    Then I filter the collections to view the Interaction I have just created
    And I can view the interaction in the collection
      | text    | expected               |
      | Contact | contact.heading        |
      | Company | company.name           |
      | Date    | interaction.date       |
      | Adviser | interaction.ditAdviser |
    And the Interaction has badges
      | text    | expected               |
      | Type    | interaction.type       |

  @interactions-collection--view-service-delivery
  Scenario: View service delivery in interactions and services collection

    When I navigate to the `companies.interactions` page using `company` `Venus Ltd` fixture
    And I click the "Add interaction" link
    And I select service delivery
    And a service delivery is added
      | key             | value          |
    Then I see the success message
    When I navigate to the `interactions.list` page
    Then I confirm I am on the Interactions page
    And the results summary for a interaction collection is present
    Then I filter the collections to view the Service Delivery I have just created
    And I can view the interaction in the collection
      | text    | expected               |
      | Contact | contact.heading        |
      | Company | company.name           |
      | Date    | interaction.date       |
      | Adviser | interaction.ditAdviser |
    And the Interaction has badges
      | text    | expected               |
      | Type    | interaction.type       |

  @ignore @interactions-collection--filter
  #todo The acceptance tests with the typeahead Vue component needs looking into as setting values with nightwatch in the search field does not work
  Scenario: filter interaction list

    When I navigate to the `companies.interactions` page using `company` `Venus Ltd` fixture
    And I click the "Add interaction" link
    And I select interaction
    And an interaction is added
      | key             | value          |
    Then I see the success message
    When I navigate to the `interactions.list` page
    Then I confirm I am on the Interactions page
    And the results summary for a interaction collection is present
    Then I filter the interactions list by service provider
    Then the interactions should be filtered by service provider

  @interactions-collection--lep @lep
  Scenario: Navigate to interactions shows 403 for LEPs

    When I navigate to the `interactions.list` page
    Then I see the 403 error page

  @interactions-collection--da @da
  Scenario: Navigate to interactions shows 403 for DAs

    When I navigate to the `interactions.list` page
    Then I see the 403 error page
