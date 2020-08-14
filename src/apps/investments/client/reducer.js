import {
  INVESTMENTS__PROFILES_LOADED,
  INVESTMENTS__PROFILES_SELECT_PAGE,
  INVESTMENTS__PROFILES_SORT_BY_CHANGED,
} from '../../../client/actions'
import { transformLargeCapitalProfiles } from '../transformers/profiles'

const initialState = {
  page: 1,
  count: undefined,
  results: [],
  isComplete: false,
  sortBy: '-created_on',
}

export default (state = initialState, { type, result, page, sortBy }) => {
  switch (type) {
    case INVESTMENTS__PROFILES_LOADED:
      return {
        ...state,
        count: result.count,
        results: result?.results?.map(transformLargeCapitalProfiles),
        isComplete: true,
      }
    case INVESTMENTS__PROFILES_SELECT_PAGE:
      return {
        ...state,
        page,
      }
    case INVESTMENTS__PROFILES_SORT_BY_CHANGED:
      return {
        ...state,
        sortBy,
      }
    default:
      return state
  }
}
