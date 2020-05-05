import React from 'react'

import styled from 'styled-components'
import { Main, InsetText, H4, Button, Link } from 'govuk-react'
import { SPACING } from '@govuk-react/constants'
import { FormStateful, FieldRadios, FormActions } from 'data-hub-components'
import LocalHeader from '../../../../../client/components/LocalHeader.jsx'

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
    <>
      <LocalHeader
        heading={'Change the project stage'}
        breadcrumbs={[
          { link: dashboard(), text: 'Home' },
          { link: investments.index(), text: 'Investments' },
          { link: investments.projects.index(), text: 'Projects' },
          { link: investments.projects.project(projectId), text: projectName },
          { text: 'Admin' },
        ]}
      />
      <Main>
        <H4>Project Details</H4>
        <InsetText>
          <p>Project name: {projectName}</p>
          <StyledP>Current stage: {projectStage.name}</StyledP>
        </InsetText>
        <FormStateful>
          <H4>Change the stage to</H4>
          <FieldRadios
            name="Change the stage to"
            required="Select a new stage"
            options={newStageOptions}
          />
          <FormActions>
            <Button>Save</Button>
            <Link href={investments.projects.project(projectId)}>Cancel</Link>
          </FormActions>
        </FormStateful>
      </Main>
    </>
  )
}

export default InvestmentProjectAdmin
