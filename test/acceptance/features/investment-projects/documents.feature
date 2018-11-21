@investment-projects-documents @details
Feature: Investment project documents

  @investment-projects-documents--document-link
  Scenario: Investment project has documents
    When I navigate to the `investments.documents` page using `investment project` `New hotel (commitment to invest)` fixture
    Then I should see the "View files and documents" link

  @investment-projects-documents--no-document-link
  Scenario: Investment project does not have documents
    When I navigate to the `investments.documents` page using `investment project` `New rollercoaster` fixture
    Then I should not see the "View files and documents" link

  @investment-projects-documents--lep @lep
  Scenario: Navigate to documents as LEP
    When I navigate to the `investments.documents` page using `investment project` `New zoo (LEP)` fixture
    Then I see the 403 error page

  @investment-projects-documents--da @da
  Scenario: Navigate to documents as DA
    When I navigate to the `investments.documents` page using `investment project` `New golf course (DA)` fixture
    Then I see the 403 error page
