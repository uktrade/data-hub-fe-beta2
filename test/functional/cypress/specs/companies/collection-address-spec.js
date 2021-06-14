import { assertBreadcrumbs } from '../../support/assertions'
import { companies } from '../../../../../src/lib/urls'

import { companyFaker, companyListFaker } from '../../fakers/companies'

// const selectors = require('../../../../selectors')

describe('Company Collection Address', () => {
  const usCompany = companyFaker({
    address: {
      line_1: '3525 Eastham Drive',
      line_2: '',
      town: 'Culver City',
      county: 'CA',
      postcode: '90232',
      area: {
        id: '81756b9a-5d95-e211-a939-e4115bead28b',
        name: 'California',
      },
      country: {
        id: '81756b9a-5d95-e211-a939-e4115bead28a',
        name: 'United States',
      },
    },
  })

  const otherCompanies = companyListFaker(9)
  const companyList = [usCompany, ...otherCompanies]

  before(() => {
    cy.intercept('POST', '/api-proxy/v4/search/company', {
      body: {
        count: companyList.length,
        results: companyList,
      },
    }).as('apiRequest')
    cy.visit(companies.react.index())
    cy.wait('@apiRequest')
  })

  beforeEach(() => {
    cy.get('[data-test="collection-item"]').as('collectionItems')
    cy.get('@collectionItems').eq(0).as('firstListItem')
  })

  it('should render home breadcumb', () => {
    assertBreadcrumbs({
      Home: '/',
      Companies: null,
    })
  })

  it('should contain california displaying area for an US address', () => {
    cy.get('@firstListItem')
      .find('[data-test="metadata"]')
      .should(
        'contain',
        '3525 Eastham Drive, Culver City, CA, 90232, California, United States'
      )
  })
})
