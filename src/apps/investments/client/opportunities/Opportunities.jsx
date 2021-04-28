import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { TASK_GET_OPPORTUNITY_DETAILS, ID, state2props } from './state'
import {
  INVESTMENT_OPPORTUNITY_DETAILS__LOADED,
  INVESTMENT_OPPORTUNITY__EDIT_DETAILS,
  INVESTMENT_OPPORTUNITY__EDIT_REQUIREMENTS,
} from '../../../../client/actions'

import OpportunityDetails from './OpportunityDetails'
import OpportunityRequirements from './OpportunityRequirements'

import Task from '../../../../client/components/Task'
import TabNav from '../../../../client/components/TabNav'
import ToggleSection from '../../../../client/components/ToggleSection'
import SummaryTable from '../../../../client/components/SummaryTable'
import { FONT_SIZE, SPACING } from '@govuk-react/constants'

import styled from 'styled-components'
import { HIGHLIGHT_COLOUR, RED, GREEN } from 'govuk-colours'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'

import { VARIANTS } from '../../../../common/constants'
import OpportunityDetailForm from './OpportunityDetailsForm'

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
  idPrefix,
  children,
  form,
  isEditing,
  onEdit,
  formEnabled, // TODO: remove when there is a Requirements Form
}) => (
  <>
    {RequiredFields(incompleteFields)}
    <ToggleSection
      variant={VARIANTS.SECONDARY}
      label={toggleName}
      id={`${idPrefix}_toggle`}
    >
      {isEditing ? (
        <>{form}</>
      ) : (
        <>
          <SummaryTable>{children}</SummaryTable>
          {formEnabled ? (
            <Button onClick={onEdit} dataTest={`${idPrefix}_button`}>
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
  } = details
  return (
    <Task.Status
      name={TASK_GET_OPPORTUNITY_DETAILS}
      id={ID}
      startOnRender={{
        payload: opportunityId,
        onSuccessDispatch: INVESTMENT_OPPORTUNITY_DETAILS__LOADED,
      }}
    >
      {() => (
        <>
          <TabNav
            id="Opportunity.tabnav"
            label="Dashboard"
            selectedIndex={'details'}
            tabs={{
              details: {
                label: 'Details',
                content: (
                  <>
                    <OpportunitySection
                      incompleteFields={incompleteDetailsFields}
                      children={<OpportunityDetails details={detailsFields} />}
                      form={
                        <OpportunityDetailForm opportunityId={opportunityId} />
                      }
                      toggleName="Opportunity details"
                      idPrefix="opportunity_details"
                      isEditing={isEditingDetails}
                      onEdit={onDetailsEdit}
                      formEnabled={true} // TODO: remove this conditional when Requirements form added
                    />
                    <OpportunitySection
                      incompleteFields={incompleteRequirementsFields}
                      children={
                        <OpportunityRequirements details={requirementsFields} />
                      }
                      form={<div>This will be a form</div>}
                      toggleName="Opportunity requirements"
                      idPrefix="opportunity_requirements"
                      isEditing={isEditingRequirements}
                      onEdit={onRequirementsEdit}
                    />
                  </>
                ),
              },
            }}
          />
          <StyledToggle
            variant={VARIANTS.SECONDARY}
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
