const config = require('../config')
const hawkRequest = require('../lib/hawk-request')

const API_PROXY_PATH = '/api-proxy'

const ALLOWLIST = [
  '/v4/metadata/likelihood-to-land',
  '/v4/metadata/investment-investor-type',
  '/v4/metadata/investment-involvement',
  '/v4/metadata/investment-specific-programme',
  '/v4/metadata/investment-project-stage',
  '/v4/metadata/investment-business-activity',
  '/v4/metadata/investment-type',
  '/v4/metadata/investment-strategic-driver',
  '/v4/metadata/order-service-type',
  '/v4/metadata/order-cancellation-reason',
  '/v4/metadata/omis-market',
  '/v4/metadata/salary-range',
  '/v4/metadata/fdi-value',
  '/v4/metadata/fdi-type',
  '/v4/metadata/turnover',
  '/v4/metadata/sector',
  '/v4/metadata/location-type',
  '/v4/metadata/event-type',
  '/v4/metadata/programme',
  '/v4/metadata/business-type',
  '/v4/metadata/evidence-tag',
  '/v4/metadata/employee-range',
  '/v4/metadata/country',
  '/v4/metadata/uk-region',
  '/v4/metadata/administrative-area',
  '/v4/metadata/referral-source-website',
  '/v4/metadata/referral-source-marketing',
  '/v4/metadata/referral-source-activity',
  '/v4/metadata/headquarter-type',
  '/v4/metadata/service',
  '/v4/metadata/communication-channel',
  '/v4/metadata/team',
  '/v4/metadata/policy-area',
  '/v4/metadata/policy-issue-type',
  '/v4/metadata/service-delivery-status',
  '/v4/metadata/capital-investment/investor-type',
  '/v4/metadata/capital-investment/required-checks-conducted',
  '/v4/metadata/capital-investment/deal-ticket-size',
  '/v4/metadata/capital-investment/large-capital-investment-type',
  '/v4/metadata/capital-investment/return-rate',
  '/v4/metadata/capital-investment/time-horizon',
  '/v4/metadata/capital-investment/restriction',
  '/v4/metadata/capital-investment/construction-risk',
  '/v4/metadata/capital-investment/equity-percentage',
  '/v4/metadata/capital-investment/desired-deal-role',
  '/v4/metadata/capital-investment/asset-class-interest',
  '/v4/metadata/one-list-tier',
  '/v4/metadata/trade-agreement',
  '/v4/metadata/administrative-area',
  '/v4/metadata/large-capital-opportunity/opportunity-value-type',
]

module.exports = (app) => {
  app.use(
    ALLOWLIST.map((apiPath) => API_PROXY_PATH + apiPath),
    async (req, res, next) => {
      try {
        const metadataUrl = req.originalUrl.replace(API_PROXY_PATH, '')
        const responseData = await hawkRequest(config.apiRoot + metadataUrl)
        res.setHeader('Content-Type', 'application/json')
        res.write(JSON.stringify(responseData))
        res.send()
      } catch (error) {
        next(error)
      }
    }
  )
}
