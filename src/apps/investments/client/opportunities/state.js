export const TASK_GET_OPPORTUNITY_DETAILS = 'TASK_GET_OPPORTUNITY_DETAILS'

export const ID = 'opportunityDetail'

export const state2props = ({ values, ...state }) => ({
  ...state[ID],
  values,
})
