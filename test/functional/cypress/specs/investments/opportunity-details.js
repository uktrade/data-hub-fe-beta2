const {
  assertLocalHeader,
  assertBreadcrumbs,
} = require('../../support/assertions')
const fixtures = require('../../fixtures')
const { investments } = require('../../../../../src/lib/urls')

describe('UK Opportunity with missing data', () => {
  before(() => {
    cy.visit(
      investments.opportunities.details(
        fixtures.investment.incompleteOpportunity.id
      )
    )
  })

  it('should render the header', () => {
    assertLocalHeader('UK Opportunities')
  })

  it('should render breadcrumbs', () => {
    assertBreadcrumbs({
      Home: '/',
      Investments: '/investments',
      'UK Opportunities': null,
    })
  })

  it('should display opportunity toggles', () => {
    cy.get('#opportunity_details_toggle').should(
      'contain',
      'Opportunity details'
    )
    cy.get('#opportunity_requirements_toggle').should(
      'contain',
      'Opportunity requirements'
    )
    cy.get('#opportunity_delete_toggle').should(
      'contain',
      'Need to delete this opportunity?'
    )
  })

  it('should display required field tags', () => {
    cy.get('#opportunity-details').should('contain', '7 fields required')
    cy.get('#opportunity-details').should('contain', '3 fields required')
  })

  it('should display the Edit button', () => {
    cy.visit(
      investments.opportunities.details(
        fixtures.investment.completeOpportunity.id
      )
    )
    cy.get('#opportunity-details').should('contain', 'Edit')
  })
})

describe('UK Opportunity with complete data', () => {
  before(() => {
    cy.visit(
      investments.opportunities.details(
        fixtures.investment.completeOpportunity.id
      )
    )
  })

  it('should display required field tags', () => {
    cy.get('#opportunity-details').should('contain', 'Complete')
    cy.get('#opportunity-details').should('contain', 'Complete')
  })

  it('should display the Edit button', () => {
    cy.visit(
      investments.opportunities.details(
        fixtures.investment.completeOpportunity.id
      )
    )
    cy.get('#opportunity-details').should('contain', 'Edit')
  })
})

describe('UK Opportunity edit details functionality', () => {
  before(() => {
    cy.visit(
      investments.opportunities.details(
        fixtures.investment.incompleteOpportunity.id
      )
    )
  })

  it('Should display the edit details form and submit the new data', () => {
    cy.get(
      '#opportunity_details_toggle > div > [data-test="toggle-section-button"]'
    ).click()
    cy.contains('Edit').click()
    cy.get('#name').type('Egg Shop')
    cy.get('#description').type('A very good description')
    cy.get('#opportunityValue').type('123456')
    cy.contains('Submit').click()
    cy.intercept(
      `PATCH', '/v4/large-capital-opportunity/${fixtures.investment.incompleteOpportunity.id}`,
      (req) => {
        expect(req.body).to.include('Egg Shop')
        expect(req.body).to.include('A very good description')
        expect(req.body).to.include('123456')
      }
    )
    cy.get('#opportunity-details').should('contain', 'Edit')
  })
})
