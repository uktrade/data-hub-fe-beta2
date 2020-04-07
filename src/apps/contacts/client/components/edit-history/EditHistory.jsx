import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { DateUtils } from 'data-hub-components'
import { FONT_SIZE } from '@govuk-react/constants'
import { GREY_1, GREY_2 } from 'govuk-colours'

import { AUDIT_HISTORY__LOADED } from '../../../../../client/actions'
import Task from '../../../../../client/components/Task/index.jsx'
import { state2props, ID, TASK_NAME } from './state'
import EditHistoryChangeList from './EditHistoryChangeList'

const StyledListContainer = styled('div')`
  border-top: 2px solid ${GREY_2};
`

const StyledUpdatedOn = styled('p')`
  color: ${GREY_1};
  margin-bottom: 0;
  font-size: ${FONT_SIZE.SIZE_16};
  float: right;
`

const getUpdatedBy = (timestamp, user) => {
  const formattedTime = DateUtils.formatWithTime(timestamp)
  return `Updated on ${formattedTime} by ${user.first_name} ${user.last_name}`
}

const EditHistory = ({ auditHistory, contactId }) => {
  return (
    <Task.Status
      name={TASK_NAME}
      id={ID}
      progressMessage="Edit History"
      startOnRender={{
        payload: contactId,
        onSuccessDispatch: AUDIT_HISTORY__LOADED,
      }}
    >
      {() => {
        return (
          <div>
            {auditHistory &&
              auditHistory.map(({ timestamp, changes, user }) => (
                <StyledListContainer key={timestamp}>
                  <StyledUpdatedOn>
                    {getUpdatedBy(timestamp, user)}
                  </StyledUpdatedOn>
                  <EditHistoryChangeList changes={changes} />
                </StyledListContainer>
              ))}
          </div>
        )
      }}
    </Task.Status>
  )
}

export default connect(state2props, null)(EditHistory)
