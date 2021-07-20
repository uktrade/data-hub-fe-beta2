import axios from 'axios'
import { isDNBChangeRequestValid } from '../../../../../client/utils/date-utils'

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
    const validRequests = results.filter(
      (result) =>
        ['pending', 'submitted'].includes(result.status) &&
        isDNBChangeRequestValid(result.created_on)
    )
    return validRequests.length > 0
  }
  return false
}
