import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import GovCheckbox from '@govuk-react/checkbox'
import { BODY_SIZES } from '@govuk-react/constants'

const StyledGovCheckbox = styled(GovCheckbox)`
  ${(props) =>
    props.reduced &&
    `
      padding: 8px 0 8px 33px !important;
      min-height: auto;
      margin-bottom: 1px;

      input {
        width: 18px;
        height: 18px;
      }
      input + span {
        padding: 0;
        &:before {
          margin: 8px 0 0 8px;
          height: 18px;
          width: 18px;
          border-width: 1px;
        }
        &:after {
          border-width: 0 0 2px 2px;
          width: 10px;
          height: 5px;
          left: 11px;
        }
      }
      input + span + span {
        padding-left: 0;
        font-size: ${BODY_SIZES.S}px;
      }
    `}
`

const Checkbox = ({
  onChange,
  name,
  initialChecked = false,
  value,
  ...props
}) => {
  const [checked, setChecked] = useState(initialChecked)
  useEffect(() => setChecked(initialChecked), [initialChecked])
  return (
    <StyledGovCheckbox
      name={name}
      value={value}
      checked={checked}
      onChange={(e) => {
        setChecked(e.target.checked)
        onChange(e)
      }}
      data-test="checkbox"
      {...props}
    />
  )
}

export default Checkbox
