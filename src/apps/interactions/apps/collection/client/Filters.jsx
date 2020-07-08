import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Task from '../../../../../client/components/Task'
import Form from '../../../../../client/components/Form'
import AdviserTypeahead from '../../../../../client/components/AdviserTypeAhead'

import { FormActions, FieldCheckboxes } from 'data-hub-components'

import { Button } from 'govuk-react'

import {
  TASK_UPDATE__INTERACTIONS,
  INTERACTIONS__FILTERS_CHANGE,
} from '../../../../../client/actions'
import { ID as STATE_ID, state2props } from './state'

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

const Filters = ({ onChange }) => {
  return (
    <Task>
      {(getTask) => {
        const getInteractions = getTask(TASK_UPDATE__INTERACTIONS, STATE_ID)
        return (
          <Form
            id={STATE_ID}
            onSubmit={onChange}
          >
            <StyledFilter>
              <AdviserTypeahead
                name="dit_participants"
                label="Adviser(s)"
                isMulti={true}
              />
            </StyledFilter>
            <StyledFilter>
              <FieldCheckboxes
                label="Kind"
                name="kind"
                options={[
                  {
                    label: 'Interaction',
                    value: 'interaction',
                  },
                  {
                    label: 'Service delivery',
                    value: 'service_delivery',
                  },
                ]}
              />
            </StyledFilter>
            <FormActions>
              <Button>Refresh results</Button>
            </FormActions>
          </Form>
        )
      }}
    </Task>
  )
}

export default connect(state2props, (dispatch) => ({
  onChange: (filters) => {
    dispatch({
      type: INTERACTIONS__FILTERS_CHANGE,
      filters,
    })
  },
}))(Filters)
