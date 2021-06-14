import { omitBy, isEmpty } from 'lodash'
import qs from 'qs'

export const TASK_GET_COMPANIES_LIST = 'TASK_GET_COMPANIES_LIST'
export const TASK_GET_COMPANIES_METADATA = 'TASK_GET_COMPANIES_METADATA'

export const ID = 'companiesList'

import { buildSelectedFilters } from './filters'
import { COMPANY_STATUS_OPTIONS } from './metadata'
import { transformArchivedToApi } from './transformers'

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
  const archived = transformArchivedToApi(queryParams.archived)

  const { metadata } = state[ID]

  const selectedFilters = buildSelectedFilters(queryParams, metadata)

  return {
    ...state[ID],
    payload: {
      ...queryParams,
      archived,
    },
    optionMetadata: {
      sortOptions: [],
      companyStatuses: COMPANY_STATUS_OPTIONS,
      ...metadata,
    },
    selectedFilters,
  }
}
