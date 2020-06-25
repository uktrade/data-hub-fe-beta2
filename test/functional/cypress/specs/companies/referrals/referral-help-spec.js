const urls = require('../../../../../../src/lib/urls')
const {
  id: companyId,
} = require('../../../../../sandbox/fixtures/v4/company/company-lambda-plc')

const selectors = require('../../../../../selectors')
const { assertBreadcrumbs } = require('../../../support/assertions')

describe('Referral help', () => {
  context('when viewing referral help', () => {
    before(() => {
      cy.visit(urls.companies.referrals.help(companyId, '1'))
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard.route,
        Companies: '/companies',
        'Lambda plc': urls.companies.detail(companyId),
        Referral: urls.companies.referrals.details(companyId, '1'),
        'I cannot accept this referral': null,
      })
    })

    it('should render the heading', () => {
      cy.get(selectors.localHeader().heading).should(
        'have.text',
        'I cannot accept this referral'
      )
    })

    it('should render the content and conform to design', () => {
      cy.get('#referral-help h2:first-child')
        .should('have.text', 'I need more information')
        .next()
        .should('match', 'p')
        .should(
          'have.text',
          'Contact the sender for more info: Ian Leggett, caravans@campervans.com'
        )
        .next()
        .should(
          'have.text',
          'Or find their contact details on Digital Workspace (opens in a new window or tab)'
        )
        .next()
        .should('have.prop', 'tagName', 'H2')
        .should('have.text', "I'm not the right adviser for this")
        .next()
        .should('have.prop', 'tagName', 'P')
        .should(
          'contain.text',
          'Forward this referral onto someone else. Paste this URL into an email:'
        )
        .should(
          'contain.text',
          `${urls.companies.referrals.details(companyId, '1')}`
        )
        .next()
        .should('have.prop', 'tagName', 'A')
        .should(
          'have.attr',
          'href',
          urls.companies.referrals.details(companyId, '1')
        )
        .should('have.text', 'Back to the referral')
    })
    it("should link to digital workspace's people finder", () => {
      cy.contains('Digital Workspace').should(
        'have.attr',
        'href',
        urls.external.digitalWorkspace.teams
      )
    })
  })
})
