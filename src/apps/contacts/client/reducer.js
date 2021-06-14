import {
  CONTACTS__LOADED,
  CONTACTS__METADATA_LOADED,
} from '../../../client/actions'

const initialState = {
  results: [],
  metadata: {},
  isComplete: false,
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case CONTACTS__LOADED:
      return {
        ...state,
        ...result,
        isComplete: true,
      }
    case CONTACTS__METADATA_LOADED:
      return {
        ...state,
        metadata: result,
      }
    default:
      return state
  }
}
