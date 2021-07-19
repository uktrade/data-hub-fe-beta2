import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import urls from '../../../../../lib/urls'
import { currencyGBP } from '../../../../../client/utils/number-utils'
import LocalHeader from '../../../../../client/components/LocalHeader/LocalHeader'
import LocalHeaderHeading from '../../../../../client/components/LocalHeader/LocalHeaderHeading'
import LocalHeaderDetails from '../../../../../client/components/LocalHeaderDetails'
import { TASK_GET_OPPORTUNITY_DETAILS, ID, state2props } from '../Details/state'
import Task from '../../../../../client/components/Task'

const OpportunityDetailsHeader = (state) => {
  const { createdOn, name, ukRegions, assetClasses, opportunityValue } =
    state.details.detailsFields
  const oppValue =
    opportunityValue.value == null
      ? 'Not yet valued'
      : `${currencyGBP(opportunityValue.value)}`
  const ukLocation =
    ukRegions.length == 0
      ? 'Not yet defined'
      : ukRegions.length > 1
      ? 'Multiple'
      : `${ukRegions.map((v) => v.label)}`
  const assetClass =
    assetClasses.length == 0
      ? 'Not yet defined'
      : assetClasses.length > 1
      ? 'Multiple'
      : `${assetClasses.map((c) => c.label)}`

  const itemCollection = {
    Status: state.details.status?.label,
    Value: oppValue,
    'UK location': ukLocation,
    'Asset class': assetClass,
    'Created on': createdOn,
  }
  const breadcrumbs = [
    { link: urls.dashboard(), text: 'Home' },
    { link: urls.investments.index(), text: 'Investments' },
    { link: urls.investments.opportunities.index(), text: 'UK Opportunities' },
    { text: name },
  ]

  return (
    <Task.Status name={TASK_GET_OPPORTUNITY_DETAILS} id={ID}>
      {() => (
        <>
          {name && (
            <LocalHeader breadcrumbs={breadcrumbs} flashMessages={null}>
              <LocalHeaderHeading data-auto-id="heading">
                {name}
              </LocalHeaderHeading>
              <LocalHeaderDetails items={itemCollection} />
            </LocalHeader>
          )}
        </>
      )}
    </Task.Status>
  )
}

OpportunityDetailsHeader.propTypes = {
  opportunityId: PropTypes.string.isRequired,
}

export default connect(state2props)(OpportunityDetailsHeader)
