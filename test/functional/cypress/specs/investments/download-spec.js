const { investments } = require('../../../../../src/lib/urls')

describe('Investment Project Collections', () => {
  context('when filters are applied', () => {
    before(() => {
      cy.visit(investments.projects.index(), {
        qs: { page: 2, estimated_land_date_before: '2020-11-19' },
      })
    })

    it('should show download link', () => {
      cy.findByText('You can now download these 12 projects').should('exist')

      cy.findByRole('link', { name: 'Download' })
        .click()
        .should(
          'have.attr',
          'href',
          '/investments/projects/export?estimated_land_date_before=2020-11-19'
        )
    })
  })

  context('when over 5,000 projects are returned', () => {
    before(() => {
      cy.visit(investments.projects.index())
    })

    it('should show "filter to fewer than 5,000"', () => {
      cy.findByText('Filter to fewer than 5,000 projects to download').should(
        'exist'
      )

      cy.findByRole('link', { name: 'Download' }).should('not.exist')
    })
  })
})
