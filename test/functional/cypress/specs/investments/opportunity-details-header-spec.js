const {
  assertLocalHeader,
  assertBreadcrumbs,
} = require('../../support/assertions')
const fixtures = require('../../fixtures')
const { investments } = require('../../../../../src/lib/urls')
const { cy } = require('date-fns/locale')

describe('UK Opportunity details header with missing data', () => {
  before(() => {
    cy.visit(
      investments.opportunities.details(
        fixtures.investment.completeOpportunity.id
      )
    )
  })

  it('should render the header', () => {
    assertLocalHeader('Battersea power station regeneration')
  })

  it('should render breadcrubs', () => {
    assertBreadcrumbs({
      Home: '/',
      investments: '/investments',
      'UK Opportunities': 'Battersea power station regeneration',
    })
  })

  it('should display investment opportunity name', () => {
    cy.contains('h1', 'Battersea power station regeneration')
  })

  it('should display opportunity high level details', () => {
    cy.get('label').eq(0).should('contain', 'Status')
    cy.get('label').eq(1).should('contain', 'Value')
    cy.get('label').eq(2).should('contain', 'UK location')
    cy.get('label').eq(3).should('contain', 'Asset Value')
    cy.get('label').eq(4).should('contain', 'Created on')
  })
  
})