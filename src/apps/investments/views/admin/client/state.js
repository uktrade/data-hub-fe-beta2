export const ID = 'investmentProjectAdmin'

export const TASK_UPDATE_STAGE = 'TASK_UPDATE_STAGE'

export const state2props = ({ values, ...state }) => ({
  ...state[ID],
  values,
})
