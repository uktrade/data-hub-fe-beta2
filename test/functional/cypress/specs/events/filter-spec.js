const selectors = require('../../../../selectors')

describe('Events Collections Filter', () => {
  before(() => {
    cy.visit('/events')
    cy.get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 7)
    cy.get(selectors.entityCollection.collection).should('contain', '7 events')
  })

  beforeEach(() => {
    cy.intercept('/events?*').as('filterResults')
  })

  it('should filter by country', () => {
    const country = selectors.filter.events.country
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
        'address_country=80756b9a-5d95-e211-a939-e4115bead28a'
      )
    })
  })

  it('should filter by name', () => {
    cy.get(selectors.filter.name).type('FilterByEvent').type('{enter}')

    cy.get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 1)
    cy.get(selectors.entityCollection.collection).should(
      'contain',
      '1 event matching FilterByEvent'
    )
    cy.get(selectors.entityCollection.collectionRowButton).should('be.visible')
  })

  it('should filter by uk region', () => {
    const { typeahead } = selectors.filter
    const { ukRegion } = selectors.filter.events
    cy.get(typeahead(ukRegion).selectedOption)
      .click()
      .get(typeahead(ukRegion).textInput)
      .type('North East')
      .get(typeahead(ukRegion).options)
      .should('have.length', 1)
      .get(typeahead(ukRegion).textInput)
      .type('{enter}')
      .type('{esc}')

    cy.wait('@filterResults').then((xhr) => {
      expect(xhr.response.url).to.contain(
        'uk_region=814cd12a-6095-e211-a939-e4115bead28a'
      )
    })

    cy.get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 1)
  })

  it('should remove all filters', () => {
    cy.get(selectors.entityCollection.collectionRemoveAllFilter).click()
    cy.get(selectors.entityCollection.collection).should('contain', '7 events')
  })
})
