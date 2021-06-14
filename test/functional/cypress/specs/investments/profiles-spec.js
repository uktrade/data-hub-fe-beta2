const {
  assertTabbedLocalNav,
  assertLocalHeader,
  assertBreadcrumbs,
} = require('../../support/assertions')
const { investments } = require('../../../../../src/lib/urls')

describe('Investor profiles', () => {
  context('When there is 10 profiles and viewing the first page', () => {
    before(() => {
      cy.visit(investments.profiles.index())
    })

    it('should render the header', () => {
      assertLocalHeader('Investments')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        Investments: '/investments',
        Profiles: null,
      })
    })

    it('should render the local navigation', () => {
      assertTabbedLocalNav('Projects')
      assertTabbedLocalNav('Investor profiles')
    })

    it('should display download profile text', () => {
      cy.get('[data-test="download-data-header"]').should(
        'contain',
        'You can now download these 10 profiles'
      )
    })

    it('should display download profile button', () => {
      cy.get('[data-test="download-data-header"] > div > a')
        .should('be.visible')
        .should('have.attr', 'href', '/investments/profiles/export')
    })

    it('should display 10 profiles', () => {
      cy.get('h3').should('have.length', 10)
    })
  })
})
