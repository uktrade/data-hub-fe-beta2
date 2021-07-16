const { investments } = require('../../../../../src/lib/urls')
const { assertPayload } = require('../../support/assertions')
const returnRates = require('../../../../sandbox/fixtures/metadata/capital-investment-return-rate.json')
const timeHorizons = require('../../../../sandbox/fixtures/metadata/capital-investment-time-horizons.json')
const investmentTypes = require('../../../../sandbox/fixtures/metadata/capital-investment-investment-types.json')
const completeOpportunity = require('../../../../sandbox/fixtures/v4/investment/large-capital-opportunity-complete.json')
const incompleteOpportunity = require('../../../../sandbox/fixtures/v4/investment/large-capital-opportunity-incomplete.json')

const expectedPayload = {
  current_investment_secured: '200',
  estimated_return_rate: returnRates[0].id,
  investment_types: [investmentTypes[0].id, investmentTypes[1].id],
  time_horizons: [timeHorizons[0].id],
  total_investment_sought: '100',
}

const navigateToForm = (opportunity) => {
  cy.visit(investments.opportunities.details(opportunity.id))
}

describe('A capital opportunity without existing requirements', () => {
  context('When editing an opportunity without existing requirements', () => {
    beforeEach(() => {
      navigateToForm(incompleteOpportunity)
      cy.get(
        '#opportunity_requirements_toggle > div > [data-test="toggle-section-button"]'
      ).click()
      cy.get('#opportunity_requirements_toggle')
        .contains('Edit')
        .should('be.visible')
      cy.get('#opportunity_requirements_toggle').contains('Edit').click()
    })
    it('should display the requirements form when you click "Edit"', () => {
      cy.get('form').should('be.visible')
    })
    it('should take user back to the table view if they click "Cancel"', () => {
      cy.contains('Cancel').click()
      cy.get(
        '#opportunity_requirements_toggle > div > [data-test="toggle-section-button"]'
      ).click()
      cy.get('table').should('be.visible')
    })
    it('should allow the form to be submitted with no fields filled in (all optional)', () => {
      cy.contains('Save').click()
      cy.get('table').should('be.visible')
    })
    it('should give an error if a non-numerical value is given for GBP value fields', () => {
      cy.get('#total_investment_sought').type('hello')
      cy.get('#current_investment_secured').type('hello')
      cy.contains('Save').click()
      cy.get('#form-errors').should('be.visible')
      cy.get('#form-errors').should(
        'contain',
        'Total investment sought value must be a number'
      )
      cy.get('#form-errors').should(
        'contain',
        'Investment secured so far value must be a number'
      )
      cy.get('#field-total_investment_sought').should(
        'contain',
        'Total investment sought value must be a number'
      )
      cy.get('#field-current_investment_secured').should(
        'contain',
        'Investment secured so far value must be a number'
      )
    })

    it('should allow the user to fill in all fields', () => {
      cy.intercept(
        'PATCH',
        `/api-proxy/v4/large-capital-opportunity/${incompleteOpportunity.id}`
      ).as('apiRequest')

      cy.get('#total_investment_sought').type('100')
      cy.get('#current_investment_secured').type('200')
      cy.get(`[name=${investmentTypes[0].id}]`).check()
      cy.get(`[name=${investmentTypes[1].id}]`).check()
      cy.get(`[value=${returnRates[0].id}]`).check()
      cy.get(`[value=${timeHorizons[0].id}]`).check()
      cy.contains('Save').click()
      assertPayload('@apiRequest', expectedPayload)
      cy.get('table').should('be.visible')
    })
  })

  context('When editing an opportunity with existing requirements', () => {
    before(() => {
      navigateToForm(completeOpportunity)
      cy.get(
        '#opportunity_requirements_toggle > div > [data-test="toggle-section-button"]'
      ).click()
      cy.get('#opportunity_requirements_toggle').contains('Edit').click()
    })
    it('should diplay existing values in the form', () => {
      cy.get('#total_investment_sought').should(
        'have.value',
        completeOpportunity.total_investment_sought
      )
      cy.get('#current_investment_secured').should(
        'have.value',
        completeOpportunity.current_investment_secured
      )
      completeOpportunity.investment_types.map((type) => {
        cy.get(`[name=${type.id}]`).should('be.checked')
      })
      cy.get(`[value=${completeOpportunity.estimated_return_rate.id}]`).should(
        'be.checked'
      )
      cy.get(`[value=${completeOpportunity.time_horizons[0].id}]`).should(
        'be.checked'
      )
    })
  })
})
