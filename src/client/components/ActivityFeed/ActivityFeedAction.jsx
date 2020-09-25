import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Button from '@govuk-react/button'
import { SPACING, MEDIA_QUERIES } from '@govuk-react/constants'

const Link = styled('a')`
  margin-bottom: 0;
  margin-top: ${SPACING.SCALE_3};
  ${MEDIA_QUERIES.TABLET} {
    margin-left: ${SPACING.SCALE_3};
    margin-top: 0;
  }
`

const ActivityFeedAction = ({ text, link }) => (
  <Button
    key={text}
    as={Link}
    href={link}
    buttonColour="#dee0e2"
    buttonTextColour="#000"
  >
    {text}
  </Button>
)

ActivityFeedAction.propTypes = {
  text: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
}

export default ActivityFeedAction
