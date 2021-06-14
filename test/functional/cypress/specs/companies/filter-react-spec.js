import { companies } from '../../../../../src/lib/urls'

import { clickCheckboxGroupOption } from '../../support/actions'
import {
  assertCheckboxGroupOption,
  assertCheckboxGroupNoneSelected,
  assertChipExists,
} from '../../support/assertions'
import { testTypeahead, testRemoveChip } from '../../support/tests'

const GLOBAL_HQ_ID = '43281c5e-92a4-4794-867b-b4d5f801e6f3'
const ADVANCED_ENGINEERING_SECTOR_ID = 'af959812-6095-e211-a939-e4115bead28a'
const TEST_COMPANY_NAME_QUERY = 'Test Company'
const UK_COUNTRY_ID = '80756b9a-5d95-e211-a939-e4115bead28a'
const SOUTH_EAST_UK_REGION_ID = '884cd12a-6095-e211-a939-e4115bead28a'

describe('Investments Collections Filter', () => {
  context('when the url contains no state', () => {
    beforeEach(() => {
      // Visit the new react companies page - note this will need to be changed
      // to `companies.index()` when ready
      cy.visit(companies.react.index())
      cy.get('[data-test="headquarter-type-filter"]').as('hqTypeFilter')
      cy.get('[data-test="company-name-filter"]').as('companyNameFilter')
      cy.get('[data-test="sector-filter"]').as('sectorFilter')
      cy.get('[data-test="country-filter"]').as('countryFilter')
      cy.get('[data-test="uk-region-filter"]').as('ukRegionFilter')
      cy.get('[data-test="company-status-filter"]').as('statusFilter')
      cy.get('[data-test="currently-exporting-to-country-filter"]').as(
        'currentlyExportingToFilter'
      )
      cy.get('[data-test="future-countries-of-interest-filter"]').as(
        'futureCountriesOfInterestFilter'
      )
    })

    it('should filter by Headquarter Type', () => {
      cy.get('@hqTypeFilter')
        .find('label')
        .as('hqTypeOptions')
        .should('have.length', 3)
      cy.get('@hqTypeOptions').eq(0).should('contain', 'European HQ')
      cy.get('@hqTypeOptions').eq(1).should('contain', 'Global HQ')
      cy.get('@hqTypeOptions').eq(2).should('contain', 'UK HQ')
      clickCheckboxGroupOption({
        element: '@hqTypeFilter',
        value: GLOBAL_HQ_ID,
      })
      assertCheckboxGroupOption({
        element: '@hqTypeFilter',
        value: GLOBAL_HQ_ID,
        checked: true,
      })
      assertChipExists({ label: 'Global HQ', position: 1 })

      testRemoveChip({ element: '@hqTypeFilter' })
    })

    it('should filter by Company Name', () => {
      cy.get('@companyNameFilter')
        .type(`${TEST_COMPANY_NAME_QUERY}{enter}`)
        .blur()

      cy.get('@companyNameFilter').should('have.value', TEST_COMPANY_NAME_QUERY)
      assertChipExists({ label: 'Test Company', position: 1 })

      testRemoveChip({ element: '@companyNameFilter' })
      cy.get('@companyNameFilter').should('have.value', '')
    })

    it('should filter by sector', () => {
      testTypeahead({
        element: '@sectorFilter',
        legend: 'Sector',
        placeholder: 'Search sectors',
        input: 'adv',
        expectedOption: 'Advanced Engineering',
      })

      testRemoveChip({
        element: '@sectorFilter',
        placeholder: 'Search sectors',
      })
    })

    it('should filter by country', () => {
      testTypeahead({
        element: '@countryFilter',
        legend: 'Country',
        placeholder: 'Search country',
        input: 'hond',
        expectedOption: 'Honduras',
      })

      testRemoveChip({
        element: '@countryFilter',
        placeholder: 'Search country',
      })
    })

    it('should filter by UK region', () => {
      testTypeahead({
        element: '@ukRegionFilter',
        legend: 'UK Region',
        placeholder: 'Search UK regions',
        input: 'york',
        expectedOption: 'Yorkshire and The Humber',
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

    it('should filter by currently exporting to country', () => {
      testTypeahead({
        element: '@currentlyExportingToFilter',
        legend: 'Currently exporting to',
        placeholder: 'Search country',
        input: 'arg',
        expectedOption: 'Argentina',
      })

      testRemoveChip({
        element: '@currentlyExportingToFilter',
        placeholder: 'Search country',
      })
    })

    it('should filter by future countries of interest', () => {
      testTypeahead({
        element: '@futureCountriesOfInterestFilter',
        legend: 'Future countries of interest',
        placeholder: 'Search country',
        input: 'guat',
        expectedOption: 'Guatemala',
      })

      testRemoveChip({
        element: '@futureCountriesOfInterestFilter',
        placeholder: 'Search country',
      })
    })
  })

  context('when the url contains state', () => {
    beforeEach(() => {
      // Visit the new react companies page - note this will need to be changed
      // to `companies.index()` when ready
      cy.visit(companies.react.index(), {
        qs: {
          headquarter_type: GLOBAL_HQ_ID,
          name: TEST_COMPANY_NAME_QUERY,
          sector_descends: ADVANCED_ENGINEERING_SECTOR_ID,
          uk_region: SOUTH_EAST_UK_REGION_ID,
          archived: ['true'],
          country: UK_COUNTRY_ID,
          export_to_countries: UK_COUNTRY_ID,
          future_interest_countries: UK_COUNTRY_ID,
        },
      })
      cy.get('[data-test="headquarter-type-filter"]').as('hqTypeFilter')
      cy.get('[data-test="company-name-filter"]').as('companyNameFilter')
      cy.get('[data-test="sector-filter"]').as('sectorFilter')
      cy.get('[data-test="country-filter"]').as('countryFilter')
      cy.get('[data-test="uk-region-filter"]').as('ukRegionFilter')
      cy.get('[data-test="company-status-filter"]').as('statusFilter')
      cy.get('[data-test="currently-exporting-to-country-filter"]').as(
        'currentlyExportingToFilter'
      )
      cy.get('[data-test="future-countries-of-interest-filter"]').as(
        'futureCountriesOfInterestFilter'
      )
    })

    it('should set the selected filter values and filter indicators', () => {
      assertChipExists({ position: 1, label: 'Advanced Engineering' })
      assertChipExists({ position: 2, label: 'United Kingdom' })
      assertChipExists({
        position: 3,
        label: 'Currently exporting to: United Kingdom',
      })
      assertChipExists({
        position: 4,
        label: 'Future country of interest: United Kingdom',
      })
      assertChipExists({ position: 5, label: 'South East' })
      assertChipExists({ position: 6, label: 'Global HQ' })
      assertChipExists({ position: 7, label: TEST_COMPANY_NAME_QUERY })
      assertChipExists({ position: 8, label: 'Inactive' })
      assertCheckboxGroupOption({
        element: '@hqTypeFilter',
        value: GLOBAL_HQ_ID,
        checked: true,
      })
      cy.get('@companyNameFilter').should('have.value', TEST_COMPANY_NAME_QUERY)
      cy.get('@sectorFilter').should('contain', 'Advanced Engineering')
      cy.get('@countryFilter').should('contain', 'United Kingdom')
      cy.get('@ukRegionFilter').should('contain', 'South East')
      assertCheckboxGroupOption({
        element: '@statusFilter',
        value: 'true',
        checked: true,
      })
      cy.get('@currentlyExportingToFilter').should('contain', 'United Kingdom')
      cy.get('@futureCountriesOfInterestFilter').should(
        'contain',
        'United Kingdom'
      )
    })

    it('should clear all filters', () => {
      cy.get('#filter-chips').find('button').as('chips')
      cy.get('#clear-filters').as('clearFilters')
      cy.get('@chips').should('have.length', 8)
      cy.get('@clearFilters').click()
      cy.get('@chips').should('have.length', 0)

      assertCheckboxGroupNoneSelected('@hqTypeFilter')
      cy.get('@companyNameFilter').should('have.value', '')
      cy.get('@sectorFilter').should('contain', 'Search sectors')
      cy.get('@countryFilter').should('contain', 'Search country')
      cy.get('@ukRegionFilter').should('contain', 'Search UK regions')
      assertCheckboxGroupNoneSelected('@statusFilter')
      cy.get('@currentlyExportingToFilter').should('contain', 'Search country')
      cy.get('@futureCountriesOfInterestFilter').should(
        'contain',
        'Search country'
      )
    })
  })
})
