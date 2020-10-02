import React from 'react'
import Textarea from '@govuk-react/text-area'

export default ({ label, labelProps, error, ...props }) => (
  <Textarea {...labelProps} input={props} meta={{ touched: true, error }}>
    {label}
  </Textarea>
)
