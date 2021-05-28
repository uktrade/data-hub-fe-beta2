const urls = require('../../../../src/lib/urls')

describe('company page', () => {
  before(() => {
    cy.visit(urls.companies.index())
  })

  it('should render company page correctly', () => {
    cy.compareSnapshot('companyPage')
  })
})
