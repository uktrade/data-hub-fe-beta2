import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { H1, H2 } from 'govuk-react'
import Select from '@govuk-react/select'
import format from 'date-fns/format'
import subDays from 'date-fns/sub_days'

import Task from '../../../components/Task/index.jsx'
import { TASK_GET_MY_ACTIVITY, ID, state2props } from './state'
import {
  MY_ACTIVITY,
  MY_ACTIVITY_DATE_CHANGED,
} from '../../../../client/actions'

const Header = styled('header')`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  h2 {
    font-size: 22px;
    margin-bottom: 0;
    width: 49%;
  }
  label {
    width: 49%;
  }
  select {
    width: 100%;
  }
`

const MyActivity = ({
  isComplete,
  onChange,
  startDate = format(subDays(new Date(), 7), 'YYYY-MM-DD'),
  activity: { interactions },
}) => {
  return (
    <>
      <Header>
        <H2>My activity</H2>
        <Select name="days" onChange={onChange}>
          <option value={format(subDays(new Date(), 7), 'YYYY-MM-DD')}>
            Last 7 days
          </option>
          <option value={format(subDays(new Date(), 2), 'YYYY-MM-DD')}>
            Last 2 days
          </option>
        </Select>
      </Header>
      <Task.Status
        name={TASK_GET_MY_ACTIVITY}
        id={ID}
        progressMessage="loading my activities..."
        startOnRender={{
          onSuccessDispatch: MY_ACTIVITY,
          payload: {
            startDate,
          },
        }}
      >
        {() =>
          isComplete && (
            <>
              <span>{interactions.length}</span>
              <span>Interactions</span>
            </>
          )
        }
      </Task.Status>
    </>
  )
}

export default connect(state2props, {
  onChange: (event) => ({
    type: MY_ACTIVITY_DATE_CHANGED,
    result: { startDate: event.target.value },
  }),
})(MyActivity)
