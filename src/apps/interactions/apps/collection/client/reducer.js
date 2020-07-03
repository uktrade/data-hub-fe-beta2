import { TASK_UPDATE_INTERACTIONS } from '../../../../../client/actions'

export default (
  state = {
    interactions: [],
  },
  { type, result }
) => {
  switch (type) {
    case TASK_UPDATE_INTERACTIONS:
      return {
        ...state,
        interactions: result,
      }
    default:
      return state
  }
}
