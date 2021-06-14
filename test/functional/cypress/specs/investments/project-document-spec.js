const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const { assertBreadcrumbs } = require('../../support/assertions')
const { dashboard, investments } = require('../../../../../src/lib/urls')

describe('Investment Project Documents', () => {
  context('when there is a document link', () => {
    before(() => {
      cy.visit(
        investments.projects.documents(
          fixtures.investment.investmentWithLink.id
        )
      )
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: dashboard(),
        Investments: investments.index(),
        Projects: investments.projects.index(),
        'New hotel (commitment to invest)': investments.projects.project(
          'fb5b5006-56af-40e0-8615-7aba53e0e4bf'
        ),
        Documents: null,
      })
    })

    it('should display appropriate message when there is a link to a document', () => {
      cy.get(selectors.document.documentHeader).should('contain', 'Document')
      cy.get(selectors.document.documentContent).should(
        'contain',
        'View files and documents'
      )
      cy.get(selectors.document.documentContent).should(
        'contain',
        '(will open another website)'
      )
    })
  })

  context('when there is not a document link', () => {
    before(() => {
      cy.visit(
        investments.projects.documents(
          fixtures.investment.investmentWithNoLink.id
        )
      )
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: dashboard(),
        Investments: investments.index(),
        Projects: investments.projects.index(),
        'Green tea plantation': investments.projects.project(
          'addca042-5a00-412c-9d7c-acc04552756c'
        ),
        Documents: null,
      })
    })

    it('should display appropriate message when there is not a link to a document', () => {
      cy.get(selectors.document.documentHeader).should('contain', 'Document')
      cy.get(selectors.document.documentContent).should(
        'contain',
        'There are no files or documents'
      )
    })
  })
})
