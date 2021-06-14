import axios from 'axios'
import { subDays, endOfToday, isAfter } from 'date-fns'

export function checkIfPendingRequest(duns_number) {
  if (duns_number) {
    return axios
      .get(
        `/api-proxy/v4/dnb/company-change-request?duns_number=${duns_number}`
      )
      .then(({ data }) => checkIfRequestIsValid(data))
  }
  return false
}

const checkIfRequestIsValid = ({ count, results }) => {
  if (count > 0) {
    const todaysDate = endOfToday()
    const timeInterval = subDays(todaysDate, 20)
    const isValid = isAfter(todaysDate, timeInterval)
    const validRequests = results.filter(
      (result) => ['pending', 'submitted'].includes(result.status) && isValid
    )
    return validRequests.length > 0
  }
  return false
}
