import {
  FORM_FIELD_SET_VALUE,
  FORM_FIELD_TOUCHED,
  FORM_FIELD_REGISTER,
  FORM_FIELD_DEREGISTER,
  FORM_STEP_REGISTER,
  FORM_STEP_DEREGISTER,
  FORM_FORWARD,
  FORM_BACK,
} from '../../../../../client/actions'
import { isEmpty, omit } from 'lodash'

const isLastStep = ({ currentStep, steps }) =>
  currentStep === steps.length - 1 || steps.length === 0

const validateField = (state, name) => {
  const field = state.fields[name]
  const value = state.values[name]

  if (!field) {
    throw new Error(`Field ${name} does not exist`)
  }

  if (field && 'validate' in field) {
    if (typeof field.validate === 'function') {
      return field.validate(value, name, state)
    }

    if (Array.isArray(field.validate)) {
      const validationErrors = field.validate
        .map((validator) => validator(value, field, state))
        .filter((e) => e)
      return validationErrors.length > 0 ? validationErrors[0] : null
    }
  }

  return null
}

const validateForm = (state, fieldsToValidate = []) => {
  const errors = {}
  const touched = {}

  fieldsToValidate.forEach((name) => {
    const error = validateField(state, name)
    if (error) {
      errors[name] = error
    }
    touched[name] = true
  })

  return {
    touched,
    errors,
  }
}

export default (state = {}, { type, errors, ...action }) => {
  switch (type) {
    case FORM_FIELD_REGISTER:
      return {
        ...state,
        values: {
          ...state.values,
          [action.field.name]: state.values[action.field.name] ?? '',
        },
        touched: {
          ...state.touched,
          [action.field.name]: false,
        },
        fields: {
          ...state.fields,
          [action.field.name]: action.field,
        },
      }
    case FORM_FIELD_DEREGISTER:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.fieldName]: undefined,
        },
        touched: {
          ...state.touched,
          [action.fieldName]: undefined,
        },
        fields: {
          ...state.fields,
          [action.fieldName]: undefined,
        },
      }
    case FORM_FIELD_SET_VALUE:
      if (action.fieldValue === '') {
        return {
          ...state,
          values: omit(state.values, action.fieldName),
        }
      }
      return {
        ...state,
        values: {
          ...state.values,
          [action.fieldName]: action.fieldValue,
        },
      }
    case FORM_FIELD_TOUCHED:
      return {
        ...state,
        touched: {
          ...state.touched,
          [action.fieldName]: true,
        },
      }
    case FORM_FORWARD:
      const { errors, touched } = validateForm(state, Object.keys(state.fields))
      return {
        ...state,
        errors,
        touched,
        currentStep:
          !isLastStep(state) && isEmpty(errors)
            ? state.currentStep + 1
            : state.currentStep,
      }
    case FORM_BACK:
      return {
        ...state,
        currentStep: state.currentStep - 1,
      }
    case FORM_STEP_REGISTER:
      return {
        ...state,
        steps: !state.steps.includes(action.stepName)
          ? [...state.steps, action.stepName]
          : state.steps,
      }
    case FORM_STEP_DEREGISTER:
      return {
        ...state,
        steps: state.steps.filter((s) => s !== action.stepName),
      }
    default:
      return {
        ...state,
        values: state.values || {},
        touched: state.touched || {},
        errors: state.errors || {},
        fields: state.fields || {},
        steps: state.steps || [],
        currentStep: state.currentStep ?? 0,
      }
  }
}
