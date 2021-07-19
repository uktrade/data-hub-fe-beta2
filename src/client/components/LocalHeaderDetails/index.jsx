import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { GREY_4 } from 'govuk-colours'
import { SPACING } from '@govuk-react/constants'

const StyledHeaderDetails = styled('div')`
  background-color: ${GREY_4};
`

const StyledHeaderList = styled('li')`
  display: inline-block;
  padding-right: ${SPACING.SCALE_5};
`

const StyledHeaderListLabel = styled('label')`
  color: #6f777b;
`

const LocalHeaderDetails = ({ items }) => {
  return (
    <StyledHeaderDetails
      aria-label="local header details"
      data-auto-id="localHeaderDetails"
      role="region"
    >
      {Object.entries(items).map((item) => {
        return (
          <StyledHeaderList key={item[0]}>
            <StyledHeaderListLabel>{item[0]}</StyledHeaderListLabel>
            {item[1][0].length ? (
              <p>{item[1]}</p>
            ) : (
              <p>
                {item[1][0].label} -&nbsp;
                <a href={item[1][0].value}>change</a>
              </p>
            )}
          </StyledHeaderList>
        )
      })}
    </StyledHeaderDetails>
  )
}

LocalHeaderDetails.propTypes = {
  items: PropTypes.object.isRequired,
}

export default LocalHeaderDetails
