import React from 'react'
import InputField from '@govuk-react/input-field'

export default ({ label, labelProps, error, ...props }) => (
  <InputField {...labelProps} input={props} meta={{ touched: true, error }}>
    {label}
  </InputField>
)
