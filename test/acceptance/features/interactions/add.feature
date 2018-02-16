@interaction-add
Feature: Add a new interaction in Data hub

  @interaction-add--companies-interaction-submit
  Scenario: Companies interaction is saved

    Given I navigate to company fixture Venus Ltd
    When I click the Interactions local nav link
    And I click the "Add interaction" link
    And I select interaction
    Then there are interaction fields
    And interaction fields are pre-populated
    When an interaction is added
    Then I see the success message
    And the details are displayed
      | key                      | value                             |
      | Company                  | Venus Ltd                         |
      | Contact                  | interaction.contact               |
      | Service provider         | interaction.serviceProvider       |
      | Service                  | interaction.service               |
      | Subject                  | interaction.subject               |
      | Notes                    | interaction.notes                 |
      | Date of interaction      | interaction.date                  |
      | DIT adviser              | interaction.ditAdviser            |
      | Communication channel    | interaction.communicationChannel  |
      | Documents                | There are no files or documents   |

  @interaction-add--companies-service-delivery-submit
  Scenario: Companies service delivery is saved

    Given I navigate to company fixture Venus Ltd
    When I click the Interactions local nav link
    And I click the "Add interaction" link
    And I select service delivery
    Then there are service delivery fields
    And interaction fields are pre-populated
    When a service delivery is added
      | key             | value                                    |
    Then I see the success message
    And the details are displayed
      | key                      | value                             |
      | Company                  | Venus Ltd                         |
      | Contact                  | serviceDelivery.contact           |
      | Service provider         | serviceDelivery.serviceProvider   |
      | Service                  | serviceDelivery.service           |
      | Subject                  | serviceDelivery.subject           |
      | Notes                    | serviceDelivery.notes             |
      | Date of service delivery | serviceDelivery.date              |
      | DIT adviser              | serviceDelivery.ditAdviser        |
      | Event                    | serviceDelivery.event             |
      | Documents                | There are no files or documents   |

  @interaction-add--companies-service-delivery-tap-service-optional-complete-submit
  Scenario: Companies service delivery is saved

    Given I navigate to company fixture Venus Ltd
    When I click the Interactions local nav link
    And I click the "Add interaction" link
    And I select service delivery
    Then there are service delivery fields
    And interaction fields are pre-populated
    When a service delivery is added
      | key             | value                                    |
      | Service         | Trade - Tradeshow Access Programme (TAP) |
      | Service status  | Offered                                  |
      | Grant offered   | 100000                                   |
    Then I see the success message
    And the details are displayed
      | key                      | value                             |
      | Company                  | Venus Ltd                         |
      | Contact                  | serviceDelivery.contact           |
      | Service provider         | serviceDelivery.serviceProvider   |
      | Service                  | serviceDelivery.service           |
      | Service status           | serviceDelivery.serviceStatus     |
      | Grant offered            | £100,000.00                       |
      | Subject                  | serviceDelivery.subject           |
      | Notes                    | serviceDelivery.notes             |
      | Date of service delivery | serviceDelivery.date              |
      | DIT adviser              | serviceDelivery.ditAdviser        |
      | Event                    | serviceDelivery.event             |
      | Documents                | There are no files or documents   |

  @interaction-add--companies-service-delivery-tap-service-optional-empty-submit
  Scenario: Companies service delivery is saved

    Given I navigate to company fixture Venus Ltd
    When I click the Interactions local nav link
    And I click the "Add interaction" link
    And I select service delivery
    Then there are service delivery fields
    And interaction fields are pre-populated
    When a service delivery is added
      | key             | value                                    |
      | Service         | Trade - Tradeshow Access Programme (TAP) |
    Then I see the success message
    And the details are displayed
      | key                      | value                             |
      | Company                  | Venus Ltd                         |
      | Contact                  | serviceDelivery.contact           |
      | Service provider         | serviceDelivery.serviceProvider   |
      | Service                  | serviceDelivery.service           |
      | Subject                  | serviceDelivery.subject           |
      | Notes                    | serviceDelivery.notes             |
      | Date of service delivery | serviceDelivery.date              |
      | DIT adviser              | serviceDelivery.ditAdviser        |
      | Event                    | serviceDelivery.event             |
      | Documents                | There are no files or documents   |

  @interaction-add--contacts-interaction-submit
  Scenario: Interaction fields from contacts

    Given I navigate to company fixture Venus Ltd
    When I click the Interactions local nav link
    And I click the "Add interaction" link
    And I select interaction
    Then there are interaction fields
    And interaction fields are pre-populated
    When an interaction is added
    Then I see the success message
    And the details are displayed
      | key                      | value                             |
      | Company                  | Venus Ltd                         |
      | Contact                  | interaction.contact               |
      | Service provider         | interaction.serviceProvider       |
      | Service                  | interaction.service               |
      | Subject                  | interaction.subject               |
      | Notes                    | interaction.notes                 |
      | Date of interaction      | interaction.date                  |
      | DIT adviser              | interaction.ditAdviser            |
      | Communication channel    | interaction.communicationChannel  |
      | Documents                | There are no files or documents   |

  @interaction-add--contacts-service-delivery-submit
  Scenario: Service delivery fields from contacts

    Given I navigate to company fixture Venus Ltd
    When I click the Interactions local nav link
    And I click the "Add interaction" link
    And I select service delivery
    Then there are service delivery fields
    And interaction fields are pre-populated
    When a service delivery is added
      | key             | value                                    |
    Then I see the success message
    And the details are displayed
      | key                      | value                             |
      | Company                  | Venus Ltd                         |
      | Contact                  | serviceDelivery.contact           |
      | Service provider         | serviceDelivery.serviceProvider   |
      | Service                  | serviceDelivery.service           |
      | Subject                  | serviceDelivery.subject           |
      | Notes                    | serviceDelivery.notes             |
      | Date of service delivery | serviceDelivery.date              |
      | DIT adviser              | serviceDelivery.ditAdviser        |
      | Event                    | serviceDelivery.event             |
      | Documents                | There are no files or documents   |

  @interaction-add--investment-projects-interaction-submit
  Scenario: Interaction fields from investment projects

    Given I navigate to investment project fixture New rollercoaster
    When I click the Interactions local nav link
    And I click the "Add interaction" link
    Then there are interaction fields
    And interaction fields are pre-populated
    When an interaction is added
    Then I see the success message
    And the details are displayed
      | key                      | value                             |
      | Company                  | Venus Ltd                         |
      | Contact                  | interaction.contact               |
      | Service provider         | interaction.serviceProvider       |
      | Service                  | interaction.service               |
      | Subject                  | interaction.subject               |
      | Notes                    | interaction.notes                 |
      | Date of interaction      | interaction.date                  |
      | DIT adviser              | interaction.ditAdviser            |
      | Investment project       | New rollercoaster                 |
      | Communication channel    | interaction.communicationChannel  |
      | Documents                | There are no files or documents   |

  @interactions-add--events-toggle
  Scenario: Toggle service delivery event association

    Given I navigate to company fixture Venus Ltd
    When I click the Interactions local nav link
    And I click the "Add interaction" link
    And I select service delivery
    Then there are service delivery fields
    When the interaction events Yes option is chosen
    Then the interaction events is displayed
    When the interaction events No option is chosen
    Then the interaction events is not displayed


  @interactions-add--service-toggle
  Scenario: Toggle service delivery service fields

    Given I navigate to company fixture Venus Ltd
    When I click the Interactions local nav link
    And I click the "Add interaction" link
    And I select service delivery
    Then there are service delivery fields
    When I change form dropdown "service" to Tradeshow Access Programme (TAP)
    Then the service fields are visible
    When I change form dropdown "service" to Trade - Enquiry
    Then the service fields are hidden
