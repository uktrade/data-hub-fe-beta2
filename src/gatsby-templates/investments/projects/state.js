import qs from 'qs'
import dateFns from 'date-fns'

import {
  actualLandDateBeforeLabel,
  actualLandDateAfterLabel,
  adviserLabel,
  countryLabel,
  estimatedLandDateBeforeLabel,
  estimatedLandDateAfterLabel,
  investmentTypeLabel,
  involvementLevelLabel,
  involvementLevelOptions,
  likelihoodToLandLabel,
  projectStatusLabel,
  projectStatusOptions,
  sectorLabel,
  sortOptions,
  ukRegionLabel,
  stageLabel,
} from './metadata'

export const TASK_GET_PROJECTS_LIST = 'TASK_GET_PROJECTS_LIST'
export const TASK_GET_ADVISER_NAME = 'TASK_GET_ADVISER_NAME'
export const TASK_GET_INVESTMENTS_PROJECTS_METADATA =
  'TASK_GET_INVESTMENTS_PROJECTS_METADATA'

export const ID = 'projectsList'

const parseVariablePropType = (prop) =>
  prop ? (Array.isArray(prop) ? prop : [prop]) : prop

const searchParamProps = ({
  sortby = 'created_on:desc',
  page = 1,
  adviser = false,
  sector_descends = false,
  country = false,
  uk_region = false,
  stage = false,
  status = false,
  investment_type = false,
  likelihood_to_land = false,
  estimated_land_date_before = null,
  estimated_land_date_after = null,
  actual_land_date_before = null,
  actual_land_date_after = null,
  level_of_involvement_simplified = false,
}) => ({
  adviser: parseVariablePropType(adviser),
  sector_descends: parseVariablePropType(sector_descends),
  country: parseVariablePropType(country),
  uk_region: parseVariablePropType(uk_region),
  stage: parseVariablePropType(stage),
  status: parseVariablePropType(status),
  investment_type: parseVariablePropType(investment_type),
  likelihood_to_land: parseVariablePropType(likelihood_to_land),
  estimated_land_date_before,
  estimated_land_date_after,
  actual_land_date_before,
  actual_land_date_after,
  level_of_involvement_simplified,
  sortby,
  page,
})

const collectionListPayload = (paramProps) => {
  return Object.fromEntries(
    Object.entries(searchParamProps(paramProps)).filter((v) => v[1])
  )
}

/**
 * Build the options filter to include value, label and category label
 */
const buildOptionsFilter = ({ options = [], value, categoryLabel = '' }) => {
  const optionsFilter = options.filter((option) => value.includes(option.value))
  if (categoryLabel) {
    return optionsFilter.map(({ value, label }) => ({
      value,
      label,
      categoryLabel,
    }))
  } else {
    return optionsFilter
  }
}

const getDateLabel = (value) =>
  value ? `${dateFns.format(value, 'D MMMM YYYY')}` : ''

const buildDatesFilter = ({ value, categoryLabel = '' }) =>
  value ? [{ label: getDateLabel(value), value, categoryLabel }] : []

/**
 * Convert both location and redux state to investment projects props
 *
 * Selected filters are built from the page's query props as well as the
 * selected advisers in state.
 */
export const state2props = ({ router, ...state }) => {
  const queryProps = qs.parse(router.location.search.slice(1))
  const filteredQueryProps = collectionListPayload(queryProps)
  const { selectedAdvisers, metadata } = state.projectsList
  const {
    sector_descends = [],
    country = [],
    uk_region = [],
    stage = [],
    status = [],
    investment_type = [],
    likelihood_to_land = [],
    estimated_land_date_before,
    estimated_land_date_after,
    actual_land_date_before,
    actual_land_date_after,
    level_of_involvement_simplified = [],
  } = queryProps

  const selectedFilters = {
    selectedAdvisers: selectedAdvisers.map(({ advisers }) => ({
      label: advisers.name,
      value: advisers.id,
      categoryLabel: adviserLabel,
    })),
    selectedSectors: buildOptionsFilter({
      options: metadata.sectorOptions,
      value: sector_descends,
      categoryLabel: sectorLabel,
    }),
    selectedCountries: buildOptionsFilter({
      options: metadata.countryOptions,
      value: country,
      categoryLabel: countryLabel,
    }),
    selectedUkRegions: buildOptionsFilter({
      options: metadata.ukRegionOptions,
      value: uk_region,
      categoryLabel: ukRegionLabel,
    }),
    selectedStages: buildOptionsFilter({
      options: metadata.projectStageOptions,
      value: stage,
      categoryLabel: stageLabel,
    }),
    selectedProjectStatuses: buildOptionsFilter({
      options: projectStatusOptions,
      value: status,
      categoryLabel: projectStatusLabel,
    }),
    selectedInvestmentTypes: buildOptionsFilter({
      options: metadata.investmentTypeOptions,
      value: investment_type,
      categoryLabel: investmentTypeLabel,
    }),
    selectedLikelihoodToLands: buildOptionsFilter({
      options: metadata.likelihoodToLandOptions,
      value: likelihood_to_land,
      categoryLabel: likelihoodToLandLabel,
    }),
    selectedEstimatedLandDatesBefore: buildDatesFilter({
      value: estimated_land_date_before,
      categoryLabel: estimatedLandDateBeforeLabel,
    }),
    selectedEstimatedLandDatesAfter: buildDatesFilter({
      value: estimated_land_date_after,
      categoryLabel: estimatedLandDateAfterLabel,
    }),
    selectedActualLandDatesBefore: buildDatesFilter({
      value: actual_land_date_before,
      categoryLabel: actualLandDateBeforeLabel,
    }),
    selectedActualLandDatesAfter: buildDatesFilter({
      value: actual_land_date_after,
      categoryLabel: actualLandDateAfterLabel,
    }),
    selectedInvolvementLevels: buildOptionsFilter({
      options: involvementLevelOptions,
      value: level_of_involvement_simplified,
      categoryLabel: involvementLevelLabel,
    }),
  }

  return {
    ...state[ID],
    payload: filteredQueryProps,
    optionMetadata: {
      sortOptions,
      projectStatusOptions,
      involvementLevelOptions,
      ...metadata,
    },
    selectedFilters,
  }
}
