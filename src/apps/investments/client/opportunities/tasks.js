import { apiProxyAxios } from '../../../../client/components/Task/utils'

export function getOpportunityDetail(id) {
  return apiProxyAxios
    .get(`/v4/large-capital-uk-opportunity/${id}`)
    .then(({ data }) => {
      return data
    })
}
