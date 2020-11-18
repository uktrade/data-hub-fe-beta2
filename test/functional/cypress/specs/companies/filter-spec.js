const selectors = require('../../../../selectors')

describe('Company Collections Filter', () => {
  before(() => {
    cy.visit('/companies?sortby=collectionTest')
    cy.get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 9)
    cy.get(selectors.entityCollection.collection).should(
      'contain',
      '100,172 companies'
    )
  })

  beforeEach(() => {
    cy.server()
    cy.route('/companies?*').as('filterResults')
  })

  it('should filter by name', () => {
    cy.get(selectors.filter.name).type('FilterByCompany').type('{enter}')

    cy.get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 1)
    cy.get(selectors.entityCollection.collection).should(
      'contain',
      '1 company matching FilterByCompany'
    )
    cy.get(selectors.entityCollection.collectionRowMessage).should(
      'contain',
      'You can now download this company'
    )
    cy.get(selectors.entityCollection.collectionRowButton).should('be.visible')
  })

  it('should filter by active status', () => {
    cy.get(selectors.filter.statusActive).click()

    cy.wait('@filterResults').then((xhr) => {
      expect(xhr.url).to.contain(
        '?sortby=collectionTest&custom=true&name=FilterByCompany&archived=false'
      )
    })

    cy.get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 1)
  })

  it('should filter by inactive status', () => {
    cy.get(selectors.filter.statusInactive).click()

    cy.wait('@filterResults').then((xhr) => {
      expect(xhr.url).to.contain(
        '?sortby=collectionTest&custom=true&name=FilterByCompany&archived=false&archived=true'
      )
    })

    cy.get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 1)
  })

  it('should filter by last interaction date', () => {
    cy.get(selectors.filter.firstInteractionDate).click()

    cy.wait('@filterResults').then((xhr) => {
      expect(xhr.url).to.contain('interaction_between=0')
    })

    cy.get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 1)
  })

  it('should remove all filters', () => {
    cy.get(selectors.entityCollection.collectionRemoveAllFilter).click()
    cy.get(selectors.entityCollection.collection).should(
      'contain',
      '100,172 companies'
    )
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
      expect(xhr.url).to.contain(
        'sector_descends=af959812-6095-e211-a939-e4115bead28a'
      )
    })
  })

  it('should filter by country', () => {
    const country = selectors.filter.country
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
      expect(xhr.url).to.contain('country=80756b9a-5d95-e211-a939-e4115bead28a')
    })
  })

  it('should filter by currently exporting to', () => {
    const exportingTo = selectors.filter.exportingTo
    const { typeahead } = selectors.filter

    cy.get(typeahead(exportingTo).selectedOption)
      .click()
      .get(typeahead(exportingTo).textInput)
      .type('Australia')
      .get(typeahead(exportingTo).options)
      .should('have.length', 1)
      .get(typeahead(exportingTo).textInput)
      .type('{enter}')
      .type('{esc}')

    cy.wait('@filterResults').then((xhr) => {
      expect(xhr.url).to.contain(
        'export_to_countries=9f5f66a0-5d95-e211-a939-e4115bead28a'
      )
    })
  })

  it('should filter by future countries of interest', () => {
    const interestedIn = selectors.filter.interestedIn
    const { typeahead } = selectors.filter

    cy.get(typeahead(interestedIn).selectedOption)
      .click()
      .get(typeahead(interestedIn).textInput)
      .type('Bahamas')
      .get(typeahead(interestedIn).options)
      .should('have.length', 1)
      .get(typeahead(interestedIn).textInput)
      .type('{enter}')
      .type('{esc}')

    cy.wait('@filterResults').then((xhr) => {
      expect(xhr.url).to.contain(
        'future_interest_countries=a25f66a0-5d95-e211-a939-e4115bead28a'
      )
    })
  })

  it('should filter by UK postcode', () => {
    const POSTCODE = 'GL11'

    cy.reload(true)
    cy.get(selectors.filter.ukPostcode).should('be.visible')
    cy.get(selectors.filter.ukPostcode).clear().type(POSTCODE).type('{enter}')

    cy.wait('@filterResults').then((xhr) => {
      expect(xhr.url).to.contain(`uk_postcode=${POSTCODE}`)
    })

    cy.get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 24)
  })

  it('should filter by Lead ITA and Global Account Manager', () => {
    const leadIta = selectors.filter.leadIta
    const { typeahead } = selectors.filter
    cy.get(typeahead(leadIta).selectedOption)
      .click()
      .get(typeahead(leadIta).textInput)
      .type('Shawn Cohen')
      .get(typeahead(leadIta).options)
      .should('have.length', 64)

    cy.get(typeahead(leadIta).selectedOption).type('{enter}').type('{esc}')

    cy.wait('@filterResults').then((xhr) => {
      expect(xhr.url).to.contain(
        'one_list_group_global_account_manager=2c42c516-9898-e211-a939-e4115bead28a'
      )
    })
  })

  it('should filter by uk region', () => {
    const { ukRegion, typeahead } = selectors.filter
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
      expect(xhr.url).to.contain(
        'uk_region=824cd12a-6095-e211-a939-e4115bead28a'
      )
    })
  })
})
