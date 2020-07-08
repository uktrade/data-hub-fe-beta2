export const ID = 'interactionsList'

export const state2props = ({ values, ...state }) => ({
  ...state[ID],
  values,
})
