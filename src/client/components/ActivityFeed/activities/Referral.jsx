import React from 'react'
import PropTypes from 'prop-types'
import Link from '@govuk-react/link'
import { DateUtils } from '../utils'
import { Card, CardHeader, CardTable } from './card'
import { ACTIVITY_TYPE } from '../constants'
import CardUtils from './card/CardUtils'
import ReferralUtils from './ReferralUtils'

export default class Referral extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.object.isRequired,
  }

  static canRender(activity) {
    return CardUtils.canRenderByTypes(activity, ACTIVITY_TYPE.Referral)
  }

  render() {
    const { activity } = this.props
    const {
      id,
      companyId,
      subject,
      startTime,
      sender,
      recipient,
      completedOn,
    } = ReferralUtils.transformReferral(activity)
    const url = `/companies/${companyId}/referrals/${id.split(':')[2]}`
    const badge = ReferralUtils.getStatus(activity)
    const AdviserDetails = ({ name, email, team }) => (
      <>
        {name}
        {email && (
          <>
            , <a href={`mailto:${email}`}>{email}</a>
          </>
        )}
        {team && <>, {team}</>}
      </>
    )

    return (
      <Card>
        <CardHeader
          heading={<Link href={url}>{subject}</Link>}
          startTime={startTime}
          badge={badge}
        />

        <CardTable
          isNotWrappedInDetails={true}
          rows={[
            { header: 'Sending adviser', content: AdviserDetails(sender) },
            {
              header: 'Receiving adviser',
              content: AdviserDetails(recipient),
            },
            {
              header: 'Completed on',
              content: completedOn && DateUtils.format(completedOn),
            },
          ]}
        />
      </Card>
    )
  }
}
