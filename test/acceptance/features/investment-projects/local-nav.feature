@investment-projects-local-nav  @details
Feature: Investment projects local nav

  @investment-projects-local-nav
  Scenario: Investment projects local nav as DIT staff

    When I navigate to the `investments.fixture` page using `investment project` `New hotel (commitment to invest)` fixture
    Then there should be a local nav
      | text                      |
      | Project details           |
      | Project team              |
      | Interactions              |
      | Evaluations               |
      | Audit history             |
      | Documents                 |

  @investment-projects-local-nav--lep @lep
  Scenario: Investment projects local nav as LEP

    When I navigate to the `investments.fixture` page using `investment project` `New zoo (LEP)` fixture
    Then there should be a local nav
      | text                      |
      | Project details           |
      | Project team              |
      | Interactions              |
      | Evaluations               |
      | Audit history             |

  @investment-projects-local-nav--da @da
  Scenario: Investment projects local nav as DA

    When I navigate to the `investments.fixture` page using `investment project` `New golf course (DA)` fixture
    Then there should be a local nav
      | text                      |
      | Project details           |
      | Project team              |
      | Interactions              |
      | Evaluations               |
      | Audit history             |
