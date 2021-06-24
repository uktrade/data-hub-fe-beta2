import { omis } from '../../../../../src/lib/urls'
import qs from 'qs'

import { removeChip } from '../../support/actions'
import { testTypeahead } from '../../support/tests'
import {
  assertPayload,
  assertChipExists,
  assertChipsEmpty,
  assertFieldEmpty,
  assertQueryParams,
} from '../../support/assertions'

const sortby = 'created_on:desc'

const buildQueryString = (queryParams = {}) =>
  qs.stringify({
    // Default query params
    sortby,
    page: 1,
    ...queryParams,
  })

const minimumPayload = {
  limit: 10,
  offset: 0,
  sortby,
}

const searchEndpoint = '/api-proxy/v3/search/order'

describe('Orders Collections Filter', () => {
  context('Default Params', () => {
    it('should set the default params', () => {
      cy.intercept('POST', searchEndpoint).as('apiRequest')

      // No default query params, these are programmatically added
      cy.visit(omis.react.index())

      // First call to the api without default query params
      // we shouldn't be making this call
      cy.wait('@apiRequest')

      // Second call to the api with default params
      assertPayload('@apiRequest', minimumPayload)
    })
  })

  context('Company', () => {
    const element = '[data-test="company-name-filter"]'
    const name = 'Tesco'
    const expectedPayload = {
      ...minimumPayload,
      company_name: name,
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({ company_name: name })
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${omis.react.index()}?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      cy.get(element).should('have.value', name)
      assertChipExists({ label: name, position: 1 })
    })

    it('should filter from user input and remove the chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${omis.react.index()}?${queryString}`)
      cy.wait('@apiRequest')

      cy.get(element).type(`${name}{enter}`)
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('company_name', name)
      assertChipExists({ label: name, position: 1 })

      removeChip(name)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Contact', () => {
    const element = '[data-test="contact-name-filter"]'
    const name = 'David Jones'
    const expectedPayload = {
      ...minimumPayload,
      contact_name: name,
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({ contact_name: name })
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${omis.react.index()}?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      cy.get(element).should('have.value', name)
      assertChipExists({ label: name, position: 1 })
    })

    it('should filter from user input and remove the chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${omis.react.index()}?${queryString}`)
      cy.wait('@apiRequest')

      cy.get(element).type(`${name}{enter}`)
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('name', name)
      assertChipExists({ label: name, position: 1 })

      removeChip(name)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Sector', () => {
    const element = '[data-test="sector-filter"]'
    const aerospaceId = '9538cecc-5f95-e211-a939-e4115bead28a'
    const expectedPayload = {
      ...minimumPayload,
      sector_descends: [aerospaceId],
    }
    it('should filter from the url', () => {
      const queryString = buildQueryString({
        sector_descends: [aerospaceId],
      })
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${omis.react.index()}?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      cy.get(element).should('contain', 'Aerospace')
      assertChipExists({ label: 'Aerospace', position: 1 })
    })

    it('should filter from user input and remove the chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${omis.react.index()}?${queryString}`)
      cy.wait('@apiRequest')

      testTypeahead({
        element,
        legend: 'Sector',
        placeholder: 'Search sectors',
        input: 'aero',
        expectedOption: 'Aerospace',
      })
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('sector_descends', [aerospaceId])
      assertChipExists({ label: 'Aerospace', position: 1 })

      removeChip(aerospaceId)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Primary market (AKA country)', () => {
    const element = '[data-test="country-filter"]'
    const brazilId = 'b05f66a0-5d95-e211-a939-e4115bead28a'
    const expectedPayload = {
      ...minimumPayload,
      primary_market: [brazilId],
    }
    it('should filter from the url', () => {
      const queryString = buildQueryString({
        primary_market: [brazilId],
      })
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${omis.react.index()}?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      cy.get(element).should('contain', 'Brazil')
      assertChipExists({ label: 'Brazil', position: 1 })
    })

    it('should filter from user input and remove the chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${omis.react.index()}?${queryString}`)
      cy.wait('@apiRequest')

      testTypeahead({
        element,
        legend: 'Country of origin',
        placeholder: 'Search countries',
        input: 'bra',
        expectedOption: 'Brazil',
      })
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('primary_market', [brazilId])
      assertChipExists({ label: 'Brazil', position: 1 })

      removeChip(brazilId)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('UK Region', () => {
    const element = '[data-test="uk-region-filter"]'
    const jerseyId = '924cd12a-6095-e211-a939-e4115bead28a'
    const expectedPayload = {
      ...minimumPayload,
      uk_region: [jerseyId],
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        uk_region: [jerseyId],
      })
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${omis.react.index()}?${queryString}`)
      assertPayload('@apiRequest', expectedPayload)
      cy.get(element).should('contain', 'Jersey')
      assertChipExists({ label: 'Jersey', position: 1 })
    })

    it('should filter from user input and remove the chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`${omis.react.index()}?${queryString}`)
      cy.wait('@apiRequest')

      testTypeahead({
        element,
        legend: 'UK region',
        placeholder: 'Search UK region',
        input: 'jer',
        expectedOption: 'Jersey',
      })
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('uk_region', [jerseyId])
      assertChipExists({ label: 'Jersey', position: 1 })

      removeChip(jerseyId)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Remove all filters', () => {
    before(() => {
      const queryString = buildQueryString({
        page: 1,
        contact_name: 'David Jones',
        company_name: 'Tesco',
        sector_descends: 'af959812-6095-e211-a939-e4115bead28a',
        primary_market: '80756b9a-5d95-e211-a939-e4115bead28a',
        uk_region: '924cd12a-6095-e211-a939-e4115bead28a',
      })
      cy.visit(`${omis.react.index()}?${queryString}`)
      cy.get('[data-test=filter-chips]').children().as('filterChips')
    })
    it('should remove all filters and chips', () => {
      cy.get('@filterChips').should('have.length', 5)
      cy.get('[data-test=clear-filters]').click()
      cy.get('@filterChips').should('have.length', 0)
      cy.get('[data-test="contact-name-filter"]').should('have.value', '')
      cy.get('[data-test="company-name-filter"]').should('have.value', '')
      cy.get('[data-test="sector-filter"]').should('have.value', '')
      cy.get('[data-test="country-filter"]').should('have.value', '')
      cy.get('[data-test="uk-region-filter"]').should('have.value', '')
    })
  })
})
