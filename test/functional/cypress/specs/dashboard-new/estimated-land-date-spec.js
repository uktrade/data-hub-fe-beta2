import {
  addDays,
  formatWithoutParsing,
  subtractDays,
} from '../../../../../src/client/utils/date-utils'
import { investmentProjectFaker } from '../../fakers/investment-projects'

const assertEstimatedLandDate = ({ index, date, countdown, colour }) => {
  cy.get('@projectListItems')
    .eq(index)
    .find('[data-test="project-details"]')
    .click()
    .find('[data-test="estimated-land-date"]')
    .as('estimatedLandDate')
    .should('have.css', 'background-color', colour)

  cy.get('@estimatedLandDate')
    .find('[data-test="estimated-land-date-countdown"]')
    .should('have.text', countdown)

  cy.get('@estimatedLandDate')
    .find('[data-test="estimated-land-date-date"]')
    .should('have.text', formatWithoutParsing(date, 'E, dd MMM yyyy'))
}

describe('Dashboard items - estimated land date', () => {
  const today = new Date()
  const myProjects = [
    subtractDays(today, 14),
    today,
    addDays(today, 29),
    addDays(today, 89),
    addDays(today, 90),
  ].map((estimated_land_date) =>
    investmentProjectFaker({ estimated_land_date })
  )

  before(() => {
    cy.setUserFeatures(['personalised-dashboard'])
    cy.visit('/')
  })

  beforeEach(() => {
    cy.intercept('POST', '/api-proxy/v3/search/investment_project', {
      body: {
        count: myProjects.length,
        results: myProjects,
      },
    }).as('apiRequest')
    cy.visit('/')
    cy.wait('@apiRequest')
    cy.get('[data-test="projects-list-item"]').as('projectListItems')
  })

  after(() => {
    cy.resetUser()
  })

  context('My project list items - estimated land date', () => {
    it('should show a grey panel when the project has under 0 days remaining', () => {
      assertEstimatedLandDate({
        index: 0,
        date: subtractDays(new Date(), 14),
        countdown: '-14 days',
        colour: 'rgba(191, 193, 195, 0.5)',
      })
    })

    it('should show a red panel when the project has 0 days remaining', () => {
      assertEstimatedLandDate({
        index: 1,
        date: new Date(),
        countdown: '0 days',
        colour: 'rgba(212, 53, 28, 0.4)',
      })
    })

    it('should show a red panel when the project has less than 30 days remaining', () => {
      assertEstimatedLandDate({
        index: 2,
        date: addDays(new Date(), 29),
        countdown: '29 days',
        colour: 'rgba(212, 53, 28, 0.4)',
      })
    })

    it('should show an amber panel when the project has between 30 and 89 days remaining', () => {
      assertEstimatedLandDate({
        index: 3,
        date: addDays(new Date(), 89),
        countdown: '89 days',
        colour: 'rgba(255, 221, 0, 0.5)',
      })
    })

    it('should show a green panel when the project has more than 89 days remaining', () => {
      assertEstimatedLandDate({
        index: 4,
        date: addDays(new Date(), 90),
        countdown: '90 days',
        colour: 'rgba(0, 112, 60, 0.3)',
      })
    })
  })
})
