const urls = require('../../../../src/lib/urls')

describe('omis page', () => {
  before(() => {
    cy.visit(urls.omis.index())
  })

  it('should render order page correctly', () => {
    cy.compareSnapshot('omisPage')
  })
})
