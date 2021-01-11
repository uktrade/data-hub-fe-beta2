import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { ERROR_COLOUR } from 'govuk-colours'

import LocalHeader from '../../../../../client/components/LocalHeader/LocalHeader'
import Task, { TaskStatus } from '../../../../../client/components/Task'
import { companies, dashboard } from '../../../../../lib/urls'
import { EDIT_ONE_LIST_DETAILS__SUBMIT } from '../../../../../client/actions'
import {
  StatusMessage,
  Main,
  FieldRadios,
  FormStateful,
  Step,
  AdviserTypeAhead,
} from '../../../../../client/components'

import {
  state2props,
  ID as STATE_ID,
  TASK_SAVE_ONE_LIST_DETAILS,
  SAVED,
  API_ERROR,
} from './state'

import {
  NONE,
  ACCOUNT_MANAGER_FIELD_NAME,
  ONE_LIST_TEAM_FIELD_NAME,
  TIER_FIELD_NAME,
} from '../constants'

const StyledH2 = styled.h2`
  font-weight: bold;
`

const StyledP = styled.p`
  margin: 0;
`

function ErrorHandler({ errorMessage }) {
  return (
    <>
      {errorMessage[API_ERROR] && (
        <StatusMessage
          colour={ERROR_COLOUR}
          aria-labelledby="api-error-summary-title"
          role="alert"
        >
          <StyledH2 id="api-error-summary-title">
            One List Details could not be saved, please check details and try{' '}
            again.
          </StyledH2>

          <StyledP>{errorMessage[API_ERROR]}</StyledP>
        </StatusMessage>
      )}
    </>
  )
}

function EditOneListForm(state) {
  const { companyId, companyName, oneListTiers, formInitialValues } = state

  useEffect(() => {
    if (state[SAVED]) {
      window.location.href = companies.businessDetails(companyId)
    }
  })

  return (
    <Task>
      {(getTask) => (
        <FormStateful
          initialValues={formInitialValues}
          onSubmit={(values) => {
            getTask(TASK_SAVE_ONE_LIST_DETAILS, STATE_ID).start({
              payload: {
                values,
                companyId,
              },
              onSuccessDispatch: EDIT_ONE_LIST_DETAILS__SUBMIT,
            })
            return null
          }}
        >
          {({ values }) => (
            <>
              <LocalHeader
                heading={`Add or edit ${companyName} One List information`}
                breadcrumbs={[
                  { link: dashboard(), text: 'Home' },
                  { link: companies.index(), text: 'Companies' },
                  { link: companies.detail(companyId), text: companyName },
                  { text: 'Edit One List information' },
                ]}
              />
              <Main>
                <TaskStatus
                  name={TASK_SAVE_ONE_LIST_DETAILS}
                  id={STATE_ID}
                  renderError={ErrorHandler}
                />

                <Step name="oneListTier">
                  <FieldRadios
                    label="Company One List tier"
                    name={TIER_FIELD_NAME}
                    options={oneListTiers}
                    required="Select an option to continue"
                  />
                </Step>

                {values.one_list_tier !== NONE && (
                  <Step name="oneListAdvisers">
                    <AdviserTypeAhead
                      name={ACCOUNT_MANAGER_FIELD_NAME}
                      label="Global Account Manager"
                      required="Select at least one adviser"
                    />
                    <AdviserTypeAhead
                      name={ONE_LIST_TEAM_FIELD_NAME}
                      label="Advisers on the core team (optional)"
                      isMulti={true}
                    />
                  </Step>
                )}
              </Main>
            </>
          )}
        </FormStateful>
      )}
    </Task>
  )
}

EditOneListForm.propTypes = {
  companyId: PropTypes.string.isRequired,
  companyName: PropTypes.string.isRequired,
  oneListTiers: PropTypes.array.isRequired,
  formInitialValues: PropTypes.object.isRequired,
  updatedOneListDetails: PropTypes.string,
}

export default connect(state2props)(EditOneListForm)
