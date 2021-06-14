import { clickCheckboxGroupOption } from '../../support/actions'
import urls from '../../../../../src/lib/urls'

import {
  assertChipExists,
  assertTypeaheadHints,
  assertCheckboxGroupOption,
  assertTypeaheadOptionSelected,
} from '../../support/assertions'
import { selectFirstTypeaheadOption } from '../../support/actions'

const FILTERS = {
  SECTOR: {
    NAME: 'Aerospace',
    ID: '9538cecc-5f95-e211-a939-e4115bead28a',
  },
  COUNTRY: {
    NAME: 'United Kingdom',
    ID: '80756b9a-5d95-e211-a939-e4115bead28a',
  },
  UK_REGION: {
    NAME: 'Jersey',
    ID: '924cd12a-6095-e211-a939-e4115bead28a',
  },
}

const testTypeahead = ({
  element,
  legend,
  placeholder,
  input,
  expectedOption,
}) => {
  assertTypeaheadHints({ element, legend, placeholder })
  selectFirstTypeaheadOption({ element, input })
  assertTypeaheadOptionSelected({ element, expectedOption })
}

const testRemoveChip = ({ element, placeholder = null }) => {
  cy.get('#filter-chips').as('filterChips').find('button').click()
  cy.get('@filterChips').should('be.empty')
  placeholder && cy.get(element).should('contain', placeholder)
}

describe('Contacts Collections Filter', () => {
  context('when the url contains no state', () => {
    beforeEach(() => {
      cy.visit(urls.contacts.react.index())
      cy.get('[data-test="contact-name-filter"]').as('contactNameFilter')
      cy.get('[data-test="company-name-filter"]').as('companyNameFilter')
      cy.get('[data-test="sector-filter"]').as('sectorFilter')
      cy.get('[data-test="country-filter"]').as('countryFilter')
      cy.get('[data-test="uk-region-filter"]').as('ukRegionFilter')
      cy.get('[data-test="status-filter"]').as('statusFilter')
    })

    it('should filter by Contact name', () => {
      cy.get('@contactNameFilter').type('David Jones{enter}')

      cy.get('@contactNameFilter').should('have.value', 'David Jones')
      assertChipExists({ label: 'David Jones', position: 1 })

      testRemoveChip({ element: '@contactNameFilter' })
      cy.get('@contactNameFilter').should('have.value', '')
    })

    it('should filter by Company name', () => {
      cy.get('@companyNameFilter').type('Diaego{enter}')

      cy.get('@companyNameFilter').should('have.value', 'Diaego')
      assertChipExists({ label: 'Diaego', position: 1 })

      testRemoveChip({ element: '@companyNameFilter' })
      cy.get('@companyNameFilter').should('have.value', '')
    })

    it('should filter by sector', () => {
      testTypeahead({
        element: '@sectorFilter',
        legend: 'Sector',
        placeholder: 'Search sectors',
        input: 'aero',
        expectedOption: 'Aerospace',
      })

      testRemoveChip({
        element: '@sectorFilter',
        placeholder: 'Search sectors',
      })
    })

    it('should filter by country', () => {
      testTypeahead({
        element: '@countryFilter',
        legend: 'Country of origin',
        placeholder: 'Search countries',
        input: 'bra',
        expectedOption: 'Brazil',
      })

      testRemoveChip({
        element: '@countryFilter',
        placeholder: 'Search countries',
      })
    })

    it('should filter by uk region', () => {
      testTypeahead({
        element: '@ukRegionFilter',
        legend: 'UK Region',
        placeholder: 'Search UK region',
        input: 'sou',
        expectedOption: 'South East',
      })

      testRemoveChip({
        element: '@ukRegionFilter',
        placeholder: 'Search UK regions',
      })
    })

    it('should filter by status', () => {
      cy.get('@statusFilter')
        .find('label')
        .as('statusOptions')
        .should('have.length', 2)
      cy.get('@statusOptions')
        .eq(0)
        .should('contain', 'Active')
        .find('input')
        .should('have.value', 'false')
      cy.get('@statusOptions')
        .eq(1)
        .should('contain', 'Inactive')
        .find('input')
        .should('have.value', 'true')
      clickCheckboxGroupOption({
        element: '@statusFilter',
        value: 'false',
      })
      assertCheckboxGroupOption({
        element: '@statusFilter',
        value: 'false',
        checked: true,
      })
      assertChipExists({ label: 'Active', position: 1 })

      testRemoveChip({ element: '@statusFilter' })
    })
  })

  context('when the url contains state', () => {
    beforeEach(() => {
      cy.visit(urls.contacts.react.index(), {
        qs: {
          company_sector_descends: FILTERS.SECTOR.ID,
          address_country: FILTERS.COUNTRY.ID,
          company_uk_region: FILTERS.UK_REGION.ID,
        },
      })
      cy.get('[data-test="sector-filter"]').as('sectorFilter')
      cy.get('[data-test="country-filter"]').as('countryFilter')
      cy.get('[data-test="uk-region-filter"]').as('ukRegionFilter')
    })
    it('should set the selected filter values and filter indicators', () => {
      assertChipExists({ position: 1, label: FILTERS.SECTOR.NAME })
      cy.get('@sectorFilter').should('contain', FILTERS.SECTOR.NAME)
      assertChipExists({ position: 2, label: FILTERS.COUNTRY.NAME })
      cy.get('@countryFilter').should('contain', FILTERS.COUNTRY.NAME)
      assertChipExists({ position: 3, label: FILTERS.UK_REGION.NAME })
      cy.get('@ukRegionFilter').should('contain', FILTERS.UK_REGION.NAME)
    })

    it('should clear all filters', () => {
      cy.get('#filter-chips').find('button').as('chips')
      cy.get('#clear-filters').as('clearFilters')
      cy.get('@chips').should('have.length', 3)
      cy.get('@clearFilters').click()
      cy.get('@chips').should('have.length', 0)
      cy.get('@sectorFilter').should('contain', 'Search sectors')
      cy.get('@countryFilter').should('contain', 'Search countries')
      cy.get('@ukRegionFilter').should('contain', 'Search UK regions')
    })
  })
})
