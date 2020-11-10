import {
  MY_ACTIVITY,
  MY_ACTIVITY_DATE_CHANGED,
} from '../../../../client/actions'

const initialState = {
  activity: {
    interactions: [],
  },
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case MY_ACTIVITY:
      return {
        ...state,
        activity: {
          interactions: result?.interactions,
        },
        isComplete: true,
      }
    case MY_ACTIVITY_DATE_CHANGED:
      return {
        ...state,
        startDate: result.startDate,
      }
    default:
      return state
  }
}
