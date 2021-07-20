import { apiProxyAxios } from '../../../../../client/components/Task/utils'
import { format } from '../../../../../client/utils/date-utils'

const { investments } = require('../../../../../lib/urls')

const { DATE_LONG_FORMAT } = require('../../../../../common/constants')

export function getOpportunities({ activePage, payload }) {
  return apiProxyAxios
    .post('/v4/search/large-capital-opportunity', { ...payload })
    .then(({ data } = data) => {
      const offset = activePage * 10 - 10
      const getArrayNames = (data) => data.map((d) => d.name)
      function transformInvestmentOpportunitiesList({
        name,
        id,
        uk_region_locations,
        created_on,
      }) {
        const locationNames = getArrayNames(uk_region_locations)
        return {
          headingText: name,
          headingUrl: investments.opportunities.details(id),
          itemId: id,
          badges: locationNames.length
            ? locationNames.length === 1
              ? [{ text: locationNames[0] }]
              : [{ text: 'Multiple UK sites' }]
            : [],
          metadata: [
            {
              label: 'Updated on',
              value: format(new Date(created_on), DATE_LONG_FORMAT),
            },
          ],
        }
      }
      return {
        count: data.count,
        results: data.results
          .slice(offset, offset + 10)
          .map(transformInvestmentOpportunitiesList),
      }
    })
}
