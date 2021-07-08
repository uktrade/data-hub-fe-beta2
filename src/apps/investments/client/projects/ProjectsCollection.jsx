import React from 'react'
import { connect } from 'react-redux'

import urls from '../../../../lib/urls'
import {
  RoutedAdvisersTypeahead,
  RoutedTypeahead,
  CollectionFilters,
  FilteredCollectionList,
  RoutedDateField,
  RoutedCheckboxGroupField,
} from '../../../../client/components'

import {
  TASK_GET_PROJECTS_LIST,
  TASK_GET_INVESTMENTS_PROJECTS_ADVISER_NAME,
  TASK_GET_INVESTMENTS_PROJECTS_METADATA,
  ID,
  state2props,
} from './state'

import {
  INVESTMENTS__PROJECTS_LOADED,
  INVESTMENTS__PROJECTS_SELECTED_ADVISERS,
  INVESTMENTS__SET_PROJECTS_METADATA,
} from '../../../../client/actions'

const ProjectsCollection = ({
  payload,
  currentAdviserId,
  optionMetadata,
  selectedFilters,
  ...props
}) => {
  const collectionListTask = {
    name: TASK_GET_PROJECTS_LIST,
    id: ID,
    progressMessage: 'Loading projects',
    startOnRender: {
      payload,
      onSuccessDispatch: INVESTMENTS__PROJECTS_LOADED,
    },
  }
  const adviserListTask = {
    name: TASK_GET_INVESTMENTS_PROJECTS_ADVISER_NAME,
    id: ID,
    progressMessage: 'Loading advisers',
    startOnRender: {
      payload: payload.adviser,
      onSuccessDispatch: INVESTMENTS__PROJECTS_SELECTED_ADVISERS,
    },
  }
  const collectionListMetadataTask = {
    name: TASK_GET_INVESTMENTS_PROJECTS_METADATA,
    id: ID,
    progressMessage: 'Loading filters',
    startOnRender: {
      payload: {
        projectStageOptions: urls.metadata.investmentProjectStage(),
        sectorOptions: urls.metadata.sector(),
        countryOptions: urls.metadata.country(),
        ukRegionOptions: urls.metadata.ukRegion(),
        investmentTypeOptions: urls.metadata.investmentType(),
        likelihoodToLandOptions: urls.metadata.likelihoodToLand(),
      },
      onSuccessDispatch: INVESTMENTS__SET_PROJECTS_METADATA,
    },
  }
  const myProjectsSelected = selectedFilters.advisers.options
    .map(({ value }) => value)
    .includes(currentAdviserId)
  const myProjectsOption = { label: 'My Projects', value: currentAdviserId }

  return (
    <FilteredCollectionList
      {...props}
      collectionName="project"
      sortOptions={optionMetadata.sortOptions}
      taskProps={collectionListTask}
      selectedFilters={selectedFilters}
      baseDownloadLink="/investments/projects/export"
      entityName="project"
      defaultQueryParams={{
        page: 1,
        sortby: 'created_on:desc',
      }}
    >
      <CollectionFilters taskProps={collectionListMetadataTask}>
        <RoutedCheckboxGroupField
          legend="Stage"
          name="stage"
          qsParam="stage"
          options={optionMetadata.projectStageOptions}
          selectedOptions={selectedFilters.stages.options}
          data-test="stage-filter"
        />
        <RoutedCheckboxGroupField
          legend="My Projects"
          name="my_projects"
          qsParam="adviser"
          options={[myProjectsOption]}
          selectedOptions={myProjectsSelected ? [myProjectsOption] : []}
          data-test="my-projects-filter"
        />
        <RoutedAdvisersTypeahead
          taskProps={adviserListTask}
          isMulti={true}
          legend="Adviser"
          name="adviser"
          qsParam="adviser"
          placeholder="Search adviser"
          noOptionsMessage={() => <>No advisers found</>}
          selectedOptions={selectedFilters.advisers.options}
          data-test="adviser-filter"
        />
        <RoutedTypeahead
          isMulti={true}
          legend="Sector"
          name="sector"
          qsParam="sector_descends"
          placeholder="Search sector"
          options={optionMetadata.sectorOptions}
          selectedOptions={selectedFilters.sectors.options}
          data-test="sector-filter"
        />
        <RoutedTypeahead
          isMulti={true}
          legend="Country of origin"
          name="country"
          qsParam="country_investment_originates_from"
          placeholder="Search country"
          options={optionMetadata.countryOptions}
          selectedOptions={selectedFilters.countries.options}
          data-test="country-filter"
        />
        <RoutedTypeahead
          isMulti={true}
          legend="UK region"
          name="uk_region"
          qsParam="uk_region_location"
          placeholder="Search UK region"
          options={optionMetadata.ukRegionOptions}
          selectedOptions={selectedFilters.ukRegions.options}
          data-test="uk-region-filter"
        />
        <RoutedCheckboxGroupField
          legend="Status"
          name="project_status"
          qsParam="status"
          options={optionMetadata.projectStatusOptions}
          selectedOptions={selectedFilters.statuses.options}
          data-test="project-status-filter"
        />
        <RoutedCheckboxGroupField
          legend="Type of investment"
          name="investment_type"
          qsParam="investment_type"
          options={optionMetadata.investmentTypeOptions}
          selectedOptions={selectedFilters.investmentTypes.options}
          data-test="investment-type-filter"
        />
        <RoutedCheckboxGroupField
          legend="Likelihood to land"
          name="likelihood_to_land"
          qsParam="likelihood_to_land"
          options={optionMetadata.likelihoodToLandOptions}
          selectedOptions={selectedFilters.likelihoodToLand.options}
          data-test="likelihood-to-land-filter"
        />
        <RoutedDateField
          label="Estimated land date before"
          name="estimated_land_date_before"
          qsParamName="estimated_land_date_before"
          data-test="estimated-land-date-before-filter"
        />
        <RoutedDateField
          label="Estimated land date after"
          name="estimated_land_date_after"
          qsParamName="estimated_land_date_after"
          data-test="estimated-land-date-after-filter"
        />
        <RoutedDateField
          label="Actual land date before"
          name="actual_land_date_before"
          qsParamName="actual_land_date_before"
          data-test="actual-land-date-before-filter"
        />
        <RoutedDateField
          label="Actual land date after"
          name="actual_land_date_after"
          qsParamName="actual_land_date_after"
          data-test="actual-land-date-after-filter"
        />
        <RoutedCheckboxGroupField
          legend="Level of involvement specified"
          name="involvement_level"
          qsParam="level_of_involvement_simplified"
          options={optionMetadata.involvementLevelOptions}
          selectedOptions={selectedFilters.involvementLevels.options}
          data-test="involvement-level-filter"
        />
      </CollectionFilters>
    </FilteredCollectionList>
  )
}
export default connect(state2props)(ProjectsCollection)
