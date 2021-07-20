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
import OpportunityRequirementsForm from './OpportunityRequirementsForm'

import Task from '../../../../../client/components/Task'
import ToggleSection from '../../../../../client/components/ToggleSection'
import SummaryTable from '../../../../../client/components/SummaryTable'
import { FONT_SIZE, SPACING } from '@govuk-react/constants'

import styled from 'styled-components'
import { HIGHLIGHT_COLOUR, RED, GREEN } from 'govuk-colours'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'

const StyledSpan = styled('span')`
  background: ${HIGHLIGHT_COLOUR};
`

const StyledToggle = styled(ToggleSection)`
  font-size: ${FONT_SIZE.SIZE_14};
  margin-top: ${SPACING.SCALE_4};
`

const StyledLabel = styled('label')`
  display: inline-table;
  background: transparent;
  border: none;
  font-size: 19px;
  float: right;
  margin: 5px;
  color: ${(props) => props.color};
`

const RequiredFields = (fieldCount) => {
  if (fieldCount == 0) {
    return <StyledLabel color={GREEN}>Completed</StyledLabel>
  }
  return <StyledLabel color={RED}>{fieldCount} fields required</StyledLabel>
}

const OpportunitySection = ({
  incompleteFields,
  toggleName,
  id,
  children,
  form,
  isEditing,
  onEdit,
}) => (
  <>
    {RequiredFields(incompleteFields)}
    <ToggleSection label={toggleName} id={`${id}_toggle`}>
      {isEditing ? (
        <>{form}</>
      ) : (
        <>
          <SummaryTable>{children}</SummaryTable>
          <Button onClick={onEdit} dataTest={`${id}_button`}>
            Edit
          </Button>
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
      progressMessage="Loading opportunity"
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
          >
            <OpportunityDetails details={detailsFields} />
          </OpportunitySection>

          <OpportunitySection
            incompleteFields={incompleteRequirementsFields}
            form={<OpportunityRequirementsForm opportunityId={opportunityId} />}
            toggleName="Opportunity requirements"
            id="opportunity_requirements"
            isEditing={isEditingRequirements}
            onEdit={onRequirementsEdit}
          >
            <OpportunityRequirements details={requirementsFields} />
          </OpportunitySection>

          <StyledToggle
            label="Need to delete this opportunity?"
            id="opportunity_delete_toggle"
            fontSize={FONT_SIZE.SIZE_14}
          >
            <StyledSpan>
              To delete this opportunity, email{' '}
              <Link>capitalinvestment@trade.gov.uk</Link>
            </StyledSpan>
          </StyledToggle>
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
