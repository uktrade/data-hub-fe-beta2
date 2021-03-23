import React from 'react'
import { connect } from 'react-redux'

import { TASK_GET_OPPORTUNITY_DETAILS, ID, state2props } from './state'
import { INVESTMENT_OPPORTUNITY_DETAILS__LOADED } from '../../../../client/actions'

import Task from '../../../../client/components/Task'
import TabNav from '../../../../client/components/TabNav'
import ToggleSection from '../../../../client/components/ToggleSection'
import SummaryTable from '../../../../client/components/SummaryTable'
import { FONT_SIZE, SPACING } from '@govuk-react/constants'

import styled from 'styled-components'
import { HIGHLIGHT_COLOUR, RED, GREEN } from 'govuk-colours'
import Link from '@govuk-react/link'

import { VARIANTS } from '../../../../common/constants'

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

const renderRequiredFields = (fieldCount) => {
  if (fieldCount == 0) {
    return <StyledLabel color={GREEN}>Completed</StyledLabel>
  }
  return <StyledLabel color={RED}>{fieldCount} fields required</StyledLabel>
}

// TODO: put in a new file and maybe split examples
const OpportunitySection = ({
  incompleteFields,
  details,
  toggleName,
  toggleId,
  isEditing = false,
}) => {
  return isEditing ? (
    <div>This will be a form</div>
  ) : (
    <>
      {renderRequiredFields(incompleteFields)}
      <ToggleSection
        variant={VARIANTS.SECONDARY}
        label={toggleName}
        id={toggleId}
      >
        <SummaryTable
          actions={
            <Link key="details" href="https://example.com">
              Edit
            </Link>
          }
        >
          {/* TODO: replace Object.values map with different Row components based on data type */}
          {Object.values(details).map(({ label, value }) => (
            <SummaryTable.Row key={label} heading={label}>
              {JSON.stringify(value)}
            </SummaryTable.Row>
          ))}
        </SummaryTable>
      </ToggleSection>
    </>
  )
}

// TODO: destructure details props further
const Opportunities = ({ details }) => (
  <Task.Status
    name={TASK_GET_OPPORTUNITY_DETAILS}
    id={ID}
    startOnRender={{
      payload: 'Replace Me', // TODO pass the id in
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
                    incompleteFields={details.incompleteDetailsFields}
                    details={details.detailsFields}
                    toggleName="Opportunity details"
                    toggleId="opportunity_details_toggle"
                  />
                  <OpportunitySection
                    incompleteFields={details.incompleteRequirementsFields}
                    details={details.requirementsFields}
                    toggleName="Opportunity requirements"
                    toggleId="opportunity_requirements_toggle"
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

// TODO: add PropTypes
export default connect(state2props)(Opportunities)
