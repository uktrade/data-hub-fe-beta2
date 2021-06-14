import React from 'react'
import { connect } from 'react-redux'

import {
  CONTACTS__LOADED,
  CONTACTS__METADATA_LOADED,
} from '../../../client/actions'

import {
  RoutedTypeahead,
  RoutedInputField,
  CollectionFilters,
  FilteredCollectionList,
  RoutedCheckboxGroupField,
} from '../../../client/components'

import {
  ID,
  state2props,
  TASK_GET_CONTACTS_LIST,
  TASK_GET_CONTACTS_METADATA,
} from './state'

const ContactsCollection = ({
  payload,
  optionMetadata,
  selectedFilters,
  ...props
}) => {
  const collectionListTask = {
    name: TASK_GET_CONTACTS_LIST,
    id: ID,
    progressMessage: 'loading contacts',
    startOnRender: {
      payload,
      onSuccessDispatch: CONTACTS__LOADED,
    },
  }

  const collectionListMetadataTask = {
    name: TASK_GET_CONTACTS_METADATA,
    id: ID,
    progressMessage: 'loading metadata',
    startOnRender: {
      onSuccessDispatch: CONTACTS__METADATA_LOADED,
    },
  }

  return (
    <FilteredCollectionList
      {...props}
      collectionName="Contacts"
      sortOptions={optionMetadata.sortOptions}
      taskProps={collectionListTask}
      selectedFilters={selectedFilters}
      baseDownloadLink="/contacts/export"
      entityName="contact"
    >
      <CollectionFilters taskProps={collectionListMetadataTask}>
        <RoutedInputField
          id="ContactsCollection.name"
          qsParam="name"
          name="name"
          label="Contact name"
          placeholder="Search contact name"
          data-test="contact-name-filter"
        />
        <RoutedInputField
          id="ContactsCollection.company-name"
          qsParam="company_name"
          name="company_name"
          label="Company name"
          placeholder="Search company name"
          data-test="company-name-filter"
        />
        <RoutedTypeahead
          isMulti={true}
          legend="Sector"
          name="sector"
          qsParam="company_sector_descends"
          placeholder="Search sectors"
          options={optionMetadata.sectorOptions}
          selectedOptions={selectedFilters.selectedCompanySectors}
          data-test="sector-filter"
        />
        <RoutedTypeahead
          isMulti={true}
          legend="Country of origin"
          name="country"
          qsParam="address_country"
          placeholder="Search countries"
          options={optionMetadata.countryOptions}
          selectedOptions={selectedFilters.selectedAddressCountries}
          data-test="country-filter"
        />
        <RoutedTypeahead
          isMulti={true}
          legend="UK Region"
          name="uk_region"
          qsParam="company_uk_region"
          placeholder="Search UK regions"
          options={optionMetadata.ukRegionOptions}
          selectedOptions={selectedFilters.selectedCompanyUkRegions}
          data-test="uk-region-filter"
        />
        <RoutedCheckboxGroupField
          legend="Status"
          name="archived"
          qsParam="archived"
          options={optionMetadata.statusOptions}
          selectedOptions={selectedFilters.selectedStatus}
          data-test="status-filter"
        />
      </CollectionFilters>
    </FilteredCollectionList>
  )
}

export default connect(state2props)(ContactsCollection)
