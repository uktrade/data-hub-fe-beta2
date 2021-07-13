import React from 'react'
import { useSelector, shallowEqual } from "react-redux";
import PropTypes from 'prop-types'
import urls from '../../../../../lib/urls'
import { formatWithTime } from '../../../../../client/utils/date-utils'
import { ID } from '../Details/state'
import { currencyGBP } from '../../../../../client/utils/number-utils'
import LocalHeader from '../../../../../client/components/LocalHeader/LocalHeader'
import LocalHeaderHeading from '../../../../../client/components/LocalHeader/LocalHeaderHeading'
import LocalHeaderDetails from '../../../../../client/components/LocalHeaderDetails'

const OpportunityDetailsHeader = ({ opportunityId }) => {
  /** Used redux-hooks to connect the state were reducers action 
      has been initiated from opportunity-details.  */ 
  const details = useSelector(state => (state.opportunityDetails.details), shallowEqual);
  const {
    createdOn,
    name,
    ukRegions,
    assetClasses,
    opportunityValue,
  } = details.detailsFields

  const statusLabel = details.incompleteDetailsFields > 0 ? 'Unassigned' : 'Seeking investment'
  const oppsValue = opportunityValue.value == null ? 'Not yet valued' : `${currencyGBP(opportunityValue.value)}`;
  const ukLocation = ukRegions.length == 0 ? 'Not yet defined' :
                        ukRegions.length > 1 ? 'Multiple' : `${ukRegions.map(v => v.label)}`;
  const assetClass = assetClasses.length == 0 ? 'Not yet defined' : 
                        assetClasses.length > 1 ? 'Multiple' : `${assetClasses.map(c => c.label)}`;

  const itemCollection = {
    'Status': [{'label': `${statusLabel}`, 'value': ''}],
    'Value': `${oppsValue}`,
    'UK location': `${ukLocation}`,
    'Asset value': `${assetClass}`,
    'Created on': `${createdOn}`,
  }

  const breadcrumbs = [
    { link: urls.dashboard(), text: 'Home' },
    { link: urls.investments.index(), text: 'Investments' },
    { link: urls.investments.opportunities.index(), text: 'UK Opportunities' },
    { text: name },
  ]

  return (
    <>
      <LocalHeader breadcrumbs={breadcrumbs} flashMessages={null} >
        <LocalHeaderHeading data-auto-id="heading">{name}</LocalHeaderHeading>
        <LocalHeaderDetails items={itemCollection}/>
      </LocalHeader>
    </>
  )
}

OpportunityDetailsHeader.propTypes = {
  opportunityId: PropTypes.string.isRequired
}

export default OpportunityDetailsHeader