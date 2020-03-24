import React from 'react'
import InputField from '@govuk-react/input-field'

export default ({
  label,
  onChange,
  children,
  labelProps,
  meta,
  error,
  ...props
}) => (
  <InputField
    {...labelProps}
    onChange={onChange}
    input={props}
    meta={{ touched: true, error }}
  >
    {label}
  </InputField>
)
