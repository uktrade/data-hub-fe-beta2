@events-save
Feature: Save a new Event in Data hub
  As an Event organiser
  I would like to add an event record to data hub
  So that I can enable the collection of key events data

  Background:
    Given I am an authenticated user on the data hub website

  @events-save--submit
  Scenario: Verify event is submitted

    When I create an event
    Then I see the success message

  @events-save--mandatory-fields
  Scenario: Verify event mandatory fields

    And I navigate to the event list page
    When I click the add an event link
    And I click the save button
    Then the event fields have error messages
    And I see form error summary

  @events-save--uk-region
  Scenario: Verify event UK region mandatory field

    And I navigate to the event list page
    When I click the add an event link
    When I populate the create event form with United Kingdom and without a region
    And I click the save button
    And I verify the event UK region has an error message
    Then I see form error summary


