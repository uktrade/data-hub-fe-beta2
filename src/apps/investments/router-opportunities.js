const router = require('express').Router()

const { APP_PERMISSIONS } = require('./constants')

const setLocalNavigation = require('./middleware/local-navigation')
const {
  redirectToFirstNavItem,
  handleRoutePermissions,
} = require('../middleware')
const { shared } = require('./middleware')

const { details } = require('./controllers')

router.use(handleRoutePermissions(APP_PERMISSIONS))

router.use('/:investmentId', setLocalNavigation)
router.param('investmentId', shared.getInvestmentDetails)
router.param('companyId', shared.getCompanyDetails)

router.get('/:investmentId', redirectToFirstNavItem)
router.get('/:investmentId/details', details.detailsGetHandler)

module.exports = router
