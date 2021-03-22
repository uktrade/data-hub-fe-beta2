import React from 'react'

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

// This is dummy data that will be removed once we hook up the API.
// Data structure will most likely change.
const detailsRows = [
  { label: 'Opportunity description', value: 'Example Ltd' },
  { label: 'UK location', value: 'Incomplete' },
  { label: 'Promoters', value: 'Incomplete' },
  {
    label: 'Has this opportunity cleared the required checks?',
    value: 'Incomplete',
  },
  { label: 'Lead DIT relationship manager', value: 'Incomplete' },
  { label: 'Asset classes', value: 'Incomplete' },
  { label: 'Value', value: 'Incomplete' },
  { label: 'Construction risk', value: 'Incomplete' },
]

// This is dummy data that will be removed once we hook up the API.
// Data structure will most likely change.
const requirementsRows = [
  { label: 'Total investment sought', value: 'Example Ltd' },
  { label: 'Investment secured so far', value: 'Secured Ltd' },
  { label: 'Types of investment', value: 'Investment Ltd' },
  { label: 'Estimated return rate', value: 'Rate Ltd' },
  { label: 'Timescales', value: 'Timescales Ltd' },
]

const incompleteRowsCount = (rows) => {
  return rows.filter(({ value }) => value === 'Incomplete').length
}

const renderRequiredFields = (fieldCount) => {
  if (fieldCount == 0) {
    return <StyledLabel color={GREEN}>Completed</StyledLabel>
  }
  return <StyledLabel color={RED}>{fieldCount} fields required</StyledLabel>
}

const Opportunities = () => (
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
              {renderRequiredFields(incompleteRowsCount(detailsRows))}
              <ToggleSection
                variant={VARIANTS.SECONDARY}
                label="Opportunity details"
                id="opportunity_details_toggle"
              >
                <SummaryTable
                  actions={
                    <Link key="details" href="https://example.com">
                      Edit
                    </Link>
                  }
                >
                  {detailsRows.map(({ label, value }) => (
                    <SummaryTable.Row key={label} heading={label}>
                      {value}
                    </SummaryTable.Row>
                  ))}
                </SummaryTable>
              </ToggleSection>
              {renderRequiredFields(incompleteRowsCount(requirementsRows))}
              <ToggleSection
                variant={VARIANTS.SECONDARY}
                label="Opportunity requirements"
                id="opportunity_requirements_toggle"
              >
                <SummaryTable
                  actions={
                    <Link key="requirements" href="https://example.com">
                      Edit
                    </Link>
                  }
                >
                  {requirementsRows.map(({ label, value }) => (
                    <SummaryTable.Row key={label} heading={label}>
                      {value}
                    </SummaryTable.Row>
                  ))}
                </SummaryTable>
              </ToggleSection>
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
)

export default Opportunities
