@companies-documents @details
Feature: Company documents

  @companies-documents--document-link
  Scenario: Company has documents
    When I navigate to the `companies.documents` page using `company` `Venus Ltd` fixture
    Then I should see the "View files and documents" link

  @companies-documents--no-document-link
  Scenario: Company does not have documents
    When I navigate to the `companies.documents` page using `company` `Lambda plc` fixture
    Then I should not see the "View files and documents" link

  @companies-documents--lep @lep
  Scenario: Navigate to documents as LEP
    When I navigate to the `companies.documents` page using `company` `Lambda plc` fixture
    Then I see the 403 error page

  @companies-documents--da @da
  Scenario: Navigate to documents as DA
    When I navigate to the `companies.documents` page using `company` `Lambda plc` fixture
    Then I see the 403 error page
