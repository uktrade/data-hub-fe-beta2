@audit-company @todo
Feature: View Audit history of a Company
  As an existing user
  I would like to track changes to a Company record over time
  So that I can cross-check the validity and accuracy of a given company record

  Scenario: View name of the person who made company record changes
    Given I Amend 1 records of an existing company record
    When I search for this company record
    And I click the "Audit history" link
    Then I see the name of the person who made the recent company record changes
    And I see the date time stamp when the recent company record changed
    And I see the field names that were recently changed on this company record
