const router = require('express').Router()

const { DEFAULT_COLLECTION_QUERY, APP_PERMISSIONS, QUERY_FIELDS } = require('./constants')

const { renderEditPage } = require('./controllers/edit')
const { renderDetailsPage } = require('./controllers/details')
const { renderInteractionList } = require('./controllers/list')
const { exportCollection } = require('../../modules/search/middleware/collection')
const { getRequestBody } = require('../../middleware/collection')

const { setDefaultQuery, handleRoutePermissions } = require('../middleware')
const {
  getInteractionCollection,
  getInteractionsRequestBody,
  getInteractionSortForm,
} = require('./middleware/collection')

const { postDetails, getInteractionDetails } = require('./middleware/details')
const { handlePolicyPermissions } = require('./middleware/policy-permissions')

router.use(handleRoutePermissions(APP_PERMISSIONS))

router.param('interactionId', getInteractionDetails)

router.get('/',
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  getInteractionsRequestBody,
  getInteractionCollection,
  getInteractionSortForm,
  renderInteractionList
)

router.get('/export',
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  getRequestBody(QUERY_FIELDS),
  exportCollection('interaction')
)

router
  .route('/:interactionId/:kind/edit')
  .post(handlePolicyPermissions('edit'), postDetails, renderEditPage)
  .get(handlePolicyPermissions('edit'), renderEditPage)

router.get('/:interactionId', handlePolicyPermissions('view'), renderDetailsPage)

module.exports = router
