import _ from 'lodash'
import React, { useRef, useEffect } from 'react'
import Button from '@govuk-react/button'
import ErrorSummary from '@govuk-react/error-summary'
import styled from 'styled-components'

import {
  VALIDATED_FORM__VALIDATE,
  VALIDATED_FORM__FIELD_CHANGE,
} from '../../../actions'
import { FormActions } from '../..'
import SecondaryButton from '../../SecondaryButton'
import multiInstance from '../../../utils/multiinstance'

import reducer from './reducer'

const StyledForm = styled.form({
  '& > *:not(:last-child)': {
    marginBottom: '2rem',
  },
})

const ValidatedForm = ({
  children,
  validate,
  validators,
  submitLabel = 'Submit',
  secondaryActions = [],
  defaultErrors = {},
  errors = defaultErrors,
  touched = {},
  submitted,
  onValidSubmit,
  onSubmit,
  onFieldChange,
  ...props
}) => {
  const allErrors = { ...defaultErrors, ...errors }
  const ref = useRef()

  useEffect(() => {
    submitted &&
      !_.isEmpty(errors) &&
      ref.current.querySelector('[data-error-summary')?.focus()
  }, [submitted, errors])

  return (
    <StyledForm
      {...props}
      ref={ref}
      onSubmit={(e) => {
        const formData = Object.fromEntries(new FormData(e.target).entries())
        const errors = Object.entries({ ...validators, ...formData }).reduce(
          (a, [name, value]) => {
            const error = validators[name]?.(
              typeof value === 'function' ? undefined : value,
              formData
            )
            return error instanceof Error ? { ...a, [name]: error.message } : a
          },
          {}
        )

        validate(errors)

        if (Object.keys(errors).length) {
          e.preventDefault()
        } else if (onValidSubmit) {
          onValidSubmit(e, formData)
        }

        onSubmit(e)
      }}
    >
      {!!Object.keys(allErrors).length && (
        <ErrorSummary
          data-error-summary={true}
          heading="Errors"
          onHandleErrorClick={(targetName) => {
            const $el = ref.current.querySelector(`[name=${targetName}]`)
            $el.scrollIntoView()
            $el.focus()
          }}
          errors={Object.entries(allErrors).map(([name, error]) => ({
            targetName: name,
            text: error,
          }))}
        />
      )}
      {children(
        (name) => ({
          name,
          key: name,
          error: !touched[name] && allErrors[name],
          onChange: (e) => onFieldChange(name, e.target.value),
        }),
        errors
      )}
      <FormActions>
        <Button>{submitLabel}</Button>
        {secondaryActions.map((props, i) => (
          <SecondaryButton
            {...props}
            key={i}
            onClick={(e) => {
              e.preventDefault()
              props?.onClick(e)
            }}
          />
        ))}
      </FormActions>
    </StyledForm>
  )
}

export default multiInstance({
  name: 'ValidatedForm',
  reducer,
  component: ValidatedForm,
  actionPattern: 'VALIDATED_FORM__',
  dispatchToProps: (dispatch) => ({
    validate: (errors) =>
      dispatch({
        type: VALIDATED_FORM__VALIDATE,
        errors,
      }),
    onFieldChange: (name, value) =>
      dispatch({
        type: VALIDATED_FORM__FIELD_CHANGE,
        name,
        value,
      }),
  }),
})
