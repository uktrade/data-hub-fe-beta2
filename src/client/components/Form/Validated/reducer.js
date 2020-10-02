import _ from 'lodash'

import {
  VALIDATED_FORM__VALIDATE,
  VALIDATED_FORM__FIELD_CHANGE,
} from '../../../actions'

export default (state = {}, { type, name, errors }) => {
  switch (type) {
    case VALIDATED_FORM__VALIDATE:
      return errors
    case VALIDATED_FORM__FIELD_CHANGE:
      return _.omit(state, name)
      return {
        ...state,
        // values: {
        //   ...state.values,
        //   [name]: value,
        // },
        errors: _.omit(state.errors, name),
      }
    default:
      return state
  }
}
