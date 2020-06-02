import { ADD_COMPANY__REGION_LOADED } from '../../../../../client/actions'

export default (state = {}, { type, result, payload }) => {
  switch (type) {
    case ADD_COMPANY__REGION_LOADED:
      return {
        ...state,
        region: {
          ...result,
          postcode: payload,
        },
      }
    default:
      return state
  }
}
