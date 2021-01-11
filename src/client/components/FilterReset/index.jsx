import React from 'react'
import { Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FONT_SIZE } from '@govuk-react/constants'

const StyledButtonLink = styled(ButtonLink)`
  font-size: ${FONT_SIZE.SIZE_16};
`

import ButtonLink from '../../components/ButtonLink'

const FilterReset = ({ children, ...props }) => (
  <Route>
    {({ history, location: { pathname, search } }) =>
      Boolean(search) && (
        <StyledButtonLink
          {...props}
          onClick={() => {
            history.push(pathname)
          }}
        >
          {children}
        </StyledButtonLink>
      )
    }
  </Route>
)

FilterReset.propTypes = {
  children: PropTypes.node.isRequired,
}

export default FilterReset
