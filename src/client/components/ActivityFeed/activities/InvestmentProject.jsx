import React from 'react'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import Link from '@govuk-react/link'

import {
  Card,
  CardDetails,
  CardDetailsList,
  CardHeader,
  CardTable,
} from './card'

import { AdviserItemRenderer, ContactItemRenderer } from './card/item-renderers'
import { ACTIVITY_TYPE } from '../constants'

import CardUtils from './card/CardUtils'
import { DateUtils, NumberUtils } from '../utils'

const TITLES = {
  add: 'New investment project added',
}

export default class InvestmentProject extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.object.isRequired,
    showDetails: PropTypes.bool.isRequired,
    showDnbHierarchy: PropTypes.bool.isRequired,
  }

  static canRender(activity) {
    return CardUtils.canRenderByTypes(activity, ACTIVITY_TYPE.InvestmentProject)
  }

  render() {
    const { activity, showDetails, showDnbHierarchy } = this.props

    const company = CardUtils.getCompany(activity)
    const type = get(activity, 'type')
    const title = TITLES[type.toLowerCase()]
    const url = get(activity, 'object.url')
    const name = get(activity, 'object.name')
    const investmentType = get(activity, 'object.dit:investmentType.name')
    const adviser = CardUtils.getAdviser(activity)
    const estimatedLandDate = DateUtils.format(
      get(activity, 'object.dit:estimatedLandDate')
    )
    const contacts = CardUtils.getContacts(activity)

    // Specific to Foreign direct investment (FDI) only
    const totalInvestment = NumberUtils.currencyGBP(
      get(activity, 'object.dit:totalInvestment')
    )
    const foreignEquityInvestment = NumberUtils.currencyGBP(
      get(activity, 'object.dit:foreignEquityInvestment')
    )
    const grossValueAdded = NumberUtils.currencyGBP(
      get(activity, 'object.dit:grossValueAdded')
    )
    const numberNewJobs = NumberUtils.decimal(
      get(activity, 'object.dit:numberNewJobs')
    )

    const published = get(activity, 'published')

    return (
      <Card>
        <CardHeader
          company={showDnbHierarchy ? company : null}
          heading={<Link href={url}>{name}</Link>}
          startTime={published}
          blockText={`${title} - ${investmentType}`}
        />

        <CardDetails
          summary="Key details and people for this project"
          link={{ url, text: 'Go to the investment project detail page' }}
          showDetails={showDetails}
        >
          <CardTable
            rows={[
              { header: 'Investment Type', content: investmentType },
              {
                header: 'Added by',
                content: adviser ? (
                  <CardDetailsList
                    itemRenderer={AdviserItemRenderer}
                    items={[adviser]}
                  />
                ) : null,
              },
              { header: 'Estimated land date', content: estimatedLandDate },
              {
                header: 'Company contact(s)',
                content: (
                  <CardDetailsList
                    itemRenderer={ContactItemRenderer}
                    items={contacts}
                  />
                ),
              },
              { header: 'Total Investment', content: totalInvestment },
              {
                header: 'Capital expenditure value',
                content: foreignEquityInvestment,
              },
              { header: 'Gross value added (GVA)', content: grossValueAdded },
              { header: 'Number of new jobs', content: numberNewJobs },
            ]}
          />
        </CardDetails>
      </Card>
    )
  }
}
