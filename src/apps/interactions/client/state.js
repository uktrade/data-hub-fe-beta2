import { omitBy, isEmpty } from 'lodash'
import qs from 'qs'

export const TASK_GET_INTERACTIONS_LIST = 'TASK_GET_INTERACTIONS_LIST'
export const ID = 'interactionsList'

const getFilteredQueryParams = (router) => {
  const queryParams = router.location.search.slice(1)
  const filteredQueryParams = omitBy({ ...qs.parse(queryParams) }, isEmpty)
  return {
    ...filteredQueryParams,
    page: parseInt(filteredQueryParams.page || 1, 10),
  }
}

export const state2props = ({ router, ...state }) => {
  const filteredQueryParams = getFilteredQueryParams(router)
  const { metadata } = state[ID]

  return {
    ...state[ID],
    selectedFilters: {},
    payload: filteredQueryParams,
    optionMetadata: {
      sortOptions: [],
      ...metadata,
    },
  }
}
