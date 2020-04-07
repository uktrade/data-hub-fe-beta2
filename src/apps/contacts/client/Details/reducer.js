import { CONTACT_DETAILS__LOADED } from '../../../../client/actions'

export default (state = {}, { type, result }) =>
  type === CONTACT_DETAILS__LOADED ? result : state
