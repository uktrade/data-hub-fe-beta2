import {
  COMPANIES__LOADED,
  COMPANIES__METADATA_LOADED,
  COMPANIES__SELECTED_LEAD_ITA_OR_GLOBAL_ACCOUNT_MANAGER,
} from '../../../client/actions'

const initialState = {
  results: [],
  selectedLeadItaOrGlobalAccountManagers: [],
  metadata: {},
  isComplete: false,
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case COMPANIES__LOADED:
      return {
        ...state,
        ...result,
        isComplete: true,
      }
    case COMPANIES__METADATA_LOADED:
      return {
        ...state,
        metadata: result,
      }
    case COMPANIES__SELECTED_LEAD_ITA_OR_GLOBAL_ACCOUNT_MANAGER:
      return {
        ...state,
        selectedLeadItaOrGlobalAccountManagers: result,
      }
    default:
      return state
  }
}
