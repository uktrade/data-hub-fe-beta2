import React from 'react'
import { connect } from 'react-redux'

import {
  COMPANIES__LOADED,
  COMPANIES__SET_COMPANIES_METADATA,
} from '../../../client/actions'
import {
  CollectionFilters,
  FilteredCollectionList,
  RoutedCheckboxGroupField,
  RoutedInputField,
  RoutedTypeahead,
} from '../../../client/components'

import * as labels from './labels'
import {
  ID,
  TASK_GET_COMPANIES_LIST,
  TASK_GET_COMPANIES_METADATA,
  state2props,
} from './state'

const CompaniesCollection = ({
  payload,
  currentAdviserId,
  optionMetadata,
  selectedFilters,
  ...props
}) => {
  const collectionListTask = {
    name: TASK_GET_COMPANIES_LIST,
    id: ID,
    progressMessage: 'loading companies',
    startOnRender: {
      payload,
      onSuccessDispatch: COMPANIES__LOADED,
    },
  }

  const collectionListMetadataTask = {
    name: TASK_GET_COMPANIES_METADATA,
    id: ID,
    progressMessage: 'loading metadata',
    startOnRender: {
      onSuccessDispatch: COMPANIES__SET_COMPANIES_METADATA,
    },
  }

  return (
    <FilteredCollectionList
      {...props}
      collectionName="Company"
      sortOptions={optionMetadata.sortOptions}
      taskProps={collectionListTask}
      selectedFilters={selectedFilters}
      baseDownloadLink="/companies/export"
      entityName="company"
      entityNamePlural="companies"
      addItemUrl="/companies/create"
    >
      <CollectionFilters taskProps={collectionListMetadataTask}>
        <RoutedCheckboxGroupField
          legend={labels.HEADQUARTER_TYPE}
          name="headquarter_type"
          qsParam="headquarter_type"
          options={optionMetadata.headquarterTypeOptions}
          selectedOptions={selectedFilters.selectedHeadquarterTypes}
          data-test="headquarter-type-filter"
        />
        <RoutedInputField
          id="CompanyCollection.name"
          qsParam="name"
          name="name"
          label={labels.COMPANY_NAME}
          placeholder="Search company name"
          data-test="company-name-filter"
        />
        <RoutedTypeahead
          isMulti={true}
          legend={labels.SECTOR}
          name="sector"
          qsParam="sector_descends"
          placeholder="Search sectors"
          options={optionMetadata.sectorOptions}
          selectedOptions={selectedFilters.selectedSectors}
          data-test="sector-filter"
        />
        <RoutedTypeahead
          isMulti={true}
          legend={labels.COUNTRY}
          name="country"
          qsParam="country"
          placeholder="Search country"
          options={optionMetadata.countryOptions}
          selectedOptions={selectedFilters.selectedCountries}
          data-test="country-filter"
        />
        <RoutedInputField
          id="CompanyCollection.postcode"
          qsParam="uk_postcode"
          name="uk_postcode"
          label={labels.UK_POSTCODE}
          placeholder="Search UK postcode"
          data-test="uk-postcode-filter"
        />
        <RoutedTypeahead
          isMulti={true}
          legend={labels.UK_REGION}
          name="uk_region"
          qsParam="uk_region"
          placeholder="Search UK regions"
          options={optionMetadata.ukRegionOptions}
          selectedOptions={selectedFilters.selectedUkRegions}
          data-test="uk-region-filter"
        />
        <RoutedCheckboxGroupField
          legend={labels.COMPANY_STATUS}
          name="archived"
          qsParam="archived"
          options={optionMetadata.companyStatuses}
          selectedOptions={selectedFilters.selectedCompanyStatuses}
          data-test="company-status-filter"
        />
        <RoutedTypeahead
          isMulti={true}
          legend={labels.CURRENTLY_EXPORTING_TO}
          name="export_to_countries"
          qsParam="export_to_countries"
          placeholder="Search country"
          options={optionMetadata.countryOptions}
          selectedOptions={selectedFilters.selectedExportToCountries}
          data-test="currently-exporting-to-country-filter"
        />
        <RoutedTypeahead
          isMulti={true}
          legend={labels.FUTURE_COUNTRIES_OF_INTEREST}
          name="future_interest_countries"
          qsParam="future_interest_countries"
          placeholder="Search country"
          options={optionMetadata.countryOptions}
          selectedOptions={selectedFilters.selectedFutureCountriesOfInterest}
          data-test="future-countries-of-interest-filter"
        />
      </CollectionFilters>
    </FilteredCollectionList>
  )
}

export default connect(state2props)(CompaniesCollection)
