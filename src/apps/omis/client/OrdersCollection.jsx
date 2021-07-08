import React from 'react'
import { connect } from 'react-redux'
import { LABELS } from './constants'

import {
  ORDERS__LOADED,
  ORDERS__METADATA_LOADED,
} from '../../../client/actions'

import {
  RoutedDateField,
  RoutedTypeahead,
  RoutedInputField,
  CollectionFilters,
  FilteredCollectionList,
  RoutedCheckboxGroupField,
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
      addItemUrl="/omis/create"
      entityName="order"
      entityNamePlural="orders"
      baseDownloadLink="/omis/export"
      defaultQueryParams={{
        page: 1,
        sortby: 'created_on:desc',
      }}
    >
      <CollectionFilters taskProps={collectionListMetadataTask}>
        <RoutedCheckboxGroupField
          legend={LABELS.status}
          name="status"
          qsParam="status"
          options={optionMetadata.statusOptions}
          selectedOptions={selectedFilters.statuses.options}
          data-test="status-filter"
        />
        <RoutedInputField
          id="OrdersCollection.reference"
          qsParam="reference"
          name="reference"
          label={LABELS.reference}
          placeholder="Search order reference"
          data-test="reference-filter"
        />
        <RoutedDateField
          label={LABELS.completedOnAfter}
          name="completed_on_after"
          qsParamName="completed_on_after"
          data-test="completed-on-after-filter"
        />
        <RoutedDateField
          label={LABELS.completedOnBefore}
          name="completed_on_before"
          qsParamName="completed_on_before"
          data-test="completed-on-before-filter"
        />
        <RoutedDateField
          label={LABELS.deliveryDateAfter}
          name="delivery_date_after"
          qsParamName="delivery_date_after"
          data-test="delivery-date-after-filter"
        />
        <RoutedDateField
          label={LABELS.deliveryDateBefore}
          name="delivery_date_before"
          qsParamName="delivery_date_before"
          data-test="delivery-date-before-filter"
        />
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
          placeholder="Search sector"
          options={optionMetadata.sectorOptions}
          selectedOptions={selectedFilters.sectors.options}
          data-test="sector-filter"
        />
        <RoutedTypeahead
          isMulti={true}
          legend={LABELS.primaryMarket}
          name="primary_market"
          qsParam="primary_market"
          placeholder="Search country"
          options={optionMetadata.omisMarketOptions}
          selectedOptions={selectedFilters.omisMarkets.options}
          data-test="country-filter"
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
      </CollectionFilters>
    </FilteredCollectionList>
  )
}

export default connect(state2props)(OrdersCollection)
