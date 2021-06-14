import { contacts } from '../../../../../src/lib/urls'

describe('Contacts Collection - React', () => {
  before(() => {
    cy.visit(contacts.react.index())
    cy.initA11y()
  })

  it('should not have any a11y violations', () => {
    cy.runA11y()
  })
})
