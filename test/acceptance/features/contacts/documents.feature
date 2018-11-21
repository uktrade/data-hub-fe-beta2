@contact-documents  @details
Feature: Contact details

  @contact-documents--link
  Scenario: Contact has Documents link
    When I navigate to the `contacts.documents` page using `contact` `Johnny Cakeman` fixture
    Then I should see the "View files and documents" link

  @contact-documents--no-documents-link
  Scenario: Contact does not have Documents link
    When I navigate to the `contacts.documents` page using `contact` `Georgina Clark` fixture
    Then I should not see the "View files and documents" link

  @contact-documents--lep @lep
  Scenario: Navigate to documents as LEP
    When I navigate to the `contacts.documents` page using `contact` `Johnny Cakeman` fixture
    Then I see the 403 error page

  @contact-documents--da @da
  Scenario: Navigate to documents as DA
    When I navigate to the `contacts.documents` page using `contact` `Johnny Cakeman` fixture
    Then I see the 403 error page
