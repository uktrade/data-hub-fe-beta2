import { apiProxyAxios } from '../../../../../../client/components/Task/utils'

const transformReferralDetails = require('../../transformer')
export const fetchReferralDetails = (id) =>
  apiProxyAxios
    .get(`v4/company-referral/${id}`)
    .then(({ data }) => transformReferralDetails(data))
