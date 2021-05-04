const router = require('express').Router()

const {
  LARGE_INVESTMENT_OPPORTUNITY_QUERY_FIELDS,
  LARGE_INVESTMENT_OPPORTUNITY_QUERY_DATE,
  LARGE_INVESTMENT_OPPORTUNITY_QUERY,
} = require('./constants')

const { setDefaultQuery } = require('../middleware')

const { getRequestBody } = require('../../middleware/collection')

const {
  exportCollection,
} = require('../../modules/search/middleware/collection')

const {
  renderOpportunitiesView,
  renderOpportunityDetailsView,
} = require('./controllers/opportunities')
const setInvestmentTabItems = require('./middleware/investments-tab-items')

router.get('/', setInvestmentTabItems, renderOpportunitiesView)

router.get(
  '/:opportunityId/details',
  setInvestmentTabItems,
  renderOpportunityDetailsView
)

router.get('/create', (req, res) => {
  const heading = 'Create UK investment opportunity'
  res
    .breadcrumb(heading)
    .render('investments/views/create/uk-investment-opportunity', {
      heading,
    })
})

router.get(
  '/export',
  setDefaultQuery(LARGE_INVESTMENT_OPPORTUNITY_QUERY),
  getRequestBody(
    LARGE_INVESTMENT_OPPORTUNITY_QUERY_FIELDS,
    LARGE_INVESTMENT_OPPORTUNITY_QUERY_DATE
  ),
  exportCollection('large-capital-opportunity')
)

module.exports = router
