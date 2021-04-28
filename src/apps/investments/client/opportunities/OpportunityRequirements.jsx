import React from 'react'

import SummaryTable from '../../../../client/components/SummaryTable'

const OpportunityRequirements = ({ details }) => {
  const {
    totalInvestmentSought,
    currentInvestmentSecured,
    investmentTypes,
    returnRate,
    timeHorizons,
  } = details

  return (
    <>
      <SummaryTable.CurrencyRow
        heading="Total investment sought"
        value={parseInt(totalInvestmentSought)}
      />
      <SummaryTable.CurrencyRow
        heading="Current investment secured"
        value={parseInt(currentInvestmentSecured)}
      />
      <SummaryTable.ListRow
        heading="Types of investment"
        value={investmentTypes}
      />
      <SummaryTable.TextRow
        heading="Estimated return rate"
        value={returnRate.label}
      />
      <SummaryTable.ListRow heading="Timescales" value={timeHorizons} />
    </>
  )
}

export default OpportunityRequirements
