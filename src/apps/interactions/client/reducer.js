import {
  INTERACTIONS__LOADED,
  INTERACTIONS_SELECTED_ADVISERS,
  INTERACTIONS__METADATA_LOADED,
} from '../../../client/actions'

const initialState = {
  results: [],
  metadata: {},
  selectedAdvisers: [],
  isComplete: false,
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case INTERACTIONS__LOADED:
      return {
        ...state,
        ...result,
        isComplete: true,
      }
    case INTERACTIONS_SELECTED_ADVISERS:
      return {
        ...state,
        selectedAdvisers: result,
      }
    case INTERACTIONS__METADATA_LOADED:
      return {
        ...state,
        metadata: result,
      }
    default:
      return state
  }
}
