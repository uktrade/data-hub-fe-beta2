import { get, includes } from 'lodash'
import { STATUS, BADGES } from '../constants'

const getStatus = (activity) => {
  const apiStatus = get(activity, 'object.dit:status')

  if (apiStatus === STATUS.DRAFT) {
    const isArchived = get(activity, 'object.dit:archived')
    if (isArchived) {
      return STATUS.CANCELLED
    }
    const startTime = get(activity, 'object.startTime')
    const isUpcoming = new Date(startTime) > new Date()
    return isUpcoming ? STATUS.UPCOMING : STATUS.INCOMPLETE
  }

  return STATUS.COMPLETE
}

const isServiceDelivery = (activity) => {
  const activityTypes = get(activity, 'object.type')
  return includes(activityTypes, 'dit:ServiceDelivery')
}

export default class InteractionUtils {
  static transform(activity) {
    const status = getStatus(activity)

    const badge = isServiceDelivery(activity)
      ? BADGES.INTERACTION.SERVICE_DELIVERY
      : BADGES.INTERACTION[status.toUpperCase()]

    const isUpcoming = status === STATUS.UPCOMING
    const typeText = isServiceDelivery(activity)
      ? 'service delivery'
      : 'interaction'

    return {
      badge,
      isUpcoming,
      typeText,
    }
  }
}
