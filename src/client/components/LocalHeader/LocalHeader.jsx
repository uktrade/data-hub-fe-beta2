import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { GREY_4 } from 'govuk-colours'
import { SPACING } from '@govuk-react/constants'
import Main from '@govuk-react/main'
import Breadcrumbs from '@govuk-react/breadcrumbs'

import LocalHeaderHeading from './LocalHeaderHeading'
import FlashMessages from './FlashMessages'

// Using <div> as there is already a <header> on the page
// role="region" gives the element significance as a landmark
const StyledHeader = styled('div')`
  padding-bottom: ${SPACING.SCALE_5};
  background-color: ${GREY_4};
  padding-top: ${SPACING.SCALE_3};
`

const StyledMain = styled(Main)`
  padding-top: 0;
`

const BreadcrumbsWrapper = styled(Breadcrumbs)`
  margin-bottom: ${SPACING.SCALE_5};
  margin-top: 0;
`

const StyledSuperheading = styled.div({
  fontSize: 20,
  lineHeight: '32px',
})

const LocalHeader = ({
  breadcrumbs,
  flashMessages,
  heading,
  superheading,
  children,
}) => (
  <StyledHeader
    aria-label="local header"
    data-auto-id="localHeader"
    role="region"
  >
    <StyledMain>
      <BreadcrumbsWrapper>
        {breadcrumbs?.map((breadcrumb) =>
          breadcrumb.link ? (
            <Breadcrumbs.Link key={breadcrumb.link} href={breadcrumb.link}>
              {breadcrumb.text}
            </Breadcrumbs.Link>
          ) : (
            breadcrumb.text
          )
        )}
      </BreadcrumbsWrapper>
      {flashMessages && <FlashMessages flashMessages={flashMessages} />}
      {superheading && <StyledSuperheading>{superheading}</StyledSuperheading>}
      {heading && <LocalHeaderHeading>{heading}</LocalHeaderHeading>}
      {children}
    </StyledMain>
  </StyledHeader>
)

LocalHeader.propTypes = {
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      link: PropTypes.string,
      text: PropTypes.string.isRequired,
    })
  ),
  flashMessages: PropTypes.shape({
    type: PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.shape({
          body: PropTypes.string.isRequired,
          heading: PropTypes.string.isRequired,
          id: PropTypes.string,
        })
      ),
      PropTypes.arrayOf(PropTypes.string).isRequired,
    ]),
  }),
  heading: PropTypes.string,
  superheading: PropTypes.node,
  children: PropTypes.node,
}

LocalHeader.defaultProps = {
  breadcrumbs: null,
  flashMessages: null,
  heading: null,
  children: null,
}

export default LocalHeader
