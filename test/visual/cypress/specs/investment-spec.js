const urls = require('../../../../src/lib/urls')

describe('investment page', () => {
  before(() => {
    cy.visit(urls.investments.index())
  })

  it('should render investment project page correctly', () => {
    cy.get('[data-test="next"]').should('be.visible')
    cy.compareSnapshot('investmentPage')
  })
})
