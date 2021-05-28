const urls = require('../../../../src/lib/urls')

describe('interaction page', () => {
  before(() => {
    cy.visit(urls.interactions.index())
  })

  it('should render interaction page correctly', () => {
    cy.compareSnapshot('interactionPage')
  })
})
