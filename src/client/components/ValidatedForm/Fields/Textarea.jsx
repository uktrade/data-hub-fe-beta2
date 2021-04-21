import React from 'react'
import Textarea from '@govuk-react/text-area'

import commonPropTypes from './common-prop-types'

const TextareaField = ({ label, labelProps, error, ...props }) => (
  <Textarea {...labelProps} input={props} meta={{ touched: true, error }}>
    {label}
  </Textarea>
)

TextareaField.propTypes = commonPropTypes

export default TextareaField
