import { MULTISTEP_FORM__BACK, MULTISTEP_FORM__NEXT } from '../../actions'

export default (state = {}, { type, values }) => {
  switch (type) {
    case MULTISTEP_FORM__NEXT:
      return {
        ...state,
        step: (state.step || 0) + 1,
        values: {
          ...state.values,
          ...values,
        },
      }
    case MULTISTEP_FORM__BACK:
      return {
        ...state,
        step: state.step - 1,
      }
    default:
      return state
  }
}
