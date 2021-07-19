import React from 'react'
import { connect } from 'react-redux'

import {
  COMPANIES__LOADED,
  COMPANIES__METADATA_LOADED,
  COMPANIES__SELECTED_LEAD_ITA_OR_GLOBAL_ACCOUNT_MANAGER,
} from '../../../client/actions'
import {
  CollectionFilters,
  FilteredCollectionList,
  RoutedAdvisersTypeahead,
  RoutedCheckboxGroupField,
  RoutedDateField,
  RoutedInputField,
  RoutedTypeahead,
} from '../../../client/components'

import { LABELS } from './constants'
import {
  ID,
  TASK_GET_COMPANIES_LEAD_ITA_OR_GLOBAL_ACCOUNT_MANAGER_NAME,
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
    progressMessage: 'Loading companies',
    startOnRender: {
      payload,
      onSuccessDispatch: COMPANIES__LOADED,
    },
  }

  const collectionListMetadataTask = {
    name: TASK_GET_COMPANIES_METADATA,
    id: ID,
    progressMessage: 'Loading filters',
    startOnRender: {
      onSuccessDispatch: COMPANIES__METADATA_LOADED,
    },
  }

  const leadItaGlobalAccountManagerTask = {
    name: TASK_GET_COMPANIES_LEAD_ITA_OR_GLOBAL_ACCOUNT_MANAGER_NAME,
    id: ID,
    progressMessage: 'Loading advisers',
    startOnRender: {
      payload: payload.one_list_group_global_account_manager,
      onSuccessDispatch: COMPANIES__SELECTED_LEAD_ITA_OR_GLOBAL_ACCOUNT_MANAGER,
    },
  }

  return (
    <FilteredCollectionList
      {...props}
      collectionName="company"
      sortOptions={optionMetadata.sortOptions}
      taskProps={collectionListTask}
      selectedFilters={selectedFilters}
      baseDownloadLink="/companies/export"
      entityName="company"
      entityNamePlural="companies"
      addItemUrl="/companies/create"
      defaultQueryParams={{
        archived: ['false'],
        sortby: 'modified_on:desc',
        page: 1,
      }}
    >
      <CollectionFilters taskProps={collectionListMetadataTask}>
        <RoutedCheckboxGroupField
          legend={LABELS.headquarterType}
          name="headquarter_type"
          qsParam="headquarter_type"
          options={optionMetadata.headquarterTypeOptions}
          selectedOptions={selectedFilters.headquarterTypes.options}
          data-test="headquarter-type-filter"
        />
        <RoutedInputField
          id="CompanyCollection.name"
          qsParam="name"
          name="name"
          label={LABELS.companyName}
          placeholder="Search company name"
          data-test="company-name-filter"
        />
        <RoutedTypeahead
          isMulti={true}
          legend={LABELS.sector}
          name="sector"
          qsParam="sector_descends"
          placeholder="Search sector"
          options={optionMetadata.sectorOptions}
          selectedOptions={selectedFilters.sectors.options}
          data-test="sector-filter"
        />
        <RoutedTypeahead
          isMulti={true}
          legend={LABELS.country}
          name="country"
          qsParam="country"
          placeholder="Search country"
          options={optionMetadata.countryOptions}
          selectedOptions={selectedFilters.countries.options}
          data-test="country-filter"
        />
        <RoutedTypeahead
          isMulti={true}
          legend={LABELS.usState}
          name="us_state"
          qsParam="us_state"
          placeholder="Search US state"
          options={optionMetadata.usStateOptions}
          selectedOptions={selectedFilters.usStates.options}
          data-test="us-state-filter"
        />
        <RoutedTypeahead
          isMulti={true}
          legend={LABELS.canadianProvince}
          name="canadian_province"
          qsParam="canadian_province"
          placeholder="Search Canadian province"
          options={optionMetadata.canadianProvinceOptions}
          selectedOptions={selectedFilters.canadianProvinces.options}
          data-test="canadian-province-filter"
        />
        <RoutedInputField
          id="CompanyCollection.postcode"
          qsParam="uk_postcode"
          name="uk_postcode"
          label={LABELS.ukPostcode}
          placeholder="Search UK postcode"
          data-test="uk-postcode-filter"
        />
        <RoutedTypeahead
          isMulti={true}
          legend={LABELS.ukRegion}
          name="uk_region"
          qsParam="uk_region"
          placeholder="Search UK region"
          options={optionMetadata.ukRegionOptions}
          selectedOptions={selectedFilters.ukRegions.options}
          data-test="uk-region-filter"
        />
        <RoutedCheckboxGroupField
          legend={LABELS.companyStatus}
          name="archived"
          qsParam="archived"
          options={optionMetadata.companyStatusOptions}
          selectedOptions={selectedFilters.companyStatuses.options}
          data-test="company-status-filter"
        />
        <RoutedTypeahead
          isMulti={true}
          legend={LABELS.currentlyExportingTo}
          name="export_to_countries"
          qsParam="export_to_countries"
          placeholder="Search country"
          options={optionMetadata.countryOptions}
          selectedOptions={selectedFilters.exportToCountries.options}
          data-test="currently-exporting-to-country-filter"
        />
        <RoutedTypeahead
          isMulti={true}
          legend={LABELS.futureCountriesOfInterest}
          name="future_interest_countries"
          qsParam="future_interest_countries"
          placeholder="Search country"
          options={optionMetadata.countryOptions}
          selectedOptions={selectedFilters.futureCountriesOfInterest.options}
          data-test="future-countries-of-interest-filter"
        />
        <RoutedDateField
          label={LABELS.lastInteractionAfter}
          name="latest_interaction_date_after"
          qsParamName="latest_interaction_date_after"
          data-test="last-interaction-after-filter"
        />
        <RoutedDateField
          label={LABELS.lastInteractionBefore}
          name="latest_interaction_date_before"
          qsParamName="latest_interaction_date_before"
          data-test="last-interaction-before-filter"
        />
        <RoutedAdvisersTypeahead
          isMulti={true}
          taskProps={leadItaGlobalAccountManagerTask}
          legend={LABELS.leadItaOrGlobalAccountManager}
          name="one_list_group_global_account_manager"
          qsParam="one_list_group_global_account_manager"
          placeholder="Search adviser"
          noOptionsMessage={() => <>No advisers found</>}
          selectedOptions={
            selectedFilters.leadItaOrGlobalAccountManagers.options
          }
          data-test="lead-ita-global-account-manager-filter"
        />
      </CollectionFilters>
    </FilteredCollectionList>
  )
}

export default connect(state2props)(CompaniesCollection)
