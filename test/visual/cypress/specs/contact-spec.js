const urls = require('../../../../src/lib/urls')

describe('contact page', () => {
  before(() => {
    cy.visit(urls.contacts.index())
  })

  it('should render contact page correctly', () => {
    cy.compareSnapshot('contactPage')
  })
})
