const {
  assertLocalHeader,
  assertBreadcrumbs,
} = require('../../support/assertions')
const urls = require('../../../../../src/lib/urls')
const fixtures = require('../../fixtures/index')

describe('Update the project stage', () => {
  context('When viewing a project details page', () => {
    before(() => {
      cy.visit(
        urls.investments.projects.details(fixtures.investment.newHotelFdi.id)
      )
    })
    it('should display the admin button', () => {
      cy.findByRole('link', { name: 'Admin' }).should('exist')
    })
    it('should render the admin page when the Admin tab is clicked', () => {
      cy.findByRole('link', { name: 'Admin' }).click()
      cy.url().should(
        'contain',
        urls.investments.projects.admin(fixtures.investment.newHotelFdi.id)
      )
    })
  })
  context('When viewing a project admin page', () => {
    before(() => {
      cy.visit(
        urls.investments.projects.admin(fixtures.investment.newHotelFdi.id)
      )
    })
    it('should render the header', () => {
      assertLocalHeader('Change the project stage')
    })
    it('should display breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Investments: urls.investments.index(),
        Projects: urls.investments.projects.index(),
        [fixtures.investment.newHotelFdi.name]:
          urls.investments.projects.project(fixtures.investment.newHotelFdi.id),
        Admin: null,
      })
    })
    it('should display the project name and current stage under "Project details"', () => {
      cy.contains('h2', 'Project details')
      cy.contains('p', `Project name: ${fixtures.investment.newHotelFdi.name}`)
      cy.contains('p', 'Current stage: Assign PM')
    })
    it('should display heading and radio buttons for the remaining four stages', () => {
      cy.contains('h2', 'Change the stage to')
      cy.findByLabelText('Prospect').should('exist')
      cy.findByLabelText('Active').should('exist')
      cy.findByLabelText('Verify win').should('exist')
      cy.findByLabelText('Won').should('exist')
    })
    it('should display the "Save" button', () => {
      cy.findByRole('button', { name: 'Save' }).should('exist')
    })
    it('should display the "Cancel" link', () => {
      cy.findByRole('link', { name: 'Cancel' }).should('exist')
    })
  })
  context('When clicking the "Cancel" link', () => {
    before(() => {
      cy.visit(
        urls.investments.projects.admin(fixtures.investment.newHotelFdi.id)
      )
    })
    it('should take you back to the project details page', () => {
      cy.findByRole('link', { name: 'Cancel' }).click()
      cy.url().should(
        'contain',
        urls.investments.projects.details(fixtures.investment.newHotelFdi.id)
      )
    })
  })
  context(
    'When the "Save" button is clicked without selecting a new stage',
    () => {
      before(() => {
        cy.visit(
          urls.investments.projects.admin(fixtures.investment.newHotelFdi.id)
        )
      })
      it('should display an error message', () => {
        cy.findByRole('button', { name: 'Save' }).click()
        cy.get('#form-errors').findByText('Select a new stage').should('exist')
      })
    }
  )
  context(
    'When the "Save" button is clicked after selecting a new stage',
    () => {
      before(() => {
        cy.visit(
          urls.investments.projects.admin(fixtures.investment.newHotelFdi.id)
        )
      })
      it('should take you to project details page and display a flash message', () => {
        cy.findByLabelText('Prospect').click()
        cy.findByRole('button', { name: 'Save' }).click()
        cy.url().should(
          'contain',
          urls.investments.projects.details(fixtures.investment.newHotelFdi.id)
        )
        cy.findByText('Project stage saved').should('exist')
      })
      it('should no longer show the flash message when the page is refreshed', () => {
        cy.reload()
        cy.findByText('Project stage saved').should('not.exist')
      })
    }
  )
})
