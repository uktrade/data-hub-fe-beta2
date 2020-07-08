import {
  TASK_UPDATE__INTERACTIONS,
  INTERACTIONS__FILTERS_CHANGE,
  INTERACTIONS__PAGE_CHANGE,
} from '../../../../../client/actions'

export default (
  state = {
    interactions: [],
    filters: {},
    count: null,
    page: 0,
  },
  { type, result, filters, page }
) => {
  switch (type) {
    case TASK_UPDATE__INTERACTIONS:
      return {
        ...state,
        interactions: result.results,
        count: result.count,
      }
    case INTERACTIONS__FILTERS_CHANGE:
      return {
        ...state,
        filters,
      }
    case INTERACTIONS__PAGE_CHANGE:
      return {
        ...state,
        page,
      }
    default:
      return state
  }
}
