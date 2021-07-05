const fixtures = require('../../../fixtures')
const urls = require('../../../../../../src/lib/urls')

describe('Lead advisers', () => {
  context('when viewing a non One List tier company', () => {
    before(() => {
      cy.visit(urls.companies.detail(fixtures.company.marsExportsLtd.id))
      cy.findByRole('tab', { name: 'Lead adviser' }).click()
    })

    it('should render a meta title', () => {
      cy.title().should(
        'eq',
        'Lead adviser - Mars Exports Ltd - Companies - DIT Data Hub'
      )
    })

    it('should display a header with the company name', () => {
      cy.contains('h2', 'Lead ITA for Mars Exports Ltd')
    })

    it('should display help text for adding a lead adviser', () => {
      cy.contains(
        'This company record has no Lead International Trade Adviser (ITA).'
      )
      cy.contains(
        'You can add a Lead ITA. This will be visible to all Data Hub users.'
      )
    })

    it('should display a button to add a lead adviser', () => {
      cy.findByRole('link', { name: 'Add a Lead ITA' }).should(
        'have.attr',
        'href',
        urls.companies.advisers.assign(fixtures.company.marsExportsLtd.id)
      )
    })
  })

  context('when viewing a One List Tier company', () => {
    before(() => {
      cy.visit(urls.companies.detail(fixtures.company.oneListCorp.id))
    })

    it('should display the "Core team" tab in the navigation', () => {
      cy.findByRole('tab', { name: 'Core team' })
    })
  })

  context(
    'when viewing a One List tier D - ITA company with an allocated Account manager',
    () => {
      before(() => {
        cy.visit(urls.companies.detail(fixtures.company.oneListTierDita.id))
        cy.findByRole('tab', { name: 'Lead adviser' }).click()
      })

      it('should have a link to the Lead adviser tab', () => {
        cy.findByRole('link', { name: 'View Lead adviser' }).should(
          'have.attr',
          'href',
          urls.companies.advisers.index(fixtures.company.oneListTierDita.id)
        )
      })

      context('In the table', () => {
        it('should display correct headers', () => {
          cy.findByRole('table', { name: "Lead ITA for Ian's Camper Vans Ltd" })
            .findAllByRole('columnheader')
            .then((es) => [...es.map((i, e) => e.innerText)])
            .should('deep.equal', ['Team', 'Lead ITA', 'Email'])
        })

        it('should display correct cell values', () => {
          cy.findByRole('table', { name: "Lead ITA for Ian's Camper Vans Ltd" })
            .findAllByRole('cell')
            .then((es) => [...es.map((i, e) => e.innerText)])
            .should('deep.equal', [
              'IST - Sector Advisory Services',
              'Travis Greene',
              'travis@travis.com',
            ])
        })
      })

      it('should display a button to replace the Lead ITA', () => {
        cy.findByRole('link', { name: 'Replace Lead ITA' }).should(
          'have.attr',
          'href',
          urls.companies.advisers.assign(fixtures.company.oneListTierDita.id)
        )
      })

      it('should display a button to remove the Lead ITA', () => {
        cy.findByRole('link', { name: 'Remove Lead ITA' }).should(
          'have.attr',
          'href',
          urls.companies.advisers.remove(fixtures.company.oneListTierDita.id)
        )
      })
    }
  )
})
