import React from 'react'

import SummaryTable from '../../../../client/components/SummaryTable'
import Tag from '../../../../client/components/Tag'

import Link from '@govuk-react/link'
import styled from 'styled-components'

const StyledTag = styled(Tag)`
  float: right;
`

const OpportunityDetails = ({ details }) => {
  const {
    name,
    description,
    ukRegions,
    promoters,
    requiredChecks,
    leadRelationshipManager,
    assetClasses,
    opportunityValue,
    constructionRisks,
  } = details

  return (
    <>
      <SummaryTable.TextRow heading="Opportunity name" value={name} />
      <SummaryTable.TextRow
        heading="Opportunity description"
        value={description}
      />
      <SummaryTable.ListRow heading="UK location" value={ukRegions} />
      <SummaryTable.Row heading="Promoters">
        {promoters.length ? (
          <ul>
            {promoters.map((v, i) => (
              <li key={`Promoters-${i}`}>
                <Link href={`/companies/${v.value}`}>{v.label}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <StyledTag>incomplete</StyledTag>
        )}
      </SummaryTable.Row>
      <SummaryTable.TextRow
        heading="Has this opportunity cleared the required checks?"
        value={requiredChecks.label}
      />
      <SummaryTable.TextRow
        heading="Lead DIT relationship manager"
        value={leadRelationshipManager.label}
      />
      <SummaryTable.ListRow heading="Asset classes" value={assetClasses} />
      <SummaryTable.CurrencyRow
        heading={opportunityValue.label}
        value={parseInt(opportunityValue.value)}
      />
      <SummaryTable.ListRow
        heading="Construction risk"
        value={constructionRisks}
      />
    </>
  )
}

export default OpportunityDetails
