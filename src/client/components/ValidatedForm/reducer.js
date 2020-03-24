import { VALIDATED_FORM__VALIDATE } from '../../actions'

export default (state = { errors: {}, values: {} }, { type, ...action }) =>
  type === VALIDATED_FORM__VALIDATE ? action : state
