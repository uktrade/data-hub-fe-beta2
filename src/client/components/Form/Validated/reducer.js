import {
  VALIDATED_FORM__VALIDATE,
  VALIDATED_FORM__FIELD_CHANGE,
} from '../../../actions'

export default (state = { touched: {} }, { type, name, errors }) => {
  switch (type) {
    case VALIDATED_FORM__VALIDATE:
      return {
        submitted: true,
        errors,
      }
    case VALIDATED_FORM__FIELD_CHANGE:
      return {
        ...state,
        touched: { ...state.touched, [name]: true },
      }
    default:
      return state
  }
}
