const {
  assertTabbedLocalNav,
  assertLocalHeader,
  assertBreadcrumbs,
} = require('../../support/assertions')
const fixtures = require('../../fixtures')
const { investments } = require('../../../../../src/lib/urls')

describe('UK Opportunity', () => {
  before(() => {
    cy.visit(investments.opportunities.details(fixtures.investment.stageWon.id))
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

  it('should render the local navigation', () => {
    assertTabbedLocalNav('Details')
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
    cy.get('#opportunities').should('contain', '7 fields required')
    cy.get('#opportunities').should('contain', 'Completed')
  })
})
