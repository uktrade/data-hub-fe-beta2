import PropTypes from 'prop-types'
import React from 'react'
import GovukInputField from '@govuk-react/input-field'

import commonPropTypes from './common-prop-types'

const InputField = ({ label, labelProps, error, hint, ...props }) => (
  <GovukInputField
    {...labelProps}
    hint={hint}
    input={props}
    meta={{ touched: true, error }}
  >
    {label}
  </GovukInputField>
)

InputField.propTypes = {
  ...commonPropTypes,
  hint: PropTypes.node,
}

export default InputField
