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
import { ACTIVITY_TYPE, SOURCE_TYPES } from '../constants'

export default class HmrcExporter extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.object.isRequired,
    showDetails: PropTypes.bool.isRequired,
    showDnbHierarchy: PropTypes.bool.isRequired,
  }

  static canRender(activity) {
    return CardUtils.canRenderByTypes(activity, ACTIVITY_TYPE.HmrcExporter)
  }

  render() {
    const { activity, showDetails, showDnbHierarchy } = this.props

    const company = CardUtils.getCompany(activity)
    const startTime = get(activity, 'object.startTime')
    const reference = get(activity, 'object.attributedTo.name')
    const summary = get(activity, 'summary')
    const exportItemCodes = get(activity, 'object.dit:exportItemCodes')
    const exportItemCodesCollection = exportItemCodes.map((value) => {
      return {
        value,
        id: value,
      }
    })

    return (
      <Card>
        <CardHeader
          company={showDnbHierarchy ? company : null}
          blockText="HMRC"
          subHeading="Exporters records"
          heading={summary}
          sourceType={SOURCE_TYPES.external}
          startTime={startTime}
        />

        <CardDetails
          summary="View key export details"
          showDetails={showDetails}
        >
          <CardTable
            rows={[
              { header: 'Company name', content: reference },
              {
                header: 'Export Item code(s)',
                content: (
                  <CardDetailsList
                    itemPropName="value"
                    itemRenderer={DefaultItemRenderer}
                    items={exportItemCodesCollection}
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
