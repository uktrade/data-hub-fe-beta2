import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { GREY_3, WHITE } from 'govuk-colours'
import { SPACING } from '@govuk-react/constants'

import ActivityFeedCheckbox from './ActivityFeedCheckbox'

const ActivityFeedShowAllContainer = styled('div')`
  border-top: 1px solid ${WHITE};
  background: ${GREY_3};
  padding: ${SPACING.SCALE_2};
`

const ActivityFeedShowAll = ({ onChange, checked, children }) => {
  return (
    <ActivityFeedShowAllContainer>
      <ActivityFeedCheckbox
        name="activityFeedShowAll"
        onChange={onChange}
        checked={checked}
      >
        {children}
      </ActivityFeedCheckbox>
    </ActivityFeedShowAllContainer>
  )
}

ActivityFeedShowAll.propTypes = {
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
}

export default ActivityFeedShowAll
