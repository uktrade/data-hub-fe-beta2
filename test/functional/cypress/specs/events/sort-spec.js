const selectors = require('../../../../selectors')

describe('Event Collections Sort', () => {
  beforeEach(() => {
    cy.intercept('/events?*').as('sortResults')
    cy.visit('/events')
    cy.get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 7)
    cy.get(selectors.entityCollection.collection).should('contain', '7 events')
  })

  it('should sort by AZ', () => {
    cy.get(selectors.entityCollection.sort).select('name:asc')

    cy.wait('@sortResults').then((xhr) => {
      expect(xhr.response.url).to.contain('?custom=true&sortby=name%3Aasc')
    })

    cy.get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 2)
    cy.get(selectors.entityCollection.entity(1)).should('contain', 'Sort Event')
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
    cy.get(selectors.entityCollection.entity(1)).should('contain', 'Sort Event')
  })

  it('should sort by earliest start date', () => {
    cy.get(selectors.entityCollection.sort).select('start_date:asc')

    cy.wait('@sortResults').then((xhr) => {
      expect(xhr.response.url).to.contain(
        '?custom=true&sortby=start_date%3Aasc'
      )
    })

    cy.get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 2)
    cy.get(selectors.entityCollection.entity(1)).should('contain', 'Sort Event')
  })

  it('should sort by latest start date', () => {
    cy.get(selectors.entityCollection.sort).select('start_date:desc')

    cy.wait('@sortResults').then((xhr) => {
      expect(xhr.response.url).to.contain(
        '?custom=true&sortby=start_date%3Adesc'
      )
    })

    cy.get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 2)
    cy.get(selectors.entityCollection.entity(1)).should('contain', 'Sort Event')
  })

  it('should only show sort option if there is more than 1 result', () => {
    cy.get(selectors.filter.name).type('FilterByEvent').type('{enter}')
    cy.get(selectors.entityCollection.sort).should('not.exist')
  })
})
