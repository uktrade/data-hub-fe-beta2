import qs from 'qs'

import { sectorOptions } from './labels'

export const TASK_GET_PROJECTS_LIST = 'TASK_GET_PROJECTS_LIST'
export const TASK_GET_ADVISER_NAME = 'TASK_GET_ADVISER_NAME'

export const ID = 'projectsList'

const parseVariablePropType = (prop) =>
  prop ? (Array.isArray(prop) ? prop : [prop]) : prop

const searchParamProps = ({
  adviser = false,
  // snake-case as comes from the query
  sector_descends = false,
  sortby = 'created_on:desc',
  estimated_land_date_before = null,
  estimated_land_date_after = null,
  page = 1,
}) => ({
  adviser: parseVariablePropType(adviser),
  sector_descends: parseVariablePropType(sector_descends),
  estimated_land_date_before,
  estimated_land_date_after,
  sortby,
  page,
})

const collectionListPayload = (paramProps) => {
  return Object.fromEntries(
    Object.entries(searchParamProps(paramProps)).filter((v) => v[1])
  )
}

const getOptionMetadata = ({
  sector_descends,
  estimated_land_date_before,
  estimated_land_date_after,
}) => ({
  sectors: sector_descends
    ? sectorOptions.filter((option) => sector_descends.includes(option.value))
    : [],
  estimated_land_date_before,
  estimated_land_date_after,
})

export const state2props = ({ router, ...state }) => {
  const queryProps = qs.parse(router.location.search.slice(1))
  return {
    ...state[ID],
    payload: collectionListPayload(queryProps),
    optionMetadata: getOptionMetadata(queryProps),
  }
}
