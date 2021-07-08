import urls from '../../../../../src/lib/urls'
import qs from 'qs'

import { contactsListFaker } from '../../fakers/contacts'

const downloadHeader = '[data-test="download-data-header"]'
const downloadButton = '[data-test="download-data-header"] a'

describe('Download CSV', () => {
  context('When there are 0 contacts', () => {
    before(() => {
      cy.intercept('POST', '/api-proxy/v3/search/contact', {
        body: {
          results: [],
          count: 0,
        },
      })
      cy.visit(urls.contacts.index())
    })
    it('should not render the download header', () => {
      cy.get(downloadHeader).should('not.exist')
    })
  })
  context('When there is a single contact', () => {
    const contactsList = contactsListFaker(1)
    before(() => {
      cy.intercept('POST', '/api-proxy/v3/search/contact', {
        body: {
          results: contactsList,
          count: contactsList.length,
        },
      })
      cy.visit(urls.contacts.index())
    })
    it('should render the download header', () => {
      cy.get(downloadHeader).should('exist')
    })

    it('should render a download link', () => {
      cy.get(downloadButton)
        .should('exist')
        .should(
          'have.attr',
          'href',
          '/contacts/export?archived%5B0%5D=false&sortby=modified_on%3Adesc'
        )
        .and('contain', 'Download')
    })

    it('should render a download message', () => {
      cy.get(downloadHeader).should(
        'contain',
        'You can now download this contact'
      )
    })
  })
  context('When there are 4999 contacts or less', () => {
    const contactsList = contactsListFaker(9)
    before(() => {
      cy.intercept('POST', '/api-proxy/v3/search/contact', {
        body: {
          results: contactsList,
          count: 4999,
        },
      })
      cy.visit(urls.contacts.index())
    })
    it('should render a download message', () => {
      cy.get(downloadHeader).should(
        'contain',
        'You can now download these 4999 contacts'
      )
    })
  })
  context('When there are 5000 contacts or more', () => {
    const contactsList = contactsListFaker(10)
    before(() => {
      cy.intercept('POST', '/api-proxy/v3/search/contact', {
        body: {
          results: contactsList,
          count: 5000,
        },
      })
      cy.visit(urls.contacts.index())
    })
    it('should render a download message', () => {
      cy.get(downloadHeader).should(
        'contain',
        'Filter to fewer than 5,000 contacts to download'
      )
    })
  })
  context('When there are filters applied', () => {
    const contactsList = contactsListFaker(1)
    const queryString = qs.stringify({
      name: 'David Jones',
      company_name: 'Tesco',
      company_sector_descends: 'af959812-6095-e211-a939-e4115bead28a',
      address_country: '80756b9a-5d95-e211-a939-e4115bead28a',
      company_uk_region: '924cd12a-6095-e211-a939-e4115bead28a',
      archived: ['false', 'true'],
    })
    before(() => {
      cy.intercept('POST', '/api-proxy/v3/search/contact', {
        body: {
          results: contactsList,
          count: contactsList.length,
        },
      })
      cy.visit(`${urls.contacts.index()}?${queryString}`)
    })
    it('should have the correct query string', () => {
      cy.get(downloadButton).should(
        'have.attr',
        'href',
        `/contacts/export?${queryString}`
      )
    })
  })
})
