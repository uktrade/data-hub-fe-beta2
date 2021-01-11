import React from 'react'
import styled from 'styled-components'
import { TEXT_COLOUR, ERROR_COLOUR, FOCUS_COLOUR } from 'govuk-colours'
import { H2 } from '@govuk-react/heading'
import {
  BORDER_WIDTH,
  BORDER_WIDTH_MOBILE,
  FOCUS_WIDTH,
  MEDIA_QUERIES,
  RESPONSIVE_4,
} from '@govuk-react/constants'
import { spacing } from '@govuk-react/lib'

import SecondaryButton from '../SecondaryButton'

// Taken from https://github.com/govuk-react/govuk-react/blob/master/components/error-summary/src/index.js
const StyledRoot = styled.div(
  {
    color: TEXT_COLOUR,
    padding: RESPONSIVE_4.mobile,
    border: `${BORDER_WIDTH_MOBILE} solid ${ERROR_COLOUR}`,
    '&:focus': {
      outline: `${FOCUS_WIDTH} solid ${FOCUS_COLOUR}`,
      outlineOffset: '0',
    },
    [MEDIA_QUERIES.LARGESCREEN]: {
      padding: RESPONSIVE_4.tablet,
      border: `${BORDER_WIDTH} solid ${ERROR_COLOUR}`,
    },
  },
  spacing.withWhiteSpace({ marginBottom: 6 })
)

const StyledSecondaryButton = styled(SecondaryButton)({
  marginBottom: 0,
})

type ErrorProps = {
  errorMessage: React.ReactNode,
  noun: React.ReactNode,
  retry: () => any,
}

type ErrorView = (props: ErrorProps) => React.ReactNode

const Err: ErrorView = ({ errorMessage, retry, noun }) => (
  <StyledRoot>
    <H2 size="MEDIUM">Could not load {noun}</H2>
    <p>Error: {errorMessage}</p>
    <StyledSecondaryButton onClick={retry}>Retry</StyledSecondaryButton>
  </StyledRoot>
)

// Err.propTypes = {
//   noun: PropTypes.string.isRequired,
//   error: PropTypes.string.isRequired,
//   retry: PropTypes.func.isRequired,
//   clear: PropTypes.func.isRequired,
// }

export default Err
