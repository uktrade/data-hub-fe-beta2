import { omitBy, isEmpty } from 'lodash'
import qs from 'qs'

export const TASK_GET_INTERACTIONS_LIST = 'TASK_GET_INTERACTIONS_LIST'
export const TASK_GET_INTERACTIONS_ADVISER_NAME =
  'TASK_GET_INTERACTIONS_ADVISER_NAME'
export const TASK_GET_INTERACTIONS_METADATA = 'TASK_GET_INTERACTIONS_METADATA'

export const ID = 'interactionsList'

import { buildSelectedFilters } from './filters'

const parseQueryString = (queryString) => {
  const queryProps = omitBy({ ...qs.parse(queryString) }, isEmpty)
  return {
    ...queryProps,
    page: parseInt(queryProps.page || 1, 10),
  }
}

export const state2props = ({ router, ...state }) => {
  const queryString = router.location.search.slice(1)
  const queryParams = parseQueryString(queryString)

  const { selectedAdvisers, metadata } = state[ID]

  const selectedFilters = buildSelectedFilters({
    queryParams,
    metadata,
    selectedAdvisers,
  })

  return {
    ...state[ID],
    payload: queryParams,
    optionMetadata: {
      sortOptions: [],
      ...metadata,
    },
    selectedFilters,
  }
}
