import React from 'react'
import MultiChoice from '@govuk-react/multi-choice'
import { GREY_2 } from 'govuk-colours'
import Radio from '@govuk-react/radio'
import styled from 'styled-components'

import { RADIOS_FIELD__SET_VALUE } from '../../../actions'
import multiInstance from '../../../utils/multiinstance'

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
  setValue,
  ...props
}) => (
  <MultiChoice {...props} meta={{ touched: true, error }}>
    {Object.entries(options).map(([label, { value: v, inset }]) => (
      <React.Fragment key={label}>
        <Radio
          name={name}
          onChange={(e) => {
            setValue(e.target.value)
            onChange(e)
          }}
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

export default multiInstance({
  name: 'RadiosField',
  reducer: (state, { value }) => ({ value }),
  actionPattern: RADIOS_FIELD__SET_VALUE,
  dispatchToProps: (dispatch) => ({
    setValue: (value) => dispatch({ type: RADIOS_FIELD__SET_VALUE, value }),
  }),
  component: Radios,
})
