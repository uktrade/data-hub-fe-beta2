import { get } from 'lodash'
import { BADGES } from '../constants'

export default class ReferralUtils {
  static getStatus(activity) {
    const status = get(activity, 'object.dit:status')
    return BADGES.REFERRAL[status.toUpperCase()]
  }

  static getRoleDetails(activity, role) {
    return activity.object.attributedTo.filter(
      (attr) => attr['dit:DataHubCompanyReferral:role'] === role
    )
  }

  static transformReferral(activity) {
    const [sender] = this.getRoleDetails(activity, 'sender')
    const [recipient] = this.getRoleDetails(activity, 'recipient')

    return {
      id: get(activity, 'id'),
      companyId: activity.object.attributedTo[0].id.split(':').pop(),
      startTime: get(activity, 'object.startTime'),
      subject: get(activity, 'object.dit:subject'),
      status: get(activity, 'object.dit:status'),
      sender: {
        name: get(sender, 'name'),
        email: get(sender, 'dit:emailAddress'),
        team: get(sender, 'dit:team[name]'),
      },
      recipient: {
        name: get(recipient, 'name'),
        email: get(recipient, 'dit:emailAddress'),
        team: get(recipient, 'dit:team[name]'),
      },
      completedOn: get(activity, 'object.dit:completedOn'),
    }
  }
}
