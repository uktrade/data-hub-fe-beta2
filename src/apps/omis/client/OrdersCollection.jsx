import React from 'react'
import { connect } from 'react-redux'
import { LABELS } from './constants'

import {
  ORDERS__LOADED,
  ORDERS__METADATA_LOADED,
} from '../../../client/actions'

import {
  RoutedTypeahead,
  RoutedInputField,
  CollectionFilters,
  FilteredCollectionList,
} from '../../../client/components'

import {
  ID,
  state2props,
  TASK_GET_ORDERS_LIST,
  TASK_GET_ORDERS_METADATA,
} from './state'

const OrdersCollection = ({
  payload,
  optionMetadata,
  selectedFilters,
  ...props
}) => {
  const collectionListTask = {
    name: TASK_GET_ORDERS_LIST,
    id: ID,
    progressMessage: 'Loading orders',
    startOnRender: {
      payload,
      onSuccessDispatch: ORDERS__LOADED,
    },
  }

  const collectionListMetadataTask = {
    name: TASK_GET_ORDERS_METADATA,
    id: ID,
    progressMessage: 'Loading filters',
    startOnRender: {
      payload: {},
      onSuccessDispatch: ORDERS__METADATA_LOADED,
    },
  }

  return (
    <FilteredCollectionList
      {...props}
      collectionName="order"
      sortOptions={optionMetadata.sortOptions}
      taskProps={collectionListTask}
      selectedFilters={selectedFilters}
      entityName="order"
      entityNamePlural="order"
      addItemUrl="/omis/create"
      defaultQueryParams={{
        page: 1,
        sortby: 'created_on:desc',
      }}
    >
      <CollectionFilters taskProps={collectionListMetadataTask}>
        <RoutedInputField
          id="OrdersCollection.company-name"
          qsParam="company_name"
          name="company_name"
          label={LABELS.companyName}
          placeholder="Search company name"
          data-test="company-name-filter"
        />
        <RoutedInputField
          id="OrdersCollection.contact_name"
          qsParam="contact_name"
          name="contact_name"
          label={LABELS.contactName}
          placeholder="Search contact name"
          data-test="contact-name-filter"
        />
        <RoutedTypeahead
          isMulti={true}
          legend={LABELS.sector}
          name="sector_descends"
          qsParam="sector_descends"
          placeholder="Search sectors"
          options={optionMetadata.sectorOptions}
          selectedOptions={selectedFilters.selectedSectors}
          data-test="sector-filter"
        />
        <RoutedTypeahead
          isMulti={true}
          legend={LABELS.country}
          name="primary_market"
          qsParam="primary_market"
          placeholder="Search countries"
          options={optionMetadata.countryOptions}
          selectedOptions={selectedFilters.selectedPrimaryMarkets}
          data-test="country-filter"
        />
        <RoutedTypeahead
          isMulti={true}
          legend={LABELS.ukRegion}
          name="uk_region"
          qsParam="uk_region"
          placeholder="Search UK regions"
          options={optionMetadata.ukRegionOptions}
          selectedOptions={selectedFilters.selectedUkRegions}
          data-test="uk-region-filter"
        />
      </CollectionFilters>
    </FilteredCollectionList>
  )
}

export default connect(state2props)(OrdersCollection)
