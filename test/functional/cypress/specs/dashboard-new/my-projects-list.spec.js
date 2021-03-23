const urls = require('../../../../../src/lib/urls')

const projectID = '5d341b34-1fc8-4638-b4b1-a0922ebf401e'
const companyID = '0f5216e0-849f-11e6-ae22-56b6b6499611'

describe('Dashboard - My projects list', () => {
  beforeEach(() => {
    cy.setFeatureFlag(
      'layoutTesting:9010dd28-9798-e211-a939-e4115bead28a',
      true
    )
    cy.visit('/')
    cy.get('[data-test="tablist"] span:first-child button').click()
    cy.get('[data-test="projects-list-item"]').eq(0).as('firstListItem')
  })
  after(() => {
    cy.resetFeatureFlags()
  })
  it('should contain a project title which links to the project', () => {
    cy.get('@firstListItem')
      .find('[data-test="project-header"]')
      .should('have.text', 'New metro system (legacy project)')
      .find('a')
      .should('have.attr', 'href', urls.investments.projects.details(projectID))
  })
  it('should contain a status tag', () => {
    cy.get('@firstListItem')
      .find('[data-test="project-status-tag"]')
      .should('have.text', 'Won')
  })
  it('should contain a button to add an interaction', () => {
    cy.get('@firstListItem')
      .find('[data-test="add-interaction"]')
      .should('have.text', 'Add interaction')
      .should(
        'have.attr',
        'href',
        urls.companies.interactions.create(companyID)
      )
  })
})