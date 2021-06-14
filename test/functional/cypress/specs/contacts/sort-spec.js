const selectors = require('../../../../selectors')
const fixtures = require('../../fixtures')

describe('Contact Collections Sort', () => {
  beforeEach(() => {
    cy.visit('/contacts?sortby=collectionTest')
    cy.get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 9)
    cy.get(selectors.entityCollection.collection).should(
      'contain',
      '9 contacts'
    )
    cy.intercept('/contacts?*').as('sortResults')
  })

  it('should sort by country AZ', () => {
    cy.get(selectors.entityCollection.sort).select('address_country.name:asc')

    cy.wait('@sortResults').then((xhr) => {
      expect(xhr.response.url).to.contain(
        '?custom=true&sortby=address_country.name%3Aasc'
      )
    })

    cy.get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 2)
    cy.get(selectors.entityCollection.entity(1)).should('contain', 'Sort By')
  })

  it('should sort by last name AZ', () => {
    cy.get(selectors.entityCollection.sort).select('last_name:asc')

    cy.wait('@sortResults').then((xhr) => {
      expect(xhr.response.url).to.contain('?custom=true&sortby=last_name%3Aasc')
    })

    cy.get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 2)
    cy.get(selectors.entityCollection.entity(1)).should('contain', 'Sort By')
  })

  it('should sort by company name AZ', () => {
    cy.get(selectors.entityCollection.sort).select('company.name:asc')

    cy.wait('@sortResults').then((xhr) => {
      expect(xhr.response.url).to.contain(
        '?custom=true&sortby=company.name%3Aasc'
      )
    })

    cy.get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 2)
    cy.get(selectors.entityCollection.entity(1)).should('contain', 'Sort By')
  })

  it('should sort by least recent', () => {
    cy.get(selectors.entityCollection.sort).select('modified_on:asc')

    cy.wait('@sortResults').then((xhr) => {
      expect(xhr.response.url).to.contain(
        '?custom=true&sortby=modified_on%3Aasc'
      )
    })

    cy.get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 2)
    cy.get(selectors.entityCollection.entity(1)).should('contain', 'Sort By')
  })

  it('should sort by most recent', () => {
    cy.get(selectors.entityCollection.sort).select('modified_on:desc')

    cy.wait('@sortResults').then((xhr) => {
      expect(xhr.response.url).to.contain(
        '?custom=true&sortby=modified_on%3Adesc'
      )
    })

    cy.get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 2)
    cy.get(selectors.entityCollection.entity(1)).should('contain', 'Sort By')
  })

  it('should sort by Newest', () => {
    cy.get(selectors.entityCollection.sort).select('created_on:desc')

    cy.wait('@sortResults').then((xhr) => {
      expect(xhr.response.url).to.contain(
        '?custom=true&sortby=created_on%3Adesc'
      )
    })

    cy.get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 2)
    cy.get(selectors.entityCollection.entity(1)).should('contain', 'Sort By')
  })

  it('should sort by Oldest', () => {
    cy.get(selectors.entityCollection.sort).select('created_on:asc')

    cy.wait('@sortResults').then((xhr) => {
      expect(xhr.response.url).to.contain(
        '?custom=true&sortby=created_on%3Aasc'
      )
    })

    cy.get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 2)
    cy.get(selectors.entityCollection.entity(1)).should('contain', 'Sort By')
  })
})

describe('Company Contact Collections Sort', () => {
  beforeEach(() => {
    cy.visit(`/companies/${fixtures.default.id}/contacts?sortby=collectionTest`)
  })

  it('should load sort by dropdown', () => {
    cy.get(`${selectors.entityCollection.sort} option`).then((options) => {
      const actual = [...options].map((o) => o.value)
      expect(actual).to.deep.eq([
        'created_on:desc',
        'created_on:asc',
        'modified_on:desc',
        'modified_on:asc',
        'last_name:asc',
        'address_country.name:asc',
      ])
    })
  })
})
