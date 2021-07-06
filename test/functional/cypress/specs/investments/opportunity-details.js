const {
  assertLocalHeader,
  assertBreadcrumbs,
} = require('../../support/assertions')
const fixtures = require('../../fixtures')
const { investments } = require('../../../../../src/lib/urls')
var companies = require('../../../../sandbox/fixtures/v4/company/companies.json')

const UK_REGION_ID = '864cd12a-6095-e211-a939-e4115bead28a'
const PROMOTER_ID = '6f6a4c1a-dbc5-4a03-ba21-972c034e7df1'
const CLEARED_CHECKS_ID = '02d6fc9b-fbb9-4621-b247-d86f2487898e'
const CONDUCTED_BY_ID = '3442c516-9898-e211-a939-e4115bead28a'
const CONSTRUCTION_RISK_ID = '79cc3963-9376-4771-9cba-c1b3cc0ade33'
const RELATIONSHIP_MANAGER_ID = '3442c516-9898-e211-a939-e4115bead28a'
const OTHER_DIT_CONTACT_ID = '9fd3a7a4-9798-e211-a939-e4115bead28a'
const ASSET_CLASS_DIRECT_HEATING = 'bfab8ff2-e9bb-4fc8-b36c-5adddf8286b0'
const ASSET_CLASS_BIOMASS = 'f2b6c1a7-4d4f-4fd9-884b-5e1f5b3525be'

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
      .check(CLEARED_CHECKS_ID)
    cy.get('#requiredChecksConductedOn\\.day').type('01')
    cy.get('#requiredChecksConductedOn\\.month').type('01')
    cy.get('#requiredChecksConductedOn\\.year').type('2021')
    cy.contains('Person responsible for most recent checks')
      .parent()
      .selectTypeaheadOption('Violet Roy')
    cy.contains('Construction risk')
      .next()
      .find('input')
      .check(CONSTRUCTION_RISK_ID)
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
        expect(req.body).to.include(UK_REGION_ID)
        expect(req.body).to.include(PROMOTER_ID)
        expect(req.body).to.include(CLEARED_CHECKS_ID)
        expect(req.body).to.include('2021-01-01')
        expect(req.body).to.include(CONDUCTED_BY_ID)
        expect(req.body).to.include(CONSTRUCTION_RISK_ID)
        expect(req.body).to.include(RELATIONSHIP_MANAGER_ID)
        expect(req.body).to.include(OTHER_DIT_CONTACT_ID)
        expect(req.body).to.include('123456')
        expect(req.body).to.include(
          ASSET_CLASS_DIRECT_HEATING,
          ASSET_CLASS_BIOMASS
        )
      }
    )
    cy.get('#opportunity-details').should('contain', 'Edit')
  })
})
