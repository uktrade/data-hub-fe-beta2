import PropTypes from 'prop-types'
import React from 'react'
import { H3 } from '@govuk-react/heading'
import styled from 'styled-components'

import SpacedSectionBreak from './SpacedSectionBreak'

const StyledHeading = styled(H3)({
  flexGrow: 1,
})

const StyledHeader = styled.div({
  display: 'flex',
  alignItems: 'baseline',
})

const ContentWithHeading = ({ heading, children, headingActions }) => (
  <section>
    <StyledHeader>
      <StyledHeading level={1}>{heading}</StyledHeading>
      {headingActions}
    </StyledHeader>
    <SpacedSectionBreak />
    {children}
  </section>
)

ContentWithHeading.propTypes = {
  heading: PropTypes.node,
  children: PropTypes.node,
  headingComponent: PropTypes.func,
}

export default ContentWithHeading
