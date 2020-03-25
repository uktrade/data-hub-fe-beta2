import React, { useRef } from 'react'
import { FormActions } from 'data-hub-components'
import Button from '@govuk-react/button'
import ErrorSummary from '@govuk-react/error-summary'
import styled from 'styled-components'

import {
  VALIDATED_FORM__VALIDATE,
  VALIDATED_FORM__FIELD_CHANGE,
} from '../../../actions'
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
  errors = {},
  values = {},
  onSubmit,
  onFieldChange,
  ...props
}) => {
  const ref = useRef()
  return (
    <StyledForm
      {...props}
      ref={ref}
      onSubmit={(e) => {
        const formDataEntries = new FormData(e.target).entries()
        const values = Object.fromEntries(formDataEntries)
        const combined = { ...validators, ...values }
        const errors = Object.entries(combined).reduce((a, [name, value]) => {
          const error = validators[name]?.(
            typeof value === 'function' ? undefined : value,
            values
          )
          return name in combined && error ? { ...a, [name]: error } : a
        }, {})

        validate({ values, errors })

        if (Object.keys(errors).length) {
          e.preventDefault()
        } else if (onSubmit) {
          onSubmit(e, values)
        }
      }}
    >
      {!!Object.keys(errors).length && (
        <ErrorSummary
          heading="Errors"
          onHandleErrorClick={(targetName) => {
            const $el = ref.current.querySelector(`[name=${targetName}]`)
            $el.scrollIntoView()
            $el.focus()
          }}
          errors={Object.entries(errors).map(([name, error]) => ({
            targetName: name,
            text: error,
          }))}
        />
      )}
      {children({
        errors,
        values,
        getField: (name) => ({
          name,
          key: name,
          error: errors[name],
          defaultValue: values[name],
          onChange: (e) => onFieldChange(name, e.target.value),
        }),
      })}
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
  dispatchToProps: (dispatch) => ({
    validate: (payload) =>
      dispatch({
        type: VALIDATED_FORM__VALIDATE,
        ...payload,
      }),
    onFieldChange: (name, value) =>
      dispatch({
        type: VALIDATED_FORM__FIELD_CHANGE,
        name,
        value,
      }),
  }),
})
