import React from 'react'

import TabNav from '../../../../client/components/TabNav'
import ToggleSection from '../../../../client/components/ToggleSection'
import SummaryTable from '../../../../client/components/SummaryTable'

import styled from 'styled-components'
import { HIGHLIGHT_COLOUR } from 'govuk-colours'
import Link from '@govuk-react/link'

const StyledSpan = styled('span')`
  background: ${HIGHLIGHT_COLOUR};
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
              <ToggleSection
                label="Opportunity details"
                id="Opportunity.details.toggle"
                fieldCount={incompleteRowsCount(detailsRows)}
                showRequiredField={true}
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
              <ToggleSection
                label="Opportunity requirements"
                id="Opportunity.requirements.toggle"
                fieldCount={incompleteRowsCount(requirementsRows)}
                showRequiredField={true}
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
    <ToggleSection
      label="Need to delete this opportunity?"
      id="toggle_delete"
      isStatic={true}
    >
      <StyledSpan>
        To delete this opportunity, email{' '}
        <Link>capitalinvestment@trade.gov.uk</Link>
      </StyledSpan>
    </ToggleSection>
  </>
)

export default Opportunities
