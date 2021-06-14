const { investments } = require('../../../../../src/lib/urls')
const project = require('../../fixtures/investment/investment-needing-external-funding.json')

describe('Edit the associated FDI R&D project', () => {
  context('When adding a new linked project', () => {
    before(() => {
      cy.visit(investments.projects.details(project.id))
      cy.get('[data-test="edit-associated-link"]').click()
    })

    it('should allow users to search for an associated project', () => {
      cy.get('[data-test="group-field-term"]').type('Venus{enter}')
      cy.get('[data-test="item-investments/project-0"]').click()

      cy.get('[data-test="flash"]').should(
        'have.text',
        'Investment details updatedDismiss'
      )
    })
  })
})
