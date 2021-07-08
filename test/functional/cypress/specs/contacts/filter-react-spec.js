import urls from '../../../../../src/lib/urls'
import qs from 'qs'

import { removeChip } from '../../support/actions'
import { testTypeahead } from '../../support/tests'
import {
  assertChipExists,
  assertChipsEmpty,
  assertFieldEmpty,
  assertQueryParams,
} from '../../support/assertions'

import { contactsListFaker } from '../../fakers/contacts'

const buildQueryString = (queryParams = {}) =>
  qs.stringify({
    // Default query params
    archived: ['false'],
    sortby: 'modified_on:desc',
    page: 1,
    ...queryParams,
  })

const minimumPayload = {
  limit: 10,
  offset: 0,
  sortby: 'modified_on:desc',
}

const activeStatusFlag = 'false'

describe('Contacts Collections Filter', () => {
  context('Default Params', () => {
    it('should set the default params', () => {
      const contactsList = contactsListFaker(10)
      cy.intercept('POST', '/api-proxy/v3/search/contact', {
        body: {
          count: contactsList.length,
          results: contactsList,
        },
      }).as('apiRequest')

      // No default params, these are programmatically added
      cy.visit(urls.contacts.index())

      // First call to the api without default params
      // we shouldn't be making this call
      cy.wait('@apiRequest')

      // Second call to the api with default params
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal({
          limit: 10,
          offset: 0,
          sortby: 'modified_on:desc',
          archived: false,
        })
      })

      cy.get('[data-test="status-filter"]')
        .find('input')
        .eq(0)
        .should('be.checked')

      cy.get('[data-test="status-filter"]')
        .find('input')
        .eq(1)
        .should('not.be.checked')
    })
  })

  context('Contact', () => {
    const element = '[data-test="contact-name-filter"]'
    const name = 'David Jones'
    const expectedPayload = {
      name,
      offset: 0,
      limit: 10,
      archived: false,
      sortby: 'modified_on:desc',
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({ name })
      cy.intercept('POST', '/api-proxy/v3/search/contact').as('apiRequest')
      cy.visit(`${urls.contacts.index()}?${queryString}`)
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal(expectedPayload)
      })
      cy.get(element).should('have.value', name)
      assertChipExists({ label: name, position: 1 })
    })

    it('should filter from user input and remove the chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', '/api-proxy/v3/search/contact').as('apiRequest')
      cy.visit(`${urls.contacts.index()}?${queryString}`)
      cy.wait('@apiRequest')

      cy.get(element).type(`${name}{enter}`)

      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal(expectedPayload)
      })

      assertQueryParams('name', name)
      assertChipExists({ label: name, position: 1 })
      assertChipExists({ label: 'Active', position: 2 })

      removeChip(name)
      cy.wait('@apiRequest')
      removeChip(activeStatusFlag)
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal(minimumPayload)
      })
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Company', () => {
    const element = '[data-test="company-name-filter"]'
    const name = 'Tesco'
    const expectedPayload = {
      company_name: name,
      limit: 10,
      offset: 0,
      archived: false,
      sortby: 'modified_on:desc',
    }
    it('should filter from the url', () => {
      const queryString = buildQueryString({ company_name: name })
      cy.intercept('POST', '/api-proxy/v3/search/contact').as('apiRequest')
      cy.visit(`${urls.contacts.index()}?${queryString}`)
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal(expectedPayload)
      })
      cy.get(element).should('have.value', name)
      assertChipExists({ label: name, position: 1 })
      assertChipExists({ label: 'Active', position: 2 })
    })
    it('should filter from user input and remove the chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', '/api-proxy/v3/search/contact').as('apiRequest')
      cy.visit(`${urls.contacts.index()}?${queryString}`)
      cy.wait('@apiRequest')

      cy.get(element).type(`${name}{enter}`)

      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal(expectedPayload)
      })

      assertQueryParams('company_name', name)
      assertChipExists({ label: name, position: 1 })
      assertChipExists({ label: 'Active', position: 2 })

      removeChip(name)
      cy.wait('@apiRequest')
      removeChip(activeStatusFlag)
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal(minimumPayload)
      })
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Sector', () => {
    const element = '[data-test="sector-filter"]'
    const aerospaceId = '9538cecc-5f95-e211-a939-e4115bead28a'
    const expectedPayload = {
      company_sector_descends: [aerospaceId],
      limit: 10,
      offset: 0,
      archived: false,
      sortby: 'modified_on:desc',
    }
    it('should filter from the url', () => {
      const queryString = buildQueryString({
        company_sector_descends: [aerospaceId],
      })
      cy.intercept('POST', '/api-proxy/v3/search/contact').as('apiRequest')
      cy.visit(`${urls.contacts.index()}?${queryString}`)
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal(expectedPayload)
      })
      cy.get(element).should('contain', 'Aerospace')
      assertChipExists({ label: 'Aerospace', position: 1 })
    })
    it('should filter from user input and remove the chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', '/api-proxy/v3/search/contact').as('apiRequest')
      cy.visit(`${urls.contacts.index()}?${queryString}`)
      cy.wait('@apiRequest')

      testTypeahead({
        element,
        legend: 'Sector',
        placeholder: 'Search sector',
        input: 'aero',
        expectedOption: 'Aerospace',
      })

      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal(expectedPayload)
      })

      assertQueryParams('company_sector_descends', [aerospaceId])
      assertChipExists({ label: 'Aerospace', position: 1 })
      assertChipExists({ label: 'Active', position: 2 })

      removeChip(aerospaceId)
      cy.wait('@apiRequest')
      removeChip(activeStatusFlag)
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal(minimumPayload)
      })
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Country', () => {
    const element = '[data-test="country-filter"]'
    const brazilId = 'b05f66a0-5d95-e211-a939-e4115bead28a'
    const expectedPayload = {
      address_country: [brazilId],
      limit: 10,
      offset: 0,
      archived: false,
      sortby: 'modified_on:desc',
    }
    it('should filter from the url', () => {
      const queryString = buildQueryString({
        address_country: [brazilId],
      })
      cy.intercept('POST', '/api-proxy/v3/search/contact').as('apiRequest')
      cy.visit(`${urls.contacts.index()}?${queryString}`)
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal(expectedPayload)
      })
      cy.get(element).should('contain', 'Brazil')
      assertChipExists({ label: 'Brazil', position: 1 })
    })
    it('should filter from user input and remove the chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', '/api-proxy/v3/search/contact').as('apiRequest')
      cy.visit(`${urls.contacts.index()}?${queryString}`)
      cy.wait('@apiRequest')

      testTypeahead({
        element,
        legend: 'Country',
        placeholder: 'Search country',
        input: 'bra',
        expectedOption: 'Brazil',
      })

      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal(expectedPayload)
      })

      assertQueryParams('address_country', [brazilId])
      assertChipExists({ label: 'Brazil', position: 1 })
      assertChipExists({ label: 'Active', position: 2 })

      removeChip(brazilId)
      cy.wait('@apiRequest')
      removeChip(activeStatusFlag)
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal(minimumPayload)
      })
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('UK Region', () => {
    const element = '[data-test="uk-region-filter"]'
    const londonId = '874cd12a-6095-e211-a939-e4115bead28a'
    const expectedPayload = {
      company_uk_region: [londonId],
      limit: 10,
      offset: 0,
      archived: false,
      sortby: 'modified_on:desc',
    }
    it('should filter from the url', () => {
      const queryString = buildQueryString({
        company_uk_region: [londonId],
      })
      cy.intercept('POST', '/api-proxy/v3/search/contact').as('apiRequest')
      cy.visit(`${urls.contacts.index()}?${queryString}`)
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal(expectedPayload)
      })
      cy.get(element).should('contain', 'London')
      assertChipExists({ label: 'London', position: 1 })
    })
    it('should filter from user input and remove the chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', '/api-proxy/v3/search/contact').as('apiRequest')
      cy.visit(`${urls.contacts.index()}?${queryString}`)
      cy.wait('@apiRequest')

      testTypeahead({
        element,
        legend: 'UK region',
        placeholder: 'Search UK region',
        input: 'lon',
        expectedOption: 'London',
      })

      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal(expectedPayload)
      })

      assertQueryParams('company_uk_region', [londonId])
      assertChipExists({ label: 'London', position: 1 })
      assertChipExists({ label: 'Active', position: 2 })

      removeChip(londonId)
      cy.wait('@apiRequest')
      removeChip(activeStatusFlag)
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal(minimumPayload)
      })
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Status (active/inactive)', () => {
    beforeEach(() => {
      cy.visit(urls.contacts.index())
      cy.get('[data-test="status-filter"]').find('input').eq(0).as('active')
      cy.get('[data-test="status-filter"]').find('input').eq(1).as('inactive')
    })
    it('should filter by Active Status (explicit query params)', () => {
      const queryString = buildQueryString({ archived: ['false'] })
      cy.visit(`${urls.contacts.index()}?${queryString}`)
      cy.get('@active').should('be.checked')
      cy.get('@inactive').should('not.be.checked')
      assertChipExists({ label: 'Active', position: 1 })
    })
    it('should filter by Inactive Status', () => {
      const queryString = buildQueryString({ archived: ['true'] })
      cy.visit(`${urls.contacts.index()}?${queryString}`)
      cy.get('@active').should('not.be.checked')
      cy.get('@inactive').should('be.checked')
      assertChipExists({ label: 'Inactive', position: 1 })
    })
    it('should filter by both Active and Inactive statuses (no filter)', () => {
      const queryString = buildQueryString({ archived: ['false', 'true'] })
      cy.visit(`${urls.contacts.index()}?${queryString}`)
      cy.get('@active').should('be.checked')
      cy.get('@inactive').should('be.checked')
      assertChipExists({ label: 'Active', position: 1 })
      assertChipExists({ label: 'Inactive', position: 2 })
    })
  })

  context('Remove all filters', () => {
    before(() => {
      const queryString = buildQueryString({
        page: 1,
        name: 'David Jones',
        company_name: 'Tesco',
        company_sector_descends: 'af959812-6095-e211-a939-e4115bead28a',
        address_country: '80756b9a-5d95-e211-a939-e4115bead28a',
        company_uk_region: '874cd12a-6095-e211-a939-e4115bead28a',
        archived: ['false', 'true'],
      })
      cy.visit(`${urls.contacts.index()}?${queryString}`)
      cy.get('[data-test=filter-chips]').children().as('filterChips')
    })
    it('should remove all filters and chips', () => {
      cy.get('@filterChips').should('have.length', 7)
      cy.get('[data-test=clear-filters]').click()
      cy.get('@filterChips').should('have.length', 0)
      cy.get('[data-test="contact-name-filter"]').should('have.value', '')
      cy.get('[data-test="company-name-filter"]').should('have.value', '')
      cy.get('[data-test="sector-filter"]').should('have.value', '')
      cy.get('[data-test="country-filter"]').should('have.value', '')
      cy.get('[data-test="uk-region-filter"]').should('have.value', '')
      cy.get('[data-test="status-filter"]')
        .find('input')
        .eq(0)
        .should('not.be.checked')
      cy.get('[data-test="status-filter"]')
        .find('input')
        .eq(1)
        .should('not.be.checked')
    })
  })
})
