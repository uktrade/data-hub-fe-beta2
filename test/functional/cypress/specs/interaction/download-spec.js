import urls from '../../../../../src/lib/urls'
import qs from 'qs'

import { interactionsListFaker } from '../../fakers/interactions'

const downloadHeader = '[data-test="download-data-header"]'
const downloadButton = '[data-test="download-data-header"] a'
const interactionSearchEndpoint = '/api-proxy/v3/search/interaction'

describe('Download CSV', () => {
  context('When there are 0 interactions', () => {
    before(() => {
      cy.intercept('POST', '/api-proxy/v3/search/interaction', {
        body: {
          results: [],
          count: 0,
        },
      })
      cy.visit(urls.interactions.index())
    })
    it('should not render the download header', () => {
      cy.get(downloadHeader).should('not.exist')
    })
  })
  context('When there is a single interaction', () => {
    const interactionList = interactionsListFaker(1)
    before(() => {
      cy.intercept('POST', interactionSearchEndpoint, {
        body: {
          results: interactionList,
          count: interactionList.length,
        },
      })
      cy.visit(urls.interactions.index())
    })
    it('should render the download header', () => {
      cy.get(downloadHeader).should('exist')
    })

    it('should render a download link', () => {
      cy.get(downloadButton)
        .should('exist')
        .should('have.attr', 'href', '/interactions/export?sortby=date%3Adesc')
        .and('contain', 'Download')
    })

    it('should render a download message', () => {
      cy.get(downloadHeader).should(
        'contain',
        'You can now download this interaction'
      )
    })
  })
  context('When there are 4999 interactions or less', () => {
    const interactionsList = interactionsListFaker(9)
    before(() => {
      cy.intercept('POST', interactionSearchEndpoint, {
        body: {
          results: interactionsList,
          count: 4999,
        },
      })
      cy.visit(urls.interactions.index())
    })
    it('should render a download message', () => {
      cy.get(downloadHeader).should(
        'contain',
        'You can now download these 4999 interactions'
      )
    })
  })
  context('When there are 5000 interactions or more', () => {
    const interactionsList = interactionsListFaker(10)
    before(() => {
      cy.intercept('POST', interactionSearchEndpoint, {
        body: {
          results: interactionsList,
          count: 5000,
        },
      })
      cy.visit(urls.interactions.index())
    })
    it('should render a download message', () => {
      cy.get(downloadHeader).should(
        'contain',
        'Filter to fewer than 5,000 interactions to download'
      )
    })
  })
  context('When there are filters applied', () => {
    const interactionsList = interactionsListFaker(1)
    const queryString = qs.stringify({
      kind: ['interaction', 'service_delivery'],
      dit_participants__adviser: ['1'],
      adviser: ['3b42c516-9898-e211-a939-e4115bead28a'],
      date_after: '2021-06-24',
      date_before: '2023-06-24',
      service: ['94a2473d-e898-4e1c-a082-ddfde8f297ff'],
      sector_descends: ['af959812-6095-e211-a939-e4115bead28a'],
      was_policy_feedback_provided: true,
      policy_areas: ['4b9142df-0520-46bd-9da9-94147cdbae13'],
      policy_issue_types: ['688ac22e-89d4-4d1f-bf0b-013588bf63a7'],
      company_one_list_group_tier: ['b91bf800-8d53-e311-aef3-441ea13961e2'],
    })
    before(() => {
      cy.intercept('POST', interactionSearchEndpoint, {
        body: {
          results: interactionsList,
          count: interactionsList.length,
        },
      })
      cy.visit(`${urls.interactions.index()}?${queryString}`)
    })
    it('should have the correct query string', () => {
      cy.get(downloadButton).should(
        'have.attr',
        'href',
        `/interactions/export?${queryString}`
      )
    })
  })
})
