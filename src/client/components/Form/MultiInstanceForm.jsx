import React, { useEffect, useRef } from 'react'
import { isEmpty } from 'lodash'
import ErrorSummary from '@govuk-react/error-summary'
import { useFormContext } from './hooks'
import Step from './elements/Step'

import {
  FORM__LOADED,
  FORM__BACK,
  FORM__FIELD_DEREGISTER,
  FORM__FIELD_REGISTER,
  FORM__FIELD_SET_VALUE,
  FORM__FIELD_TOUCHED,
  FORM__FORWARD,
  FORM__STEP_DEREGISTER,
  FORM__STEP_REGISTER,
  FORM__VALIDATE,
} from '../../../client/actions'
import multiInstance from '../../utils/multiinstance'
import reducer from './reducer'

const validateForm = (state) =>
  Object.values(state.fields)
    .map((field) => ({
      name: field.name,
      error: []
        .concat(field.validate)
        .map((validator) => validator(state.values?.[field.name], field, state))
        .filter(Boolean)[0],
    }))
    .filter(({ error }) => error)
    .reduce(
      (acc, { name, error }) => ({
        errors: {
          ...acc.errors,
          [name]: error,
        },
        touched: {
          ...acc.touched,
          [name]: true,
        },
      }),
      {}
    )

const Form = ({
  onLoad,
  onSubmit,
  children,
  submissionError = null,
  errors = {},
  initialValues = {},
  values = {},
  touched = {},
  steps = [],
  showErrorSummary = true,
  ...props
}) => {
  useEffect(() => {
    onLoad(initialValues)
  }, [])

  const contextProps = {
    ...props,
    errors,
    values,
    touched,
    steps,
    getStepIndex: (stepName) => {
      const index = steps?.indexOf(stepName)
      return index !== -1 ? index : null
    },
    isFirstStep: () => props?.currentStep === 0,
    isLastStep: () => !steps.length || props?.currentStep === steps?.length - 1,
    getFieldState: (fieldName) => ({
      value: values[fieldName] ?? '',
      touched: touched[fieldName] ?? false,
      error: errors[fieldName],
    }),
  }

  const ref = useRef()

  return (
    <useFormContext.Provider {...contextProps}>
      <form
        ref={ref}
        noValidate={true}
        onSubmit={(e) => {
          e.preventDefault()

          const { errors, touched } = validateForm(contextProps)
          props.onValidate(errors, touched)

          if (isEmpty(errors)) {
            contextProps.isLastStep()
              ? onSubmit(values, contextProps)
              : props.goForward()
          } else {
            setTimeout(() => {
              ref.current.querySelector('#form-errors')?.focus()
            }, 0)
          }
        }}
      >
        {(!isEmpty(errors) || submissionError) && showErrorSummary && (
          <ErrorSummary
            id="form-errors"
            heading="There is a problem"
            onHandleErrorClick={(targetName) => {
              const $el =
                ref.current.querySelector(`[name=${targetName}]`) ??
                ref.current.querySelector(`#field-${targetName} input`) ??
                ref.current.querySelector(`#field-${targetName}`)
              if ($el) {
                $el.scrollIntoView()
                $el.focus()
              }
            }}
            errors={Object.entries(errors).map(([name, error]) => ({
              targetName: name,
              text: error,
            }))}
            description={isEmpty(errors) && submissionError}
          />
        )}
        {typeof children === 'function' ? children(contextProps) : children}
      </form>
    </useFormContext.Provider>
  )
}

const dispatchToProps = (dispatch) => ({
  onLoad: (initialValues) =>
    dispatch({
      type: FORM__LOADED,
      initialValues,
    }),
  registerField: (field) =>
    dispatch({
      type: FORM__FIELD_REGISTER,
      field,
    }),
  deregisterField: (fieldName) =>
    dispatch({
      type: FORM__FIELD_DEREGISTER,
      fieldName,
    }),
  setFieldValue: (fieldName, fieldValue) =>
    dispatch({
      type: FORM__FIELD_SET_VALUE,
      fieldName,
      fieldValue,
    }),
  setFieldTouched: (fieldName) =>
    dispatch({
      type: FORM__FIELD_TOUCHED,
      fieldName,
    }),
  onValidate: (errors, touched) =>
    dispatch({
      type: FORM__VALIDATE,
      errors,
      touched,
    }),
  goForward: (values) =>
    dispatch({
      type: FORM__FORWARD,
      values,
    }),
  goBack: () =>
    dispatch({
      type: FORM__BACK,
    }),
  registerStep: (stepName) =>
    dispatch({
      type: FORM__STEP_REGISTER,
      stepName,
    }),
  deregisterStep: (stepName) =>
    dispatch({
      type: FORM__STEP_DEREGISTER,
      stepName,
    }),
})

const MultiInstanceForm = multiInstance({
  name: 'Form',
  reducer,
  component: Form,
  dispatchToProps,
  actionPattern: 'FORM__',
})

MultiInstanceForm.Step = Step

export default MultiInstanceForm
