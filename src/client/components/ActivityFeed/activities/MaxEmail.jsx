import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { Card, CardHeader, CardTable } from './card'
import CardUtils from './card/CardUtils'
import { ACTIVITY_TYPE } from '../constants'
import { DateUtils } from '../utils'

export default class MaxEmail extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.object.isRequired,
  }

  static canRender(activity) {
    return CardUtils.canRenderByTypes(activity, ACTIVITY_TYPE.MaxEmail)
  }

  render() {
    const { activity } = this.props
    const name = get(activity, 'object.attributedTo.name')
    const emailTo = get(activity, 'object.dit:emailAddress')
    const sentDate = get(activity, 'object.attributedTo.published')

    return (
      <Card>
        <CardHeader
          heading={name}
          startTime={sentDate}
          badge={{ text: 'Marketing email', borderColour: '#006435' }}
        />

        <CardTable
          isNotWrappedInDetails={true}
          rows={[
            {
              header: 'To',
              content: emailTo,
            },
            {
              header: 'Sent on',
              content: DateUtils.format(sentDate),
            },
          ]}
        />
      </Card>
    )
  }
}
