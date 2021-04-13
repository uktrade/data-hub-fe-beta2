import React, { useRef, useEffect } from 'react'
import _ from 'lodash'

import multiInstance from '../../utils/multiinstance'
import Button from '@govuk-react/button'
import ErrorSummary from '@govuk-react/error-summary'
import styled from 'styled-components'

import {
  VALIDATED_MULTI_STEP_FORM__BACK,
  VALIDATED_MULTI_STEP_FORM__FIELD_CHANGE,
  VALIDATED_MULTI_STEP_FORM__NEXT,
} from '../../actions'
import SecondaryButton from '../SecondaryButton'
import { FormActions } from '..'

const StyledForm = styled.form({
  '& > *:not(:last-child)': {
    marginBottom: '2rem',
  },
})

export const ValidatedMultiStepForm = ({
  children,
  validators,
  secondaryActions = [],
  submitLabel = 'Submit',
  onValidSubmit,
  // State props
  currentStep = 0,
  errors = {},
  touched = {},
  accumulatedValues = {},
  dispatch,
}) => {
  const ref = useRef()

  useEffect(() => {
    _.isEmpty(errors) &&
      // Select the first focusable element in the form
      ref.current
        .querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        ?.focus()
  }, [currentStep])

  const fieldNamesByStep = []
  const missingValidators = []
  const fieldNames = []
  const validatorNames = Object.keys(validators)

  const steps = children.map((step, i) =>
    step((name, defaultValue) => {
      if (fieldNames.includes(name)) {
        throw Error(`Validated field("${name}") used more than once!`)
      }
      fieldNames.push(name)
      validators[name] || missingValidators.push(name)
      fieldNamesByStep[i] = [...(fieldNamesByStep[i] || []), name]

      return {
        name,
        key: name,
        error: !touched[name] && errors[name],
        onChange: () =>
          dispatch({
            type: VALIDATED_MULTI_STEP_FORM__FIELD_CHANGE,
            name,
          }),
        ...(accumulatedValues[name] === undefined
          ? defaultValue === undefined
            ? {}
            : { defaultValue }
          : { defaultValue: accumulatedValues[name] }),
        // This is here to identify all validated inputs when the form is submitted
        // Not all inputs are available in the onSubmit event e.g. unchecked radios.
        'data-validator-name': name,
      }
    }, errors)
  )

  if (missingValidators.length) {
    throw Error(
      'No validators specified for fields ' +
        `${missingValidators.map((x) => `"${x}"`).join(', ')}!`
    )
  }

  if (fieldNames.length !== validatorNames.length) {
    const extraValidators = _.difference(validatorNames, fieldNames)
      .map((x) => `"${x}"`)
      .join(', ')
    throw Error(`No fields for validators ${extraValidators}!`)
  }

  const isLastStep = currentStep === steps.length - 1
  const currentErrors = _.pick(errors, fieldNamesByStep[currentStep])

  return (
    <StyledForm
      ref={ref}
      onSubmit={(e) => {
        const allFields = Object.fromEntries(new FormData(e.target).entries())
        const validatedFields = Object.fromEntries(
          [...e.target.querySelectorAll('[data-validator-name]')].map((el) => [
            el.dataset.validatorName,
            e.target[el.dataset.validatorName].value,
          ])
        )

        const errors = Object.entries(validatedFields).reduce(
          (a, [name, value]) => {
            const error = validators[name]?.(
              typeof value === 'function' ? undefined : value,
              allFields
            )
            return error instanceof Error ? { ...a, [name]: error.message } : a
          },
          {}
        )

        dispatch({
          type: VALIDATED_MULTI_STEP_FORM__NEXT,
          errors,
          values: allFields,
          okFields: _.difference(_.keys(allFields), _.keys(errors)),
          isLastStep,
        })

        if (isLastStep && _.isEmpty(errors)) {
          onValidSubmit?.(e, { ...accumulatedValues, ...allFields })
        } else {
          e.preventDefault()
          requestAnimationFrame(() =>
            ref.current.querySelector('[data-error-summary')?.focus()
          )
        }
      }}
    >
      {!!Object.keys(currentErrors).length && (
        <ErrorSummary
          data-error-summary={true}
          heading="Errors"
          onHandleErrorClick={(targetName) => {
            const $el = ref.current.querySelector(`[name=${targetName}]`)
            $el.scrollIntoView()
            $el.focus()
          }}
          errors={Object.entries(currentErrors).map(([name, error]) => ({
            targetName: name,
            text: error,
          }))}
        />
      )}
      {steps[currentStep]}
      <FormActions>
        <Button>{isLastStep ? submitLabel : 'Next'}</Button>
        {currentStep !== 0 && (
          <SecondaryButton
            onClick={(e) => {
              e.preventDefault()
              dispatch({ type: VALIDATED_MULTI_STEP_FORM__BACK })
            }}
          >
            Back
          </SecondaryButton>
        )}
        {secondaryActions.map(
          ({ label, onClick, steps = [], props }, i) =>
            (steps.length === 0 || steps.includes(currentStep)) && (
              <SecondaryButton
                {...props}
                key={i}
                onClick={(e) => {
                  e.preventDefault()
                  onClick(e)
                }}
              >
                {label}
              </SecondaryButton>
            )
        )}
      </FormActions>
    </StyledForm>
  )
}

// TODO: Add docstring
export default multiInstance({
  name: 'MultiStepForm',
  actionPattern: 'VALIDATED_MULTI_STEP_FORM__',
  reducer: (
    state = {},
    { type, name, errors, values, okFields, isLastStep }
  ) => {
    switch (type) {
      case VALIDATED_MULTI_STEP_FORM__FIELD_CHANGE:
        return {
          ...state,
          touched: { ...state.touched, [name]: true },
        }
      case VALIDATED_MULTI_STEP_FORM__NEXT:
        return {
          ...state,
          currentStep:
            Object.keys(errors).length || isLastStep
              ? state.currentStep
              : (state.currentStep || 0) + 1,
          errors: {
            // We need to remove all errors of the validated fields from the current step
            ...Object.entries(state.errors || {}).reduce(
              (a, [k, v]) => ({
                ...a,
                ...(okFields.includes(k) ? {} : { [k]: v }),
              }),
              {}
            ),
            ...errors,
          },
          accumulatedValues: {
            ...state.accumulatedValues,
            ...values,
          },
          touched: {},
        }
      case VALIDATED_MULTI_STEP_FORM__BACK:
        return {
          ...state,
          currentStep: state.currentStep - 1,
        }
      default:
        return state
    }
  },
  component: ValidatedMultiStepForm,
})
