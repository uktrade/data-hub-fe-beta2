import React from 'react'
import { connect } from 'react-redux'
import { LABELS } from './constants'

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
    progressMessage: 'Loading contacts',
    startOnRender: {
      payload,
      onSuccessDispatch: CONTACTS__LOADED,
    },
  }

  const collectionListMetadataTask = {
    name: TASK_GET_CONTACTS_METADATA,
    id: ID,
    progressMessage: 'Loading filters',
    startOnRender: {
      onSuccessDispatch: CONTACTS__METADATA_LOADED,
    },
  }

  return (
    <FilteredCollectionList
      {...props}
      collectionName="contacts"
      sortOptions={optionMetadata.sortOptions}
      taskProps={collectionListTask}
      selectedFilters={selectedFilters}
      baseDownloadLink="/contacts/export"
      entityName="contact"
      defaultQueryParams={{
        archived: ['false'],
        sortby: 'modified_on:desc',
        page: 1,
      }}
    >
      <CollectionFilters taskProps={collectionListMetadataTask}>
        <RoutedInputField
          id="ContactsCollection.name"
          qsParam="name"
          name="name"
          label={LABELS.contactName}
          placeholder="Search contact name"
          data-test="contact-name-filter"
        />
        <RoutedInputField
          id="ContactsCollection.company-name"
          qsParam="company_name"
          name="company_name"
          label={LABELS.companyName}
          placeholder="Search company name"
          data-test="company-name-filter"
        />
        <RoutedTypeahead
          isMulti={true}
          legend={LABELS.sector}
          name="sector"
          qsParam="company_sector_descends"
          placeholder="Search sector"
          options={optionMetadata.sectorOptions}
          selectedOptions={selectedFilters.companySectors.options}
          data-test="sector-filter"
        />
        <RoutedTypeahead
          isMulti={true}
          legend={LABELS.country}
          name="country"
          qsParam="address_country"
          placeholder="Search country"
          options={optionMetadata.countryOptions}
          selectedOptions={selectedFilters.addressCountries.options}
          data-test="country-filter"
        />
        <RoutedTypeahead
          isMulti={true}
          legend={LABELS.ukRegion}
          name="uk_region"
          qsParam="company_uk_region"
          placeholder="Search UK region"
          options={optionMetadata.ukRegionOptions}
          selectedOptions={selectedFilters.companyUkRegions.options}
          data-test="uk-region-filter"
        />
        <RoutedCheckboxGroupField
          legend={LABELS.status}
          name="archived"
          qsParam="archived"
          options={optionMetadata.statusOptions}
          selectedOptions={selectedFilters.statuses.options}
          data-test="status-filter"
        />
      </CollectionFilters>
    </FilteredCollectionList>
  )
}

export default connect(state2props)(ContactsCollection)
