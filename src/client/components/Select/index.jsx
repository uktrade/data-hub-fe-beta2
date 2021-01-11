import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import GovSelect from '@govuk-react/select'
import { MEDIA_QUERIES } from '@govuk-react/constants'
import { spacing } from '@govuk-react/lib'

const StyledGovSelect = styled(GovSelect)`
  ${spacing.responsive({
    size: 2,
    property: 'margin',
    direction: ['top'],
  })}

  select {
    flex: 1;
    width: 'initial';
    min-width: 200px;
  }

  ${MEDIA_QUERIES.TABLET} {
    display: flex;
    align-items: center;
    flex-direction: row;
    ${spacing.responsive({
      size: 0,
      property: 'margin',
      direction: ['top'],
    })}
    span {
      ${spacing.responsive({
        size: 1,
        property: 'margin',
        direction: ['right'],
      })}
    }
  }
`

const Select = ({ input, ...props }) => {
  /*
   * A Select input
   *
   * Changing the initialValue prop overrides the user's input value - this
   * means that the input value will stay synchronised when changing the route.
   */
  const { onChange = () => {}, initialValue = '', ...inputProps } = input
  const [value, setValue] = useState(initialValue)
  useEffect(() => setValue(initialValue), [initialValue])

  return (
    <StyledGovSelect
      {...props}
      input={{
        onChange: (e) => {
          setValue(e.target.value)
          onChange(e)
        },
        value,
        ...inputProps,
      }}
    />
  )
}

export default Select
