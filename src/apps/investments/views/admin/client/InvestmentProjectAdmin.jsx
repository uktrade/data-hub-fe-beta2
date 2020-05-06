import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { Main, InsetText, H4, Button, Link } from 'govuk-react'
import { SPACING } from '@govuk-react/constants'
import { FieldRadios, FormActions } from 'data-hub-components'
import LocalHeader from '../../../../../client/components/LocalHeader.jsx'
import Form from '../../../../../client/components/Form'
import Task from '../../../../../client/components/Task'
import { ID as STATE_ID, TASK_UPDATE_STAGE, state2props } from './state'
import { INVESTMENT_PROJECT_ADMIN__UPDATE_STAGE } from '../../../../../client/actions'

import { dashboard, investments } from '../../../../../lib/urls'

const StyledP = styled('p')`
  margin-bottom: ${SPACING.SCALE_2};
`

const InvestmentProjectAdmin = ({
  projectId,
  projectName,
  projectStage,
  stages,
}) => {
  const newStageOptions = stages.filter(
    (stage) => stage.value != projectStage.id
  )
  return (
    <Task>
      {(getTask) => {
        const updateStageTask = getTask(TASK_UPDATE_STAGE, STATE_ID)

        return (
          <>
            <LocalHeader
              heading={'Change the project stage'}
              breadcrumbs={[
                { link: dashboard(), text: 'Home' },
                { link: investments.index(), text: 'Investments' },
                { link: investments.projects.index(), text: 'Projects' },
                {
                  link: investments.projects.project(projectId),
                  text: projectName,
                },
                { text: 'Admin' },
              ]}
            />
            <Main>
              <H4>Project Details</H4>
              <InsetText>
                <p>Project name: {projectName}</p>
                <StyledP>Current stage: {projectStage.name}</StyledP>
              </InsetText>
              <Form
                id={STATE_ID}
                onSubmit={(values) => {
                  updateStageTask.start({
                    payload: { values },
                    onSuccessDispatch: INVESTMENT_PROJECT_ADMIN__UPDATE_STAGE,
                  })
                }}
                submissionError={updateStageTask.errorMessage}
              >
                <H4>Change the stage to</H4>
                <FieldRadios
                  name="projectStage"
                  required="Select a new stage"
                  options={newStageOptions}
                />
                <FormActions>
                  <Button>Save</Button>
                  <Link href={investments.projects.project(projectId)}>
                    Cancel
                  </Link>
                </FormActions>
              </Form>
            </Main>
          </>
        )
      }}
    </Task>
  )
}

export default connect(state2props)(InvestmentProjectAdmin)
