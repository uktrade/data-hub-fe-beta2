export const ID = 'interactionsList'

export {
  TASK_UPDATE_INTERACTIONS,
  TASK_GET_INTERACTIONS,
} from '../../../../../client/actions'

export const state2props = ({ values, ...state }) => ({
  ...state[ID],
  values,
})
