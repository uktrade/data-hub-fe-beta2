import React from 'react'
import MultiChoice from '@govuk-react/multi-choice'
import { GREY_2 } from 'govuk-colours'
import Radio from '@govuk-react/radio'

import styled from 'styled-components'

const StyledSubOption = styled.div({
  marginLeft: 15,
  paddingLeft: 15,
  borderLeft: `10px solid ${GREY_2}`,
})

const Radios = ({
  error,
  options,
  value,
  defaultValue,
  name,
  onChange,
  ...props
}) => (
  <MultiChoice {...props} meta={{ touched: true, error }}>
    {Object.entries(options).map(([label, { value: v, inset }]) => (
      <React.Fragment key={label}>
        <Radio
          name={name}
          onChange={onChange}
          value={v}
          defaultChecked={v === defaultValue}
        >
          {label}
        </Radio>
        {inset && v === value && <StyledSubOption>{inset}</StyledSubOption>}
      </React.Fragment>
    ))}
  </MultiChoice>
)

export default Radios
