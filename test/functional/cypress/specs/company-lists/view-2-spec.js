const helper = require('./view-spec-helper')

describe('My companies lists', () => {
  before(() => {
    Cypress.Cookies.preserveOnce('datahub.sid')
    cy.visit('/')
  })

  it('my companies lists tab should be selected', () =>
    cy.dhAriaTablistTabShouldBeSelected('Dashboard', 'My companies lists'))

  helper.describeSelectedList({
    name: 'List A',
    ...helper.expectedLists['List A'],
  })
})
