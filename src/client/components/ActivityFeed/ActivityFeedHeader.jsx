import React from 'react'
import PropTypes from 'prop-types'
import { H2 } from '@govuk-react/heading'
import styled from 'styled-components'
import { SPACING, MEDIA_QUERIES } from '@govuk-react/constants'
import pluralize from 'pluralize'

const HeaderSummary = styled('div')`
  display: flex;
  flex-flow: row wrap;
  border-bottom: 2px solid #000;
  margin-bottom: ${SPACING.SCALE_2};
  padding-bottom: ${SPACING.SCALE_1};

  & > div {
    width: 100%;
    margin-bottom: ${SPACING.SCALE_1};

    ${MEDIA_QUERIES.TABLET} {
      width: 0;
      flex-grow: 1;
    }
  }
`

const HeaderCount = styled('div')`
  margin-top: ${SPACING.SCALE_1};

  & > h2 {
    font-weight: normal;
    font-size: 28px;
    margin-bottom: 0;
  }
`

const HeaderActions = styled('div')`
  text-align: right;
  min-width: 60%;

  & > button {
    margin-bottom: 0;
  }
`

const ActivityFeedHeader = ({ totalActivities, actions }) => {
  const headerText = totalActivities
    ? pluralize('activity', totalActivities, true)
    : 'Activities'

  return (
    <HeaderSummary>
      <HeaderCount>
        <H2>{headerText}</H2>
      </HeaderCount>
      {actions && <HeaderActions>{actions}</HeaderActions>}
    </HeaderSummary>
  )
}

ActivityFeedHeader.propTypes = {
  totalActivities: PropTypes.number,
  actions: PropTypes.node,
}

ActivityFeedHeader.defaultProps = {
  totalActivities: 0,
  actions: null,
}

export default ActivityFeedHeader
