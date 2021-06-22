import { omitBy, isEmpty } from 'lodash'
import qs from 'qs'

export const TASK_GET_EVENTS_LIST = 'TASK_GET_EVENTS_LIST'

export const ID = 'eventsList'

import { buildSelectedFilters } from './filters'
import { SORT_OPTIONS } from './constants'

const parseQueryString = (queryString) => {
  const queryStringObject = omitBy({ ...qs.parse(queryString) }, isEmpty)
  return {
    ...queryStringObject,
    page: parseInt(queryStringObject.page || 1, 10),
  }
}

/**
 * Convert both location and redux state to props
 */
export const state2props = ({ router, ...state }) => {
  const queryString = router.location.search.slice(1)
  const queryParams = parseQueryString(queryString)

  const { metadata } = state[ID]

  const selectedFilters = buildSelectedFilters({
    queryParams,
    metadata,
  })

  return {
    ...state[ID],
    payload: { ...queryParams },
    optionMetadata: {
      sortOptions: SORT_OPTIONS,
      ...metadata,
    },
    selectedFilters,
  }
}
