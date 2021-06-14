const {
  assertLocalHeader,
  assertBreadcrumbs,
} = require('../../support/assertions')
const { investments } = require('../../../../../src/lib/urls')
const projectLandingBeforeApril = require('../../fixtures/investment/investment-land-date-before-April-2020.json')
const projectLandingAfterApril = require('../../fixtures/investment/investment-land-date-after-April-2020.json')
const projectNoLandingDates = require('../../fixtures/investment/investment-no-landing-dates.json')
const projectBothDatesBeforeApril = require('../../fixtures/investment/investment-both-land-dates-before-April-2020.json')
const projectBothDatesAfterApril = require('../../fixtures/investment/investment-both-land-dates-after-April-2020.json')
const projectOneLandDateEitherSideApril = require('../../fixtures/investment/investment-one-land-date-before-April-one-after.json')

describe('Edit the value details of a project', () => {
  context('When one land date is null and one is before 01/04/2020 ', () => {
    before(() => {
      cy.visit(investments.projects.details(projectLandingBeforeApril.id))
      cy.contains('Edit value').click()
    })
    it('should render the header', () => {
      assertLocalHeader(projectLandingBeforeApril.name)
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        Investments: '/investments',
        Projects: investments.projects.index(),
        [projectLandingBeforeApril.name]: investments.projects.project(
          projectLandingBeforeApril.id
        ),
        'Edit value': null,
      })
    })
    it('should display the Project Value field on the edit value page', () => {
      cy.contains('Project value').should('be.visible')
    })
  })
  context('When both dates are before 01/04/2020', () => {
    before(() => {
      cy.visit(investments.projects.details(projectBothDatesBeforeApril.id))
      cy.contains('Edit value').click()
    })
    it('should display the Project Value field on the edit value page', () => {
      cy.contains('label', 'Project value').should('be.visible')
    })
  })
  context('When one date is before 01/04/2020 and one is after', () => {
    before(() => {
      cy.visit(
        investments.projects.details(projectOneLandDateEitherSideApril.id)
      )
      cy.contains('Edit value').click()
    })
    it('should display the Project Value field on the edit value page', () => {
      cy.contains('label', 'Project value').should('be.visible')
    })
  })
  context('When one date is null and one date is after 01/04/2020', () => {
    before(() => {
      cy.visit(investments.projects.details(projectLandingAfterApril.id))
      cy.contains('Edit value').click()
    })
    it('should not display the Project Value field on the edit value page', () => {
      cy.contains('label', 'Project value').should('not.exist')
    })
  })
  context('When both dates are after 01/04/2020', () => {
    before(() => {
      cy.visit(investments.projects.details(projectBothDatesAfterApril.id))
      cy.contains('Edit value').click()
    })
    it('should not display the Project Value field on the edit value page', () => {
      cy.contains('label', 'Project value').should('not.exist')
    })
  })
  context('When both land date fields are empty', () => {
    before(() => {
      cy.visit(investments.projects.details(projectNoLandingDates.id))
      cy.contains('Edit value').click()
    })
    it('should not display the Project Value field on the edit value page', () => {
      cy.contains('label', 'Project value').should('not.exist')
    })
  })
})
