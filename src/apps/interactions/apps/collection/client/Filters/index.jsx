import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Task from '../../../../../../client/components/Task'
import Form from '../../../../../../client/components/Form'
import AdviserTypeahead from '../../../../../../client/components/AdviserTypeAhead'

import { FormActions } from 'data-hub-components'

import { Button } from 'govuk-react'

import {
  ID as STATE_ID,
  TASK_UPDATE_INTERACTIONS,
  TASK_UPDATE_INTERACTIONS__COMPLETE,
  state2props,
} from '../state'

const StyledFilter = styled('div')`
  > div {
    background-color: #dee0e2;
    padding: 8px;
  }
  label {
    font-size: 16px;
    font-weight: 600;
  }
`

const Filters = () => {
  return (
    <Task>
      {(getTask) => {
        const getInteractions = getTask(TASK_UPDATE_INTERACTIONS)
        return (
          <Form
            id={STATE_ID}
            onSubmit={(values) => {
              getInteractions.start({
                payload: { values },
                onSuccessDispatch: TASK_UPDATE_INTERACTIONS,
              })
            }}
          >
            <StyledFilter>
              <AdviserTypeahead
                name="dit_participants"
                label="Adviser(s)"
                isMulti={true}
              />
            </StyledFilter>
            <FormActions>
              <Button>Submit</Button>
            </FormActions>
          </Form>
        )
      }}
    </Task>
  )
}

export default connect(state2props)(Filters)
