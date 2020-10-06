import React from 'react'
import InputField from '@govuk-react/input-field'

export default ({ label, labelProps, error, hint, ...props }) => (
  <InputField
    {...labelProps}
    hint={hint}
    input={props}
    meta={{ touched: true, error }}
  >
    {label}
  </InputField>
)
