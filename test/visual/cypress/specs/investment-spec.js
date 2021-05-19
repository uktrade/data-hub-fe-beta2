const urls = require('../../../../src/lib/urls')

describe('investment page', () => {
  before(() => {
    cy.visit(urls.investments.index())
  })

  it('should render investment project page correctly', () => {
    cy.compareSnapshot('investmentPage')
  })
})