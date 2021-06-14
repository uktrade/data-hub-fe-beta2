import urls from '../../../../../src/lib/urls'
import {
  investmentProjectFaker,
  investmentProjectListFaker,
} from '../../fakers/investment-projects'
import { INVESTMENT_PROJECT_STAGES } from '../../fakers/constants'

describe('Dashboard - My projects list', () => {
  const project1 = investmentProjectFaker({
    stage: INVESTMENT_PROJECT_STAGES.active,
  })
  const otherProjects = investmentProjectListFaker(2)

  const myProjects = [project1, ...otherProjects]

  before(() => {
    cy.setUserFeatures(['personalised-dashboard'])
    cy.intercept('POST', '/api-proxy/v3/search/investment_project', {
      body: {
        count: myProjects.length,
        results: myProjects,
      },
    }).as('apiRequest')
    cy.visit('/')
    cy.wait('@apiRequest')
    cy.get('[data-test="tablist"] span:first-child button').click()
  })

  after(() => {
    cy.resetUser()
  })

  beforeEach(() => {
    cy.get('[data-test="projects-list-item"]').eq(0).as('firstListItem')
  })

  it('should contain a project title which links to the project', () => {
    cy.get('@firstListItem')
      .find('[data-test="project-header"]')
      .should('have.text', project1.name)
      .find('a')
      .should(
        'have.attr',
        'href',
        urls.investments.projects.details(project1.id)
      )
  })

  it('should contain a status tag', () => {
    cy.get('@firstListItem')
      .find('[data-test="project-stage-tag"]')
      .should('have.text', project1.stage.name)
  })

  it('should contain a button to view interactions', () => {
    cy.get('@firstListItem')
      .find('[data-test="add-interaction"]')
      .should('have.text', 'View interactions')
      .should(
        'have.attr',
        'href',
        urls.investments.projects.interactions.index(project1.id)
      )
  })
})
