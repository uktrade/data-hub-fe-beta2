import React from 'react'
import { connect } from 'react-redux'

import urls from '../../../lib/urls'
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
      payload: {
        headquarterTypeOptions: urls.metadata.headquarterType(),
        sectorOptions: urls.metadata.sector(),
      },
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
          legend="Type"
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
          label="Company name"
          placeholder="Search company name"
          data-test="company-name-filter"
        />
        <RoutedTypeahead
          isMulti={true}
          legend="Sector"
          name="sector"
          qsParam="sector_descends"
          placeholder="Search sectors"
          options={optionMetadata.sectorOptions}
          selectedOptions={selectedFilters.selectedSectors}
          data-test="sector-filter"
        />
      </CollectionFilters>
    </FilteredCollectionList>
  )
}

export default connect(state2props)(CompaniesCollection)
