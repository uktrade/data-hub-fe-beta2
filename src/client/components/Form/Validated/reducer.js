import {
  VALIDATED_FORM__VALIDATE,
  VALIDATED_FORM__FIELD_CHANGE,
} from '../../../actions'

export default (
  state = { errors: {}, values: {} },
  { type, name, value, ...action }
) => {
  switch (type) {
    case VALIDATED_FORM__VALIDATE:
      return action
    case VALIDATED_FORM__FIELD_CHANGE:
      return { ...state, values: { ...state.values, [name]: value } }
    default:
      return state
  }
}
