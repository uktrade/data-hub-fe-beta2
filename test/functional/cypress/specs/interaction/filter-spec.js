const selectors = require('../../../../selectors')

describe('Interactions Collections Filter', () => {
  before(() => {
    cy.visit('/interactions')
  })

  beforeEach(() => {
    cy.intercept('/interactions?*').as('filterResults')
  })

  it('should filter by sector', () => {
    const sector = selectors.filter.sector
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
})
