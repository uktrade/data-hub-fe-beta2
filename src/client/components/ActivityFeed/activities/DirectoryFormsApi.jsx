import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { Card, CardHeader, CardTable } from './card'
import CardUtils from './card/CardUtils'
import { ACTIVITY_TYPE } from '../constants'

export default class DirectoryFormsApi extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.object.isRequired,
  }

  static canRender(activity) {
    return CardUtils.canRenderByTypes(activity, ACTIVITY_TYPE.DirectoryFormsApi)
  }

  parse(activity) {
    const meta = {}
    meta.name =
      get(activity, 'object.dit:directoryFormsApi:Submission:Meta.subject') ||
      get(activity, 'object.url')
    meta.office_postcode = null

    const url = get(activity, 'object.url')
    if (url.includes('/contact/office-finder/')) {
      meta.name = 'Contact DIT Office'
      meta.office_postcode = url.split('/').slice(-2)[0]
    }
    activity.meta = meta
    return activity
  }

  render() {
    const activity = this.parse(this.props.activity)
    const { name, office_postcode } = activity.meta

    const sentDate = get(activity, 'object.published')
    const rows = [
      { header: 'From', content: get(activity, 'actor.dit:emailAddress') },
      {
        header: 'Comment',
        content: get(
          activity,
          'object.dit:directoryFormsApi:Submission:Data.comment'
        ),
      },
    ]
    if (office_postcode)
      rows.push({ header: 'Office', content: office_postcode })

    return (
      <Card>
        <CardHeader
          heading={name}
          startTime={sentDate}
          badge={{ text: 'GOV.UK Form', borderColour: '#006435' }}
        />

        <CardTable isNotWrappedInDetails={true} rows={rows} />
      </Card>
    )
  }
}
