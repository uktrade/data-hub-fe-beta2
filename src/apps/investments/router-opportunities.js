const router = require('express').Router()

const { renderOpportunitiesView } = require('./controllers/opportunities')
const setInvestmentTabItems = require('./middleware/investments-tab-items')

router.get(
  '/:opportunityId/details',
  setInvestmentTabItems,
  renderOpportunitiesView
)

module.exports = router
