import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { GREY_4 } from 'govuk-colours'
import { SPACING } from '@govuk-react/constants'
import Main from '@govuk-react/main'
import Breadcrumbs from '@govuk-react/breadcrumbs'

import LocalHeaderHeading from './LocalHeaderHeading'
import FlashMessages from './FlashMessages'

const StyledHeader = styled('header')`
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
const LocalHeader = ({ breadcrumbs, flashMessages, heading, children }) => (
  <StyledHeader aria-label="local header" data-auto-id="localHeader">
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
  children: PropTypes.node,
}

LocalHeader.defaultProps = {
  breadcrumbs: null,
  flashMessages: null,
  heading: null,
  children: null,
}

export default LocalHeader
