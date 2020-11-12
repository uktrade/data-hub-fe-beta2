import {
  MY_ACTIVITY,
  MY_ACTIVITY_DATE_CHANGED,
} from '../../../../client/actions'

const initialState = {
  interactions: [],
  serviceDeliveries: [],
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case MY_ACTIVITY:
      return {
        ...state,
        referrals: result.referralsSent.length,
        serviceDeliveries: result.interactions.filter(
          ({ kind }) => kind === 'service_delivery'
        ),
        interactions: result.interactions.filter(
          ({ kind }) => kind === 'interaction'
        ),
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
