const urls = require('../../../../src/lib/urls')

describe('event page', () => {
  before(() => {
    cy.visit(urls.events.index())
  })

  it('event page', () => {
    cy.compareSnapshot('eventPage')
  })
})
