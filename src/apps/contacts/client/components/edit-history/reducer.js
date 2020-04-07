import { AUDIT_HISTORY__LOADED } from '../../../../../client/actions'

export default (state = null, { type, result }) =>
  type === AUDIT_HISTORY__LOADED ? { auditHistory: result } : state
