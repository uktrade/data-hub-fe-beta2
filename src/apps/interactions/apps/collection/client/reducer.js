import { TASK_UPDATE_INTERACTIONS } from '../../../../../client/actions'

export default (
  state = {
    interactions: [],
    count: null,
    adviser: null,
  },
  { type, result, payload }
) => {
  switch (type) {
    case TASK_UPDATE_INTERACTIONS:
      return {
        ...state,
        interactions: result.results,
        count: result.count,
        advisers: payload?.values?.dit_participants?.map(({ label }) => label),
      }
    default:
      return state
  }
}
