import React from 'react'
import { connect } from 'react-redux'

import urls from '../../../../lib/urls'

import {
  RoutedAdvisersTypeahead,
  RoutedTypeahead,
  CollectionFilters,
  ToggleSection,
  FilteredCollectionList,
  RoutedDateField,
  RoutedCheckboxGroupField,
} from '../../../../client/components'

import {
  TASK_GET_PROJECTS_LIST,
  TASK_GET_ADVISER_NAME,
  TASK_GET_INVESTMENTS_PROJECTS_METADATA,
  ID,
  state2props,
} from './state'

import {
  INVESTMENTS__PROJECTS_LOADED,
  INVESTMENTS__PROJECTS_SELECTED_ADVISERS,
  INVESTMENTS__PROJECTS_METADATA,
} from '../../../../client/actions'

const ProjectsCollection = ({
  payload,
  optionMetadata,
  selectedFilters,
  ...props
}) => {
  const collectionListTask = {
    name: TASK_GET_PROJECTS_LIST,
    id: ID,
    progressMessage: 'loading projects...',
    startOnRender: {
      payload,
      onSuccessDispatch: INVESTMENTS__PROJECTS_LOADED,
    },
  }
  const adviserListTask = {
    name: TASK_GET_ADVISER_NAME,
    id: ID,
    progressMessage: 'loading advisers...',
    startOnRender: {
      payload: payload.adviser,
      onSuccessDispatch: INVESTMENTS__PROJECTS_SELECTED_ADVISERS,
    },
  }
  const collectionListMetadataTask = {
    name: TASK_GET_INVESTMENTS_PROJECTS_METADATA,
    id: ID,
    progressMessage: 'loading metadata...',
    startOnRender: {
      payload: [
        { stage: urls.metadata.investmentProjectStage() },
        { sector: urls.metadata.sector() },
      ],
      onSuccessDispatch: INVESTMENTS__PROJECTS_METADATA,
    },
  }
  return (
    <FilteredCollectionList
      {...props}
      collectionName="Project"
      sortOptions={optionMetadata.sortOptions}
      taskProps={collectionListTask}
      selectedFilters={selectedFilters}
      baseDownloadLink="/investments/projects/export"
    >
      <CollectionFilters taskProps={collectionListMetadataTask}>
        <ToggleSection
          label="Company information"
          data-cy="company-information-filters"
          isOpen={true}
        >
          <RoutedCheckboxGroupField
            label="Stage"
            name="stage"
            qsParam="stage"
            options={optionMetadata.projectStageOptions}
            selectedOptions={selectedFilters.selectedStages}
            data-cy="stage-filter"
          />
          <RoutedAdvisersTypeahead
            taskProps={adviserListTask}
            isMulti={true}
            label="Advisers"
            name="adviser"
            qsParam="adviser"
            placeholder="Search advisers..."
            noOptionsMessage={() => <>No advisers found</>}
            selectedOptions={selectedFilters.selectedAdvisers}
            data-cy="adviser-filter"
          />
          <RoutedTypeahead
            isMulti={true}
            label="Sector"
            name="sector"
            qsParam="sector_descends"
            placeholder="Search sectors..."
            options={optionMetadata.sectorOptions}
            selectedOptions={selectedFilters.selectedSectors}
            data-cy="sector-filter"
          />
          <RoutedTypeahead
            isMulti={true}
            label="Country of origin"
            name="country"
            qsParam="country"
            placeholder="Search countries..."
            options={optionMetadata.countryOptions}
            selectedOptions={selectedFilters.selectedCountries}
            data-cy="country-filter"
          />
          <RoutedTypeahead
            isMulti={true}
            label="UK Region"
            name="uk_region"
            qsParam="uk_region"
            placeholder="Search UK regions..."
            options={optionMetadata.ukRegionOptions}
            selectedOptions={selectedFilters.selectedUkRegions}
            data-cy="uk-region-filter"
          />
          <RoutedCheckboxGroupField
            label="Status"
            name="project_status"
            qsParam="status"
            options={optionMetadata.projectStatusOptions}
            selectedOptions={selectedFilters.selectedProjectStatuses}
            data-cy="project-status-filter"
          />
          <RoutedCheckboxGroupField
            label="Type of investment"
            name="investment_type"
            qsParam="investment_type"
            options={optionMetadata.investmentTypeOptions}
            selectedOptions={selectedFilters.selectedInvestmentTypes}
            data-cy="investment-type-filter"
          />
          <RoutedCheckboxGroupField
            label="Likelihood to land"
            name="likelihood_to_land"
            qsParam="likelihood_to_land"
            options={optionMetadata.likelihoodToLandOptions}
            selectedOptions={selectedFilters.selectedLikelihoodToLands}
            data-cy="likelihood-to-land-filter"
          />
          <RoutedDateField
            label="Estimated land date before"
            name="estimated_land_date_before"
            qsParamName="estimated_land_date_before"
            data-cy="estimated-land-date-before-filter"
          />
          <RoutedDateField
            label="Estimated land date after"
            name="estimated_land_date_after"
            qsParamName="estimated_land_date_after"
            data-cy="estimated-land-date-after-filter"
          />
          <RoutedDateField
            label="Actual land date before"
            name="actual_land_date_before"
            qsParamName="actual_land_date_before"
            data-cy="actual-land-date-before-filter"
          />
          <RoutedDateField
            label="Actual land date after"
            name="actual_land_date_after"
            qsParamName="actual_land_date_after"
            data-cy="actual-land-date-after-filter"
          />
          <RoutedCheckboxGroupField
            label="Level of involvement specified"
            name="involvement_level"
            qsParam="level_of_involvement_simplified"
            options={optionMetadata.involvementLevelOptions}
            selectedOptions={selectedFilters.selectedInvolvementLevels}
            data-cy="involvement-level-filter"
          />
        </ToggleSection>
      </CollectionFilters>
    </FilteredCollectionList>
  )
}
export default connect(state2props)(ProjectsCollection)
