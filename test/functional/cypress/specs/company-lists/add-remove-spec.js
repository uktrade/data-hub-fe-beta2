const selectors = require('../../../../selectors')
const fixtures = require('../../fixtures')
const { testBreadcrumbs } = require('../../support/assertions')

const listSelectors = selectors.companyAddRemoveFromLists

describe('Adding and removing a company to a list', () => {
  context('when viewing the companies page with company lists created', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.lambdaPlc.id}/activity`)
    })
    it('displays a button to add or remove from a list', () => {
      cy.contains('View options').click()
      cy.contains('Add to or remove from lists')
    })
  })
  context('when viewing the add/remove from lists form', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.lambdaPlc.id}/lists/add-remove`)
    })

    testBreadcrumbs({
      Home: '/',
      Companies: '/companies',
      'Lambda plc': `/companies/${fixtures.company.lambdaPlc.id}`,
      'Add and remove from lists': undefined,
    })

    it('should render options for list A', () => {
      cy.get(listSelectors.listA.legend).should(
        'have.text',
        'Do you want to add Lambda plc to the List A list?'
      )
      cy.get(listSelectors.listA.radios).should('have.length', 2)
      cy.get(listSelectors.listA.labelYes).should('have.text', 'Yes')
      cy.get(listSelectors.listA.labelNo).should('have.text', 'No')

      cy.get(listSelectors.listA.radioYes).should('not.be.checked')
      cy.get(listSelectors.listA.radioNo).should('be.checked')
    })
    it('should render options for list B', () => {
      cy.get(listSelectors.listB.legend).should(
        'have.text',
        'Do you want to add Lambda plc to the List B list?'
      )
      cy.get(listSelectors.listB.radios).should('have.length', 2)
      cy.get(listSelectors.listB.labelYes).should('have.text', 'Yes')
      cy.get(listSelectors.listB.labelNo).should('have.text', 'No')

      cy.get(listSelectors.listB.radioYes).should('be.checked')
      cy.get(listSelectors.listB.radioNo).should('not.be.checked')
    })
    it('should render options for list B', () => {
      cy.get(listSelectors.listC.legend).should(
        'have.text',
        'Do you want to add Lambda plc to the List C list?'
      )
      cy.get(listSelectors.listC.radios).should('have.length', 2)
      cy.get(listSelectors.listC.labelYes).should('have.text', 'Yes')
      cy.get(listSelectors.listC.labelNo).should('have.text', 'No')

      cy.get(listSelectors.listC.radioYes).should('not.be.checked')
      cy.get(listSelectors.listC.radioNo).should('be.checked')
    })
    it('should render a "Create list" button', () => {
      cy.get(listSelectors.createButton).should(
        'have.text',
        'Create a new list'
      )
    })
    it('should render a "Save" button', () => {
      cy.get(listSelectors.saveButton).should('have.text', 'Save')
    })
    it('should render a "Cancel" link', () => {
      cy.get(listSelectors.cancelLink).should('have.text', 'Cancel')
    })
  })

  context('when adding the company to a list', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.lambdaPlc.id}/lists/add-remove`)
      cy.get(listSelectors.listA.radioYes).check()
      cy.get(listSelectors.saveButton).click()
    })

    it('should redirect to the homepage', () => {
      cy.location('pathname').should('eq', `/`)
    })

    it('should show a flash message to say the lists have been updated', () => {
      cy.get('[data-test="flash"]').should(
        'contain.text',
        'Lists changes for this company have been saved.'
      )
    })
  })

  context('when removing the company from a list', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.lambdaPlc.id}/lists/add-remove`)
      cy.get(listSelectors.listB.radioNo).check()
      cy.get(listSelectors.saveButton).click()
    })

    it('should redirect to the homepage', () => {
      cy.location('pathname').should('eq', `/`)
    })

    it('should show a flash message to say the lists have been updated', () => {
      cy.get('[data-test="flash"]').should(
        'contain.text',
        'Lists changes for this company have been saved.'
      )
    })
  })
})
