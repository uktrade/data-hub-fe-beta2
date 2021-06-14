import {
  INVESTMENTS__PROJECTS_LOADED,
  INVESTMENTS__PROJECTS_SELECTED_ADVISERS,
  INVESTMENTS__SET_PROJECTS_METADATA,
} from '../../../../client/actions'

const initialState = {
  results: [],
  selectedAdvisers: [],
  metadata: {},
  isComplete: false,
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case INVESTMENTS__PROJECTS_LOADED:
      return {
        ...state,
        count: result.count,
        results: result.results,
        isComplete: true,
      }
    case INVESTMENTS__PROJECTS_SELECTED_ADVISERS:
      return {
        ...state,
        selectedAdvisers: result,
      }
    case INVESTMENTS__SET_PROJECTS_METADATA:
      return {
        ...state,
        metadata: result,
      }
    default:
      return state
  }
}
