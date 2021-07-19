import React from 'react'
import { connect } from 'react-redux'

import {
  INTERACTIONS__LOADED,
  INTERACTIONS_SELECTED_ADVISERS,
  INTERACTIONS__METADATA_LOADED,
  INTERACTIONS_SELECTED_TEAMS,
} from '../../../client/actions'

import { LABELS, KIND_OPTIONS, BUSINESS_INTELLIGENCE_OPTION } from './constants'

import {
  FilteredCollectionList,
  RoutedCheckboxGroupField,
  RoutedAdvisersTypeahead,
  RoutedTypeahead,
  RoutedDateField,
  RoutedTeamsTypeahead,
  CollectionFilters,
} from '../../../client/components'

import {
  ID,
  state2props,
  TASK_GET_INTERACTIONS_LIST,
  TASK_GET_INTERACTIONS_ADVISER_NAME,
  TASK_GET_INTERACTIONS_METADATA,
  TASK_GET_INTERACTIONS_TEAM_NAME,
} from './state'

const InteractionCollection = ({
  payload,
  optionMetadata,
  selectedFilters,
  currentAdviserId,
  ...props
}) => {
  const collectionListTask = {
    name: TASK_GET_INTERACTIONS_LIST,
    id: ID,
    progressMessage: 'Loading interactions',
    startOnRender: {
      payload,
      onSuccessDispatch: INTERACTIONS__LOADED,
    },
  }
  const adviserListTask = {
    name: TASK_GET_INTERACTIONS_ADVISER_NAME,
    id: ID,
    progressMessage: 'Loading advisers',
    startOnRender: {
      payload: payload.adviser,
      onSuccessDispatch: INTERACTIONS_SELECTED_ADVISERS,
    },
  }

  const collectionListMetadataTask = {
    name: TASK_GET_INTERACTIONS_METADATA,
    id: ID,
    progressMessage: 'Loading filters',
    startOnRender: {
      onSuccessDispatch: INTERACTIONS__METADATA_LOADED,
    },
  }

  const myInteractionsSelected = selectedFilters.advisers.options
    .map(({ value }) => value)
    .includes(currentAdviserId)

  const myInteractionsOption = {
    label: LABELS.myInteractions,
    value: currentAdviserId,
  }

  const teamListTask = {
    name: TASK_GET_INTERACTIONS_TEAM_NAME,
    id: ID,
    progressMessage: 'Loading teams',
    startOnRender: {
      payload: payload.dit_participants__team,
      onSuccessDispatch: INTERACTIONS_SELECTED_TEAMS,
    },
  }

  return (
    <FilteredCollectionList
      {...props}
      collectionName="interaction"
      sortOptions={optionMetadata.sortOptions}
      taskProps={collectionListTask}
      selectedFilters={selectedFilters}
      baseDownloadLink="/interactions/export"
      entityName="interaction"
      defaultQueryParams={{
        sortby: 'date:desc',
        page: 1,
      }}
    >
      <CollectionFilters taskProps={collectionListMetadataTask}>
        <RoutedCheckboxGroupField
          legend={LABELS.kind}
          name="kind"
          qsParam="kind"
          options={KIND_OPTIONS}
          selectedOptions={selectedFilters.kind.options}
          data-test="status-filter"
        />
        <RoutedCheckboxGroupField
          name="dit_participants__adviser"
          qsParam="adviser"
          options={[myInteractionsOption]}
          selectedOptions={myInteractionsSelected ? [myInteractionsOption] : []}
          data-test="my-interactions-filter"
        />
        <RoutedAdvisersTypeahead
          taskProps={adviserListTask}
          isMulti={true}
          legend={LABELS.advisers}
          name="adviser"
          qsParam="adviser"
          placeholder="Search adviser"
          noOptionsMessage={() => <>No advisers found</>}
          selectedOptions={selectedFilters.advisers.options}
          data-test="adviser-filter"
        />
        <RoutedDateField
          label={LABELS.dateAfter}
          name="date_after"
          qsParamName="date_after"
          data-test="date-after-filter"
        />
        <RoutedDateField
          label={LABELS.dateBefore}
          name="date_before"
          qsParamName="date_before"
          data-test="date-before-filter"
        />
        <RoutedTeamsTypeahead
          taskProps={teamListTask}
          isMulti={true}
          legend={LABELS.teams}
          name="dit_participants__team"
          qsParam="dit_participants__team"
          placeholder="Search teams"
          noOptionsMessage={() => <>No teams found</>}
          selectedOptions={selectedFilters.teams.options}
          data-test="team-filter"
        />
        <RoutedCheckboxGroupField
          maxScrollHeight={350}
          legend={LABELS.service}
          name="service"
          qsParam="service"
          options={optionMetadata.serviceOptions}
          selectedOptions={selectedFilters.service.options}
          data-test="service-filter"
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
        <RoutedCheckboxGroupField
          legend={LABELS.businessIntelligence}
          name="was_policy_feedback_provided"
          qsParam="was_policy_feedback_provided"
          options={BUSINESS_INTELLIGENCE_OPTION}
          selectedOptions={selectedFilters.businessIntelligence.options}
          data-test="business-intelligence-filter"
        />
        <RoutedCheckboxGroupField
          maxScrollHeight={345}
          legend={LABELS.policyAreas}
          name="policy_areas"
          qsParam="policy_areas"
          options={optionMetadata.policyAreaOptions}
          selectedOptions={selectedFilters.policyArea.options}
          data-test="policy-area-filter"
        />
        <RoutedCheckboxGroupField
          legend={LABELS.policyIssueType}
          name="policy_issue_types"
          qsParam="policy_issue_types"
          options={optionMetadata.policyIssueTypeOptions}
          selectedOptions={selectedFilters.policyIssueType.options}
          data-test="policy-issue-type-filter"
        />
        <RoutedCheckboxGroupField
          maxScrollHeight={370}
          legend={LABELS.companyOneListGroupTier}
          name="company_one_list_group_tier"
          qsParam="company_one_list_group_tier"
          options={optionMetadata.companyOneListTierOptions}
          selectedOptions={selectedFilters.companyOneListGroupTier.options}
          data-test="company-one-list-group-tier-filter"
        />
      </CollectionFilters>
    </FilteredCollectionList>
  )
}

export default connect(state2props)(InteractionCollection)
