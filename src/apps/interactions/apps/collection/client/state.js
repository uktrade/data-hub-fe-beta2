export const ID = 'interactionsList'

export const TASK_UPDATE_INTERACTIONS = 'TASK_UPDATE_INTERACTIONS'
export const TASK_UPDATE_INTERACTIONS__COMPLETE =
  'TASK_UPDATE_INTERACTIONS__COMPLETE'

export const state2props = ({ values, ...state }) => ({
  ...state[ID],
  values,
})
