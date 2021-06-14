import { omitBy, isEmpty } from 'lodash'
import qs from 'qs'

export const TASK_GET_CONTACTS_LIST = 'TASK_GET_CONTACTS_LIST'
export const TASK_GET_CONTACTS_METADATA = 'TASK_GET_CONTACTS_METADATA'
export const ID = 'contactsList'

import { buildSelectedFilters } from './filters'
import { transformArchivedToApi } from './transformers'
import { STATUS_OPTIONS } from './metadata'

const parseQueryString = (queryString) => {
  const queryStringObject = omitBy({ ...qs.parse(queryString) }, isEmpty)
  return {
    ...queryStringObject,
    page: parseInt(queryStringObject.page || 1, 10),
  }
}

export const state2props = ({ router, ...state }) => {
  const queryString = router.location.search.slice(1)
  const queryStringObject = parseQueryString(queryString)
  const archived = transformArchivedToApi(queryStringObject.archived)
  const metadata = state[ID].metadata
  const selectedFilters = buildSelectedFilters(queryStringObject, metadata)
  return {
    ...state[ID],
    payload: {
      ...queryStringObject,
      archived,
    },
    selectedFilters,
    optionMetadata: {
      sortOptions: [],
      statusOptions: STATUS_OPTIONS,
      ...metadata,
    },
  }
}
