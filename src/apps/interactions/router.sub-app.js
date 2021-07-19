const router = require('express').Router()

const urls = require('../../lib/urls')
const { renderDetailsPage } = require('./controllers/details')
const { renderCompletePage, postComplete } = require('./controllers/complete')
// const { renderInteractionsForEntity } = require('./controllers/list')
const { getInteractionDetails } = require('./middleware/details')
// const {
//   getInteractionsRequestBody,
//   getInteractionCollectionForEntity,
//   getInteractionSortForm,
// } = require('./middleware/collection')

const detailsFormRouter = require('./apps/details-form/router')

router.param('interactionId', getInteractionDetails)

// router.get(
//   urls.interactions.index.route,
//   // getInteractionsRequestBody,
//   // getInteractionCollectionForEntity,
//   // getInteractionSortForm,
//   // renderInteractionsForEntity
// )

router.use(detailsFormRouter)

router.get(urls.interactions.detail.route, renderDetailsPage)

router
  .route(urls.interactions.complete.route)
  .post(postComplete, renderCompletePage)
  .get(renderCompletePage)

module.exports = router
