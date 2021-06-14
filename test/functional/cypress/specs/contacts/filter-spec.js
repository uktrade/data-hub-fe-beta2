const selectors = require('../../../../selectors')

describe('Contacts Collections Filter', () => {
  before(() => {
    cy.visit('/contacts')
    cy.get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 1)
    cy.get(selectors.entityCollection.collection).should('contain', '1 contact')
  })

  beforeEach(() => {
    cy.intercept('/contacts?*').as('filterResults')
  })

  it('should default active contacts filter', () => {
    cy.url().should('include', 'archived=false')
  })

  it('should filter by contact name', () => {
    cy.get(selectors.filter.name).type('FilterByContacts').type('{enter}')

    cy.get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 1)
    cy.get(selectors.entityCollection.collection).should(
      'contain',
      '1 contact matching FilterByContacts'
    )
    cy.get(selectors.entityCollection.collectionRowMessage).should(
      'contain',
      'You can now download this contact'
    )
    cy.get(selectors.entityCollection.collectionRowButton).should('be.visible')
  })

  it('should filter by company name', () => {
    cy.get(selectors.filter.contacts.companyName)
      .type('FilterByCompany')
      .type('{enter}')

    cy.wait('@filterResults').then((xhr) => {
      expect(xhr.response.url).to.contain('company_name=FilterByCompany')
    })

    cy.get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 1)
  })

  it('should filter by inactive status', () => {
    cy.get(selectors.filter.statusInactive).click()

    cy.wait('@filterResults').then((xhr) => {
      expect(xhr.response.url).to.contain('archived=true')
    })

    cy.get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 1)
  })

  it('should remove default active status filter', () => {
    cy.get(selectors.filter.statusActive).click()

    cy.wait('@filterResults').then((xhr) => {
      expect(xhr.response.url).not.to.contain('archived=false')
    })

    cy.get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 1)
  })

  it('should filter by sector', () => {
    const sector = selectors.filter.companies.sector
    const { typeahead } = selectors.filter
    cy.get(typeahead(sector).selectedOption)
      .click()
      .get(typeahead(sector).textInput)
      .type('Advanced Engineering')
      .get(typeahead(sector).options)
      .should('have.length', 1)
      .get(typeahead(sector).textInput)
      .type('{enter}')
      .type('{esc}')

    cy.wait('@filterResults').then((xhr) => {
      expect(xhr.response.url).to.contain(
        'sector_descends=af959812-6095-e211-a939-e4115bead28a'
      )
    })
  })

  it('should filter by country', () => {
    const country = selectors.filter.companies.country
    const { typeahead } = selectors.filter

    cy.get(typeahead(country).selectedOption)
      .click()
      .get(typeahead(country).textInput)
      .type('United Kingdom')
      .get(typeahead(country).options)
      .should('have.length', 1)
      .get(typeahead(country).textInput)
      .type('{enter}')
      .type('{esc}')

    cy.wait('@filterResults').then((xhr) => {
      expect(xhr.response.url).to.contain(
        'country=80756b9a-5d95-e211-a939-e4115bead28a'
      )
    })
  })

  it('should remove all filters', () => {
    cy.get(selectors.entityCollection.collectionRemoveAllFilter).click()
    cy.url().should('contain', 'custom=true&name=&company_name=')
  })

  it('should filter by uk region', () => {
    const { typeahead } = selectors.filter
    const { ukRegion } = selectors.filter.contacts
    cy.get(typeahead(ukRegion).selectedOption)
      .click()
      .get(typeahead(ukRegion).textInput)
      .type('North West')
      .get(typeahead(ukRegion).options)
      .should('have.length', 1)
      .get(typeahead(ukRegion).textInput)
      .type('{enter}')
      .type('{esc}')

    cy.wait('@filterResults').then((xhr) => {
      expect(xhr.response.url).to.contain(
        'uk_region=824cd12a-6095-e211-a939-e4115bead28a'
      )

      cy.get(selectors.entityCollection.entities)
        .children()
        .should('have.length', 5)
    })
  })
})
