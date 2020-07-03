import React from 'react'
import { connect } from 'react-redux'
import Task from '../../../../../../client/components/Task'
import Form from '../../../../../../client/components/Form'
import AdviserTypeahead from '../../../../../../client/components/AdviserTypeAhead'

import {
  ID as STATE_ID,
  TASK_UPDATE_INTERACTIONS,
  TASK_UPDATE_INTERACTIONS__COMPLETE,
  state2props,
} from '../state'

const Filters = ({ initialValues, params }) => {
  return (
    <Task>
      {(getTask) => {
        const getInteractions = getTask(TASK_UPDATE_INTERACTIONS)
        return (
          <Form
            id={STATE_ID}
            initialValues={initialValues}
            onSubmit={(values) => {
              getInteractions.start({
                payload: values,
                onSuccessDispatch: TASK_UPDATE_INTERACTIONS__COMPLETE,
              })
            }}
            submissionError="ahhhhh"
          >
            <AdviserTypeahead
              name="dit_participants"
              label="Adviser(s)"
              required="Select at least one adviser"
              isMulti={true}
            />
          </Form>
        )
      }}
    </Task>
  )
}

export default connect(state2props)(Filters)
