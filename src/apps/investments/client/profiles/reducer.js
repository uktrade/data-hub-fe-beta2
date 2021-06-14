import {
  INVESTMENTS__PROFILES_LOADED,
  INVESTMENTS__PROFILES_SELECT_PAGE,
  INVESTMENTS_PROFILES__FILTER_OPTIONS_LOADED,
} from '../../../../client/actions'

const initialState = {
  page: 1,
  results: [],
  isComplete: false,
  filterOptions: {
    countries: [],
    assetClassesOfInterest: [],
    dealTicketSize: [],
    investmentTypes: [],
    minimumReturnRate: [],
    timeHorizon: [],
    restrictions: [],
    constructionRisk: [],
    minimumEquityPercentage: [],
    desiredDealRole: [],
  },
}

export default (state = initialState, { type, page, result }) => {
  switch (type) {
    case INVESTMENTS__PROFILES_LOADED:
      return {
        ...state,
        count: result.count,
        results: result.results,
        isComplete: true,
      }
    // TODO: Remove this after the feature flag capital-investments-filters
    // is removed
    case INVESTMENTS__PROFILES_SELECT_PAGE:
      return {
        ...state,
        page,
      }
    case INVESTMENTS_PROFILES__FILTER_OPTIONS_LOADED:
      return {
        ...state,
        filterOptions: result,
      }
    default:
      return state
  }
}
