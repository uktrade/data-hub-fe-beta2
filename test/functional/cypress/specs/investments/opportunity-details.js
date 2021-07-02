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
    cy.findByText('Opportunity details').should('exist')
    cy.findByText('Opportunity requirements').should('exist')
    cy.findByText('Need to delete this opportunity?').should('exist')
  })

  it('should display required field tags', () => {
    cy.findByText('7 fields required').should('exist')
    cy.findByText('3 fields required').should('exist')
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
    cy.findAllByText('Completed').should('exist')
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
    cy.findByText('Opportunity details').click()
    cy.contains('Edit').click()
    cy.findByLabelText('Opportunity name').type('Egg Shop')
    cy.findByLabelText('Opportunity description').type(
      'A very good description'
    )
    cy.findByLabelText('Gross development value (GDV)').type('123456')
    cy.findByRole('button', { name: 'Submit' }).click()
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
