const {
  assertLocalHeader,
  assertBreadcrumbs,
} = require('../../support/assertions')
const fixtures = require('../../fixtures')
const { investments } = require('../../../../../src/lib/urls')
var companies = require('../../../../sandbox/fixtures/v4/company/companies.json')

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
    cy.get('#opportunity-details').should('contain', '7 fields incomplete')
    cy.get('#opportunity-details').should('contain', '3 fields incomplete')
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
    cy.intercept('GET', '/api-proxy/v4/company', {
      body: companies,
    }).as('apiRequest')
  })

  it('Should display the edit details form and submit the new data', () => {
    cy.get(
      '#opportunity_details_toggle > div > [data-test="toggle-section-button"]'
    ).click()
    cy.contains('Edit').click()
    cy.get('#name').type('A great opportunity')
    cy.get('#description').type('A very good description')
    cy.get('[data-test=uk-region-location-field-0]').selectTypeaheadOption(
      'East of England'
    )
    cy.get('[data-test=promoters-field-0]').selectTypeaheadOption('Block Ltd')
    cy.contains('Has this opportunity cleared the required checks?')
      .next()
      .find('input')
      .check('02d6fc9b-fbb9-4621-b247-d86f2487898e')
    cy.get('#requiredChecksConductedOn\\.day').type('01')
    cy.get('#requiredChecksConductedOn\\.month').type('01')
    cy.get('#requiredChecksConductedOn\\.year').type('2021')
    cy.contains('Person responsible for most recent checks')
      .parent()
      .selectTypeaheadOption('Violet Roy')
    cy.contains('Construction risk')
      .next()
      .find('input')
      .check('79cc3963-9376-4771-9cba-c1b3cc0ade33')
    cy.contains('Lead DIT relationship manager')
      .parent()
      .selectTypeaheadOption('Violet Roy')
    cy.get('[data-test=other-dit-contact-field-0]').selectTypeaheadOption(
      'Lottie Salazar'
    )
    cy.contains('Value').next().find('input').check('CapEx')
    cy.get('#opportunityValue').type('123456')
    cy.contains('Asset classes')
      .parent()
      .selectTypeaheadOption('Direct Heating')
      .selectTypeaheadOption('Biomass')
    cy.contains('Submit').click()
    cy.intercept(
      `PATCH', '/v4/large-capital-opportunity/${fixtures.investment.incompleteOpportunity.id}`,
      (req) => {
        expect(req.body).to.include('A great opportunity')
        expect(req.body).to.include('A very good description')
        expect(req.body).to.include('[864cd12a-6095-e211-a939-e4115bead28a]')
        expect(req.body).to.include('[6f6a4c1a-dbc5-4a03-ba21-972c034e7df1]')
        expect(req.body).to.include('[02d6fc9b-fbb9-4621-b247-d86f2487898e]')
        expect(req.body).to.include('2021-01-01')
        expect(req.body).to.include('[3442c516-9898-e211-a939-e4115bead28a]')
        expect(req.body).to.include('[79cc3963-9376-4771-9cba-c1b3cc0ade33]')
        expect(req.body).to.include('[3442c516-9898-e211-a939-e4115bead28a]')
        expect(req.body).to.include('[9fd3a7a4-9798-e211-a939-e4115bead28a]')
        expect(req.body).to.include('123456')
        expect(req.body).to.include(
          '[bfab8ff2-e9bb-4fc8-b36c-5adddf8286b0, f2b6c1a7-4d4f-4fd9-884b-5e1f5b3525be]'
        )
      }
    )
    cy.get('#opportunity-details').should('contain', 'Edit')
  })
})
