@event-attendees
Feature: Event attendees

@event-attendees--collection-list
Scenario: Event lists attendees
  When I navigate to the `events.attendees` page using `event` `Grand exhibition` fixture
  And the results summary for an attendee collection is present
  And I can view the collection

@event-attendees-add-attendee
Scenario: Add/Remove event attendance at an event
  Given I create an event
  And I submit the form
  Then I see the success message
  When I click the "Attendees" link
  And I click the "Add attendee" link
  Then I see a search box
  When I search for "Dean Cox"
  Then I see "Dean Cox" in the search results
  When I select "Dean Cox" in the search results
  Then the results summary for an attendee collection is present
  And I see "Dean Cox" in the collection
  When I click the "View or edit service delivery" link
  Then I see the service delivery details

@event-attendees-disable-add-event
Scenario: Hide the add attendee button for disabled events
  When I navigate to the `events.attendees` page using `event` `Teddy bear expo` fixture
  And the results summary for an attendee collection is present
  And I should not see the "Add attendee" button
