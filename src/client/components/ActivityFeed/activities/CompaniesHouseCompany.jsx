import React from 'react'
import { get } from 'lodash'
import PropTypes from 'prop-types'

import {
  Card,
  CardDetails,
  CardDetailsList,
  CardHeader,
  CardTable,
} from './card'

import { DefaultItemRenderer } from './card/item-renderers'

import CardUtils from './card/CardUtils'
import { DateUtils } from '../utils'
import { ACTIVITY_TYPE, SOURCE_TYPES } from '../constants'

export default class CompaniesHouseCompany extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.object.isRequired,
    showDetails: PropTypes.bool.isRequired,
    showDnbHierarchy: PropTypes.bool.isRequired,
  }

  static canRender(activity) {
    return CardUtils.canRenderByTypes(
      activity,
      ACTIVITY_TYPE.CompaniesHouseCompany
    )
  }

  render() {
    const { activity, showDetails, showDnbHierarchy } = this.props

    const company = CardUtils.getCompany(activity)
    const startTime = get(activity, 'object.startTime')
    const reference = get(activity, 'object.name')

    const summary = get(activity, 'summary')
    const address = get(activity, 'object.location:dit:address')
    const postcode = get(activity, 'object.location:dit:postcode')
    const confStmtLastMadeUpDate = DateUtils.format(
      get(activity, 'object.dit:confStmtLastMadeUpDate')
    )
    const confStmtNextDueDate = DateUtils.format(
      get(activity, 'object.dit:confStmtNextDueDate')
    )
    const incorporationDate = DateUtils.format(
      get(activity, 'object.dit:incorporationDate')
    )
    const nextDueDate = DateUtils.format(
      get(activity, 'object.dit:nextDueDate')
    )
    const returnsLastMadeUpDate = DateUtils.format(
      get(activity, 'object.dit:returnsLastMadeUpDate')
    )
    const returnsNextDueDate = DateUtils.format(
      get(activity, 'object.dit:returnsNextDueDate')
    )
    const sicCodes = get(activity, 'object.dit:sicCodes')
    const sicCodesCollection = sicCodes.map((value) => {
      return {
        value,
        id: value,
      }
    })

    return (
      <Card>
        <CardHeader
          company={showDnbHierarchy ? company : null}
          heading={summary}
          blockText="Companies House"
          sourceType={SOURCE_TYPES.external}
          subHeading="Company records"
          startTime={startTime}
        />

        <CardDetails
          summary="View key details for this company"
          showDetails={showDetails}
        >
          <CardTable
            rows={[
              { header: 'Company name', content: reference },
              { header: 'Address', content: address },
              { header: 'Postcode', content: postcode },
              {
                header: 'Confirmation Statement last made up date',
                content: confStmtLastMadeUpDate,
              },
              {
                header: 'Confirmation Statement next due date',
                content: confStmtNextDueDate,
              },
              { header: 'Incorporation date', content: incorporationDate },
              { header: 'Next due date', content: nextDueDate },
              {
                header: 'Returns last made up date',
                content: returnsLastMadeUpDate,
              },
              { header: 'Returns next due date', content: returnsNextDueDate },
              {
                header: 'SIC code(s)',
                content: (
                  <CardDetailsList
                    itemPropName="value"
                    itemRenderer={DefaultItemRenderer}
                    items={sicCodesCollection}
                  />
                ),
              },
            ]}
          />
        </CardDetails>
      </Card>
    )
  }
}
