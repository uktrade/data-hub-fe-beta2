import { INVESTMENT_PROJECT_ADMIN__UPDATE_STAGE } from '../../../../../client/actions'

export default (state = {}, { type, result }) =>
  type === INVESTMENT_PROJECT_ADMIN__UPDATE_STAGE ? result : state
