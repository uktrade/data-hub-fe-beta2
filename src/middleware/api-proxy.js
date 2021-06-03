const { createProxyMiddleware } = require('http-proxy-middleware')

const config = require('../config')
const getZipkinHeaders = require('../lib/get-zipkin-headers')

const API_PROXY_PATH = '/api-proxy'
const ALLOWLIST = [
  '/v3/interaction',
  '/v4/interaction',
  '/v3/investment/:id/update-stage',
  '/whoami/',
  '/v4/adviser/:id/investment-summary',
  '/v4/company-list',
  '/v4/company-list/:id/item',
  '/v4/search/export-country-history',
  '/v4/company-referral/',
  '/v4/company-referral/:id',
  '/v4/company-referral/:id/complete',
  '/adviser/',
  '/adviser/:id/',
  '/v4/company/:id/export-win',
  '/v4/company/:id',
  '/v4/pipeline-item',
  '/v4/company/:id/assign-one-list-tier-and-global-account-manager',
  '/v4/company/:id/remove-from-one-list',
  '/v4/company/:id/update-one-list-core-team',
  '/v4/proposition',
  '/v3/contact',
  '/v3/search/contact',
  '/v4/company',
  '/v4/company/:id/assign-regional-account-manager',
  '/v4/dnb/company-change-request',
  '/v4/large-investor-profile',
  '/v3/search/investment_project',
  '/v4/search/large-investor-profile',
  '/v4/large-capital-opportunity/:id',
  '/v4/large-capital-opportunity',
  '/v4/search/company',
  '/v4/search/large-capital-opportunity',
  '/v3/search/interaction',
  '/v3/search/event',
  '/v3/search/order',
]

module.exports = (app) => {
  app.use(
    ALLOWLIST.map((apiPath) => API_PROXY_PATH + apiPath),
    createProxyMiddleware('/', {
      changeOrigin: true,
      target: config.apiRoot,
      pathRewrite: {
        ['^' + API_PROXY_PATH]: '',
      },
      onProxyReq: (proxyReq, req) => {
        Object.entries(getZipkinHeaders(req)).forEach(
          ([header, headerValue]) => {
            proxyReq.setHeader(header, headerValue)
          }
        )

        proxyReq.setHeader('authorization', `Bearer ${req.session.token}`)
        // this is required to be able to handle POST requests and avoid a conflict with bodyParser
        // issue here -> https://github.com/chimurai/http-proxy-middleware/issues/320
        if (req.body) {
          let bodyData = JSON.stringify(req.body)
          // incase if content-type is application/x-www-form-urlencoded -> we need to change to application/json
          proxyReq.setHeader('Content-Type', 'application/json')
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData))
          // stream the content
          proxyReq.write(bodyData)
        }
      },
    })
  )
}
