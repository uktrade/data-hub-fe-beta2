const fixtures = require('../../fixtures')

const {
  companyAddRemoveFromLists: { cancelLink },
  tabbedLocalNav,
} = require('../../../../selectors')

const testTab = (tabText) => {
  it(`should return to the tab ${tabText}`, () => {
    cy.get(tabbedLocalNav().tabs).contains(tabText).click()
    cy.contains('View options').click()
    cy.contains('Add to or remove from lists').click()
    cy.get(cancelLink).click()
    cy.get(tabbedLocalNav().tabs)
      .contains(tabText)
      .should('have.class', 'govuk-tabs__tab--selected')
  })
}

describe('Company tab history', () => {
  before(() => {
    cy.visit(`/companies/${fixtures.company.marsExportsLtd.id}`)
  })
  ;[
    'Activity',
    'Company contacts',
    'Lead adviser',
    'Investment',
    'Export',
    'Orders',
  ].forEach(testTab)
})
