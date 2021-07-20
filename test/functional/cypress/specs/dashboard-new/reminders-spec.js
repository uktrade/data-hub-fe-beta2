import {
  addDays,
  formatWithoutParsing,
} from '../../../../../src/client/utils/date-utils'
import faker from 'faker'
import urls from '../../../../../src/lib/urls'
import {
  propositionFaker,
  propositionListFaker,
} from '../../fakers/propositions'

describe('Dashboard reminders', () => {
  const tomorrow = addDays(new Date(), 1)
  const proposition1 = propositionFaker({
    name: 'University Proposition',
    investment_project: {
      name: 'University buildings',
      project_code: 'DHP-00007004',
      id: faker.datatype.uuid(),
    },
    deadline: tomorrow,
  })
  const myPropositions = [proposition1, ...propositionListFaker(2)]

  before(() => {
    cy.setUserFeatures(['personalised-dashboard'])
  })

  after(() => {
    cy.resetUser()
  })

  beforeEach(() => {
    cy.get('[data-test="investment-reminders"]').as('investmentReminders')
    cy.get('[data-test="investment-reminders-section"]')
      .as('investmentRemindersSection')
      .find('[data-test="toggle-section-button"]')
      .as('investmentRemindersToggleButton')
      .find('[data-test="toggle-section-button-content"]')
      .as('investmentRemindersHeading')
  })

  context('View reminders', () => {
    before(() => {
      cy.intercept('GET', '/api-proxy/v4/proposition*', {
        body: {
          count: myPropositions.length,
          results: myPropositions,
        },
      }).as('apiRequest')
      cy.visit('/')
      cy.wait('@apiRequest')
    })

    beforeEach(() => {
      cy.get('[data-test="outstanding-propositions"]')
        .as('outstandingPropositions')
        .find('[data-test="outstanding-propositions-list"]')
        .as('outstandingPropositionsList')
      cy.get('[data-test="notification-badge"]').as('notificationBadge')
    })

    it('should contain a notification badge in the reminders heading', () => {
      cy.get('@investmentRemindersHeading').should('contain.text', 'Reminders')
      cy.get('@notificationBadge').should('have.text', '3')
    })

    it('should contain elements in the correct order', () => {
      cy.get('@investmentReminders')
        .find('[data-test="outstanding-propositions"]')
        .should('have.length', 1)
        .find('[data-test="outstanding-propositions-list"]')
        .should('have.length', 1)
    })

    it('should contain a heading', () => {
      cy.get('[data-test="outstanding-propositions-heading"]')
        .should('have.text', 'Outstanding propositions (3)')
        .should('have.css', 'color', 'rgb(212, 53, 28)')
    })

    it('should display each of the outstanding propositions', () => {
      cy.get('@outstandingPropositionsList')
        .find('li')
        .should('have.length', '3')
        .first()
        .as('outstandingProposition')

      cy.get('@outstandingProposition')
        .find('a')
        .should('have.text', proposition1.name)
        .should(
          'have.attr',
          'href',
          urls.investments.projects.propositions(
            proposition1.investment_project.id
          )
        )

      cy.get('@outstandingProposition')
        .find('[data-test="outstanding-proposition-project-code"]')
        .should('have.text', proposition1.investment_project.project_code)

      cy.get('@outstandingProposition')
        .find('[data-test="outstanding-proposition-deadline"]')
        .should(
          'have.text',
          `Due ${formatWithoutParsing(tomorrow, 'E, dd MMM yyyy')}`
        )

      cy.get('@outstandingProposition')
        .find('[data-test="outstanding-proposition-countdown"]')
        .should('have.text', '1 day')
    })
  })

  context('View empty reminders', () => {
    before(() => {
      cy.intercept('GET', '/api-proxy/v4/proposition*', {
        body: {
          count: 0,
          results: [],
        },
      }).as('apiRequest')
      cy.visit('/')
      cy.wait('@apiRequest')
    })

    it('should contain a heading', () => {
      cy.get('[data-test="outstanding-propositions-empty"]')
        .should(
          'have.text',
          'Projects with propositions due will be displayed here.'
        )
        .should('have.css', 'color', 'rgb(80, 90, 95)')
    })

    it('should not contain a notification badge in the reminders heading', () => {
      cy.get('[data-test="investment-reminders-section"]')
        .find('[data-test="notification-badge"]')
        .should('not.exist')
    })

    it('should not contain a list', () => {
      cy.get('[data-test="outstanding-propositions-list"]').should('not.exist')
    })
  })

  context('Toggle section', () => {
    before(() => {
      cy.visit('/')
    })

    it('should be in a togglable section that starts opened', () => {
      cy.get('@investmentReminders').should('be.visible')
      cy.get('@investmentRemindersToggleButton').click()
      cy.get('@investmentReminders').should('not.be.visible')
      cy.get('@investmentRemindersToggleButton').click()
      cy.get('@investmentReminders').should('be.visible')
    })
  })
})
