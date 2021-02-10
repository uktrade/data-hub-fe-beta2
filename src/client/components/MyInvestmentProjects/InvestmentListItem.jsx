import React from 'react'
import PropTypes from 'prop-types'
import { Details } from 'govuk-react'

import InvestmentEstimatedLandDate from './InvestmentEstimatedLandDate'
import { Timeline } from '../../../client/components'



const InvestmentListItem = ({
  name,
  stage,
  estimated_land_date,
  showDetails,
}) => {
  return (
    <li>
      <Details summary={name} open={showDetails}>
        <div>+ Add Interaction...</div>
        <Timeline
          stages={['Prospect', 'Assign PM', 'Active', 'Verify win', 'Won']}
          currentStage={stage.name}
        />
        <InvestmentEstimatedLandDate estimatedLandDate={estimated_land_date} />
      </Details>
    </li>
  )
}

InvestmentListItem.propTypes = {
  name: PropTypes.string.isRequired,
  stage: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  estimated_land_date: PropTypes.string.isRequired,
}

export default InvestmentListItem
