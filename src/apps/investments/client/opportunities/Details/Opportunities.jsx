import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { TASK_GET_OPPORTUNITY_DETAILS, ID, state2props } from '../Details/state'
import {
  INVESTMENT_OPPORTUNITY_DETAILS__LOADED,
  INVESTMENT_OPPORTUNITY__EDIT_DETAILS,
  INVESTMENT_OPPORTUNITY__EDIT_REQUIREMENTS,
} from '../../../../../client/actions'

import OpportunityDetails from './OpportunityDetails'
import OpportunityRequirements from './OpportunityRequirements'
import OpportunityDetailsForm from './OpportunityDetailsForm'

import Task from '../../../../../client/components/Task'
import ToggleSection from '../../../../../client/components/ToggleSection'
import SummaryTable from '../../../../../client/components/SummaryTable'

import styled from 'styled-components'
import { RED } from 'govuk-colours'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import { Details, SectionBreak } from 'govuk-react'
import { FONT_SIZE } from '@govuk-react/constants'

const StyledLabel = styled('label')`
  display: inline-table;
  background: transparent;
  border: none;
  font-size: 19px;
  float: right;
  margin: 5px;
  color: ${(props) => props.color};
`

const StyledDetails = styled(Details)`
  span {
    font-size: ${FONT_SIZE.SIZE_19};
  }
`

const RequiredFields = (fieldCount) => {
  if (fieldCount == 0) {
    return <StyledLabel color={RED}>Complete</StyledLabel>
  }
  return <StyledLabel color={RED}>{fieldCount} fields incomplete</StyledLabel>
}

const OpportunitySection = ({
  incompleteFields,
  toggleName,
  id,
  children,
  form,
  isEditing,
  onEdit,
  formEnabled, // TODO: remove when there is a Requirements Form
}) => (
  <>
    <SectionBreak></SectionBreak>
    {RequiredFields(incompleteFields)}
    <ToggleSection label={toggleName} id={`${id}_toggle`}>
      {isEditing ? (
        <>{form}</>
      ) : (
        <>
          <SummaryTable>{children}</SummaryTable>
          {formEnabled ? (
            <Button onClick={onEdit} dataTest={`${id}_button`}>
              Edit
            </Button>
          ) : null}
        </>
      )}
    </ToggleSection>
  </>
)

const Opportunities = ({
  opportunityId,
  details,
  onDetailsEdit,
  onRequirementsEdit,
}) => {
  const {
    detailsFields,
    requirementsFields,
    incompleteDetailsFields,
    incompleteRequirementsFields,
    isEditingDetails,
    isEditingRequirements,
    formSaved,
  } = details
  return (
    <Task.Status
      name={TASK_GET_OPPORTUNITY_DETAILS}
      id={ID}
      startOnRender={{
        payload: {
          opportunityId,
          formSaved,
        },
        onSuccessDispatch: INVESTMENT_OPPORTUNITY_DETAILS__LOADED,
      }}
    >
      {() => (
        <>
          <OpportunitySection
            incompleteFields={incompleteDetailsFields}
            form={<OpportunityDetailsForm opportunityId={opportunityId} />}
            toggleName="Opportunity details"
            id="opportunity_details"
            isEditing={isEditingDetails}
            onEdit={onDetailsEdit}
            formEnabled={true} // TODO: remove this conditional when Requirements form added
          >
            <OpportunityDetails details={detailsFields} />
          </OpportunitySection>

          <OpportunitySection
            incompleteFields={incompleteRequirementsFields}
            form={<div>This will be a form</div>}
            toggleName="Opportunity requirements"
            id="opportunity_requirements"
            isEditing={isEditingRequirements}
            onEdit={onRequirementsEdit}
          >
            <OpportunityRequirements details={requirementsFields} />
          </OpportunitySection>
          <SectionBreak></SectionBreak>

          <StyledDetails summary="Need to delete this opportunity?">
              To delete this opportunity, email{' '}
              <Link>capitalinvestment@trade.gov.uk</Link>
          </StyledDetails>
        </>
      )}
    </Task.Status>
  )
}
Opportunities.propTypes = {
  opportunityId: PropTypes.string.isRequired,
}
export default connect(state2props, (dispatch) => ({
  onDetailsEdit: () => {
    dispatch({
      type: INVESTMENT_OPPORTUNITY__EDIT_DETAILS,
    })
  },
  onRequirementsEdit: () => {
    dispatch({
      type: INVESTMENT_OPPORTUNITY__EDIT_REQUIREMENTS,
    })
  },
}))(Opportunities)
