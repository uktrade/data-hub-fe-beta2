import PropTypes from 'prop-types'
import React, { useRef, useEffect } from 'react'
import _ from 'lodash'

import multiInstance from '../../utils/multiinstance'
import Button from '@govuk-react/button'
import ErrorSummary from '@govuk-react/error-summary'
import styled from 'styled-components'

import {
  VALIDATED_FORM__BACK,
  VALIDATED_FORM__FIELD_CHANGE,
  VALIDATED_FORM__NEXT,
} from '../../actions'
import SecondaryButton from '../SecondaryButton'
import { FormActions } from '..'

const StyledForm = styled.form({
  '& > *:not(:last-child)': {
    marginBottom: '2rem',
  },
})

export const ValidatedForm = ({
  children,
  validators,
  secondaryActions = [],
  submitLabel = 'Submit',
  onSubmit,
  // State props
  currentStep = 0,
  errors = {},
  touched = {},
  accumulatedValues = {},
  dispatch,
  ...props
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

  const steps = [].concat(children).map((step, i) =>
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
            type: VALIDATED_FORM__FIELD_CHANGE,
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
      {...props}
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
              { ...accumulatedValues, ...validatedFields, ...allFields }
            )
            return error instanceof Error ? { ...a, [name]: error.message } : a
          },
          {}
        )

        dispatch({
          type: VALIDATED_FORM__NEXT,
          errors,
          values: allFields,
          okFields: _.difference(_.keys(allFields), _.keys(errors)),
          isLastStep,
        })

        if (isLastStep && _.isEmpty(errors)) {
          onSubmit?.(e, { ...accumulatedValues, ...allFields })
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
              dispatch({ type: VALIDATED_FORM__BACK })
            }}
          >
            Back
          </SecondaryButton>
        )}
        {secondaryActions.map(
          ({ steps = [], ...props }, i) =>
            (steps.length === 0 || steps.includes(currentStep)) && (
              <SecondaryButton
                {...props}
                key={i}
                onClick={(e) => {
                  e.preventDefault()
                  props?.onClick(e)
                }}
              />
            )
        )}
      </FormActions>
    </StyledForm>
  )
}

ValidatedForm.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.func),
  ]),
  validators: PropTypes.objectOf(PropTypes.func),
  secondaryActions: PropTypes.arrayOf(
    PropTypes.shape({
      steps: PropTypes.arrayOf(PropTypes.number),
    })
  ),
}

/**
 * Required props of a validated field
 * @typedef ValidatedFieldProps
 * @property {string} name - The field should pass this to its underlying native
 * input element so that it can be picked up by the form's onSubmit event, which
 * is the only way the {ValidatedForm} gets the values from its fields.
 * @property {string} key - The React key. Will have the same value as {name}.
 * @property {string | false} error - If it is a string, it indicates that the
 * field value is invalid and the field should render the message in its error
 * state.
 * @property {() => any} onChange - The field should call this function whenever
 * its value has changed. This is only used to notify the {ValidatedForm} that
 * a field has been touched since it errored and thus it doesn't care about the
 * actual field value.
 * @property {string} data-validator-name - Similarly as with {name},
 * The field should pass this to its underlying input element. It is used to
 * enumerate all the validated fields in the {onSubmit} handler, even if they
 * don't have a value set e.g. an unchecked radio button won't have a record in
 * {SubmitEvent.target} but we still need to call its validator.
 */

/**
 * @typedef {Function} Field
 * @param {string} name - The field name by which it will be associated with
 * its validator.
 * @param {string} [defaultValue] - The optional default value for the field.
 * @returns {ValidatedFieldProps} - The props required by the validated field.
 * They should be spread to the field after all its other props.
 */

/**
 * @typedef {Function} Validator
 * @param {any} value - The value to be validated.
 * @param {Record<string, any>} values - An object of all the submitted values
 * to be used for validation depending on other fields.
 * @returns {Error | any} - Should return an {Error} instance if invalid.
 */

/**
 * @typedef {React.ButtonHTMLAttributes} SecondaryActionProps
 * @property {number[]} [steps] - List of step indices in which the action should
 * be displayed.
 */

/**
 * @typedef {Function} Child
 * @property {Field} [field] - The {field} function.
 * @returns {React.ReactNode} - Whatever the function returns, it will be
 * rendered.
 */

/**
 * A form wrapper that adds validation and multi-step functionality to the
 * vanilla form. It gives you the _submit_, _next_ and _back_ buttons and also
 * the _error summary_ for free.
 * @function ValidatedForm
 * @description
 * This component takes one or more children,
 * each of which must be a function which will be passed the {field} function
 * as an argument. Whatever the function returns will be rendered. You should
 * use call the {field} function with a unique name and spread it's return value
 * to the field's props. You also need to specify a validator for each field by
 * passing them as an object to the {ValidatedForm} {validators} prop.
 * A validator is a function which will be called on the form submission with
 * the value of the corresponding field as its first argument and all the other
 * values as the second argument and should return an {Error} instance if the
 * value is invalid. The errors will then be propagated to the corresponding
 * fields and an  _error summary_ will be displayed with a list of all the
 * errors in the current _step_, linking to the related field. You make the form
 * multi-step by passing multipe children to it. The validation takes place per
 * each step. Values and errors are preserved when the user goes back and forth
 * in a multi-step form, but the form can only be advanced to the next step if
 * there are no errors. If all fields are valid, and the form is in its last
 * step, the form will just be submitted as any other form.
 * The {onSubmit} event callback will only be called if there are no errors.
 * The submission handles all input fields, not only the validated ones, so
 * optional field should be handled as in a vanilla form.
 * @param {Object} props - Accepts all props of a regular form and also:
 * @param {Record<string, Validator>} props.validators - A map of field names to
 * validators.
 * @param {Child | Child[]} props.children - A function (for single step),
 * or an array of functions (for multiple steps), which will be passed the
 * {field} function, whose return value you should spread to the compatible
 * field component after all its props.
 * @param {SecondaryActionProps[]} [props.secondaryActions] - A list of
 * props for secondary action buttons. Use the {SecondaryActionProps.steps} to
 * control in which steps the action appears.
 * @param {React.ReactNode} [submitLabel="Submit"] - The label for the submit
 * button of the last step.
 * @param {(e, values: Record<string, string>) => any} [onSubmit] - Only called
 * when all validated fields have valid values. The second argument is an object
 * mapping all (not only the validated) field names to their values.
 * @example
 * <ValidatedForm
 *   id="ValidatedForm.docstring-example"
 *   onSubmit={(e, values) => {
 *     e.preventDefault()
 *     alert(JSON.stringify(values, null, 2))
 *   }}
 *   validators={{
 *     username: x =>
 *       x?.length > 7 || Error('Must be at least 8 characters long'),
 *     password: x =>
 *       x?.match(/(?=.*[A-Z]+)(?=.*\d+)/)
 *       || Error('Must contain an uppercase character and a digit'),
 *     passwordConf: (x, {password}) =>
 *       x === password || Error('Passwords must match'),
 *   }}
 * >
 *   {field =>
 *     <>
 *       <h2>Step 1</h2>
 *       <Input label="Username" {...field('username')} />
 *     </>
 *   }
 *   {field =>
 *     <>
 *       <h2>Step 2</h2>
 *       <Input type="password" label="Password" {...field('password')} />
 *       <Input type="password" label="Repeat password" {...field('passwordConf')} />
 *     </>
 *   }
 * </ValidatedForm>
 */
export default multiInstance({
  name: 'ValidatedForm',
  actionPattern: 'VALIDATED_FORM__',
  reducer: (
    state = {},
    { type, name, errors, values, okFields, isLastStep }
  ) => {
    switch (type) {
      case VALIDATED_FORM__FIELD_CHANGE:
        return {
          ...state,
          touched: { ...state.touched, [name]: true },
        }
      case VALIDATED_FORM__NEXT:
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
      case VALIDATED_FORM__BACK:
        return {
          ...state,
          currentStep: state.currentStep - 1,
        }
      default:
        return state
    }
  },
  component: ValidatedForm,
})
