export const TASK_GET_OPPORTUNITY_DETAILS = 'TASK_GET_OPPORTUNITY_DETAILS'
export const TASK_GET_OPPORTUNITY_DETAILS_METADATA =
  'TASK_GET_OPPORTUNITY_DETAILS_METADATA'
export const TASK_GET_OPPORTUNITY_REQUIREMENTS_METADATA =
  'TASK_GET_OPPORTUNITY_REQUIREMENTS_METADATA'

export const ID = 'opportunityDetail'

export const state2props = ({ values, ...state }) => ({
  ...state[ID],
  values,
})
