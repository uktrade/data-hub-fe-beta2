const selectors = require('../../../../selectors')

const { investments } = require('../../../../../src/lib/urls')

describe('Investment Project Collections', () => {
  before(() => {
    cy.visit(investments.projects.index(), {
      qs: { page: 2, estimated_land_date_before: '2020-11-19' },
    })
  })

  it('should show download link', () => {
    cy.get(selectors.investment.header.downloadData)
      .should('have.length', 1)
      .should('contain', 'You can now download these 12 projects')

    cy.get(selectors.investment.header.downloadDataButton)
      .should('have.length', 1)
      .should('contain', 'Download')
      .should(
        'have.attr',
        'href',
        '/investments/projects/export?estimated_land_date_before=2020-11-19'
      )
  })
})
