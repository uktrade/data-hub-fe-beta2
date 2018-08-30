@investment-projects-team @collection
Feature: View team for an investment project

  @investment-projects-team--view
  Scenario: View investment project team
    When I navigate to the `investments.team` page using `investment project` `Fancy dress manufacturing` fixture
    Then the Client relationship management data details are displayed
      | Role                        | Adviser                                          | Team                                             |
      | Client relationship manager | investmentProject.clientRelationshipManager.name | investmentProject.clientRelationshipManager.team |
      | Global Account Manager      | investmentProject.globalAccountManager.name      |                                                  |

  @investment-projects-team--view--lep @lep
  Scenario: View investment project team
    When I navigate to the `investments.team` page using `investment project` `New zoo (LEP)` fixture
    Then the Client relationship management data details are displayed
      | Role                        | Adviser                                          | Team                                             |
      | Client relationship manager | investmentProject.clientRelationshipManager.name | investmentProject.clientRelationshipManager.team |

  @investment-projects-team--view--da @da
  Scenario: View investment project team
    When I navigate to the `investments.team` page using `investment project` `New golf course (DA)` fixture
    Then the Client relationship management data details are displayed
      | Role                        | Adviser                                          | Team                                             |
      | Client relationship manager | investmentProject.clientRelationshipManager.name | investmentProject.clientRelationshipManager.team |

  @investment-projects-team--lep @lep
  Scenario: Navigate to project team of an unauthorised project as LEP
    When I navigate to the `investments.team` page using `investment project` `Fancy dress manufacturing` fixture
    Then I see the 403 error page

  @investment-projects-team--da @da
  Scenario: Navigate to project team of an unauthorised project as DA
    When I navigate to the `investments.team` page using `investment project` `Fancy dress manufacturing` fixture
    Then I see the 403 error page
