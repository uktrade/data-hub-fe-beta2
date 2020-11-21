import qs from 'qs'

import {
  sortOptions,
  sectorOptions,
  estimatedLandDateBefore,
  estimatedLandDateAfter,
} from './metadata'

export const TASK_GET_PROJECTS_LIST = 'TASK_GET_PROJECTS_LIST'
export const TASK_GET_ADVISER_NAME = 'TASK_GET_ADVISER_NAME'

export const ID = 'projectsList'

const parseVariablePropType = (prop) =>
  prop ? (Array.isArray(prop) ? prop : [prop]) : prop

const searchParamProps = ({
  sortby = 'created_on:desc',
  page = 1,
  adviser = false,
  // snake-case as comes from the query
  sector_descends = false,
  estimated_land_date_before = null,
  estimated_land_date_after = null,
}) => ({
  adviser: parseVariablePropType(adviser),
  sector_descends: parseVariablePropType(sector_descends),
  estimated_land_date_before,
  estimated_land_date_after,
  sortby,
  page,
})

// Filters out falsey values
const collectionListPayload = (paramProps) => {
  return Object.fromEntries(
    Object.entries(searchParamProps(paramProps)).filter((v) => v[1])
  )
}
// Gets the label or name of the selected filter
const getFilterLabel = (metadataOptions, filterProp) =>
  metadataOptions.filter((option) => filterProp.includes(option.value))

export const state2props = ({ router, ...state }) => {
  // Get the query props if they exist
  const queryProps = qs.parse(router.location.search.slice(1))

  // Get the filtered props
  const filteredQueryProps = collectionListPayload(queryProps)

  // If they exist we deconstruct them, if no prop then set a default
  const {
    sector_descends = [],
    estimated_land_date_before,
    estimated_land_date_after,
  } = queryProps

  // Set the selected filters
  const selectedFilters = {
    selectedSectors: getFilterLabel(sectorOptions, sector_descends),
    selectedEstimatedLandDatesBefore: [
      {
        label: estimatedLandDateBefore,
        value: estimated_land_date_before,
      },
    ],
    selectedEstimatedLandDatesAfter: [
      {
        label: estimatedLandDateAfter,
        value: estimated_land_date_after,
      },
    ],
  }

  return {
    ...state[ID],
    payload: filteredQueryProps,
    optionMetadata: { sortOptions, sectorOptions, estimatedLandDateBefore },
    selectedFilters,
  }
}
