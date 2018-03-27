@events-collection
Feature: View a list of events
  As an Event organiser
  I would like to view a list of events
  So search for events and filter and sort the results

  @events-collection--add
  Scenario: Add event

    When I click the Events global nav link
    And I click the "Add event" link
    Then I am taken to the "Add event" page

  @events-collection--view
  Scenario: View event collection

    When I navigate to the `events.list` page
    And I click the "Add event" link
    And I populate the create event form
    And I submit the form
    Then I see the success message
    When I navigate to the `events.list` page
    Then I can view the Event in the collection
      | text            | expected              |
      | Type            | event.event_type      |
      | Begins          | event.startDate       |
      | Ends            | event.endDate         |
      | Organiser       | event.organiser       |
      | Lead team       | event.lead_team       |
    And the Event has badges
      | text            | expected              |
      | Country         | event.address_country |
      | Region          | event.uk_region       |

  @events-collection--view-uk-region
  Scenario: View event uk region

    When I navigate to the `events.list` page
    And I click the "Add event" link
    And I populate the create event form with United Kingdom and a region
    And I submit the form
    Then I see the success message
    When I navigate to the `events.list` page
    Then I can view the Event in the collection
      | text            | expected              |
      | Type            | event.event_type      |
      | Begins          | event.startDate       |
      | Ends            | event.endDate         |
      | Organiser       | event.organiser       |
      | Lead team       | event.lead_team       |
    And the Event has badges
      | text            | expected              |
      | Country         | event.address_country |
      | Region          | event.uk_region       |

  @events-collection--filter
  Scenario: Filter event list

    When I click the Events global nav link
    And I click the "Add event" link
    And I populate the create event form
    And I submit the form
    Then I see the success message
    When I click the Events global nav link
    And I filter the events list by name
    Then I can view the event
    And I filter the events list by event type
    Then I can view the event
    And I filter the events list by country
    Then I can view the event
    And I filter the events list by start date
    Then I can view the event

  @events-collection--sort
  Scenario: Sort event list

    When I click the Events global nav link
    And I click the "Add event" link
    And I populate the create event form
    And I submit the form
    Then I see the success message
    When I click the Events global nav link
    And I click the "Add event" link
    And I populate the create event form
    And I submit the form
    Then I see the success message
    When I click the Events global nav link
    When I sort the events list name A-Z
    Then I see the list in A-Z alphabetical order
    And the results are sorted by Recently updated
    Then the results should be sorted by Recently updated
    And the results are sorted by Least recently updated
    Then the results should be sorted by Least recently updated

  @events-collection--lep @lep
  Scenario: Navigate to events shows 403 for LEPs

    When I navigate to the `events.list` page
    Then I see the 403 error page

  @events-collection--da @da
  Scenario: Navigate to events shows 403 for DAs

    When I navigate to the `events.list` page
    Then I see the 403 error page
