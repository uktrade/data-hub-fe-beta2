import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { FONT_WEIGHTS } from '@govuk-react/constants'
import Input from '@govuk-react/input'

import FieldWrapper from '../Form/elements/FieldWrapper'

const StyledFieldWrapper = styled(FieldWrapper)`
  label {
    font-weight: ${FONT_WEIGHTS.regular};
  }
`

const DateField = ({
  onChange = () => {},
  name,
  label,
  legend,
  hint,
  initialValue,
}) => (
  <StyledFieldWrapper {...{ name, label, legend, hint }}>
    <Input
      id={name}
      name={name}
      defaultValue={initialValue}
      type="date"
      onChange={onChange}
    />
  </StyledFieldWrapper>
)

DateField.propTypes = {
  onChange: PropTypes.func,
  name: PropTypes.string.isRequired,
  label: PropTypes.node,
  legend: PropTypes.node,
  hint: PropTypes.string,
  initialValue: PropTypes.string,
}

export default DateField
