const router = require('express').Router()
const urls = require('../../lib/urls')

const {
  LOCAL_NAV,
  DEFAULT_COLLECTION_QUERY,
  QUERY_FIELDS,
} = require('./constants')

const { getRequestBody } = require('../../middleware/collection')
const {
  exportCollection,
} = require('../../modules/search/middleware/collection')

const {
  setLocalNav,
  setDefaultQuery,
  redirectToFirstNavItem,
  handleRoutePermissions,
} = require('../middleware')
const { getCommon, getDetails } = require('./controllers/details')
const { renderContactsView } = require('./controllers/contacts')
const { postDetails, editDetails } = require('./controllers/edit')
const { archiveContact, unarchiveContact } = require('./controllers/archive')
const { renderDocuments } = require('./controllers/documents')
const { getAudit } = require('./controllers/audit')

const { setInteractionsDetails } = require('./middleware/interactions')

const interactionsRouter = require('../interactions/router.sub-app')

router.get(urls.contacts.index.route, renderContactsView)

router.get(
  '/export',
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  getRequestBody(QUERY_FIELDS),
  exportCollection('contact')
)

router.route('/create').get(editDetails).post(postDetails, editDetails)

router.use(
  '/:contactId',
  handleRoutePermissions(LOCAL_NAV),
  getCommon,
  setLocalNav(LOCAL_NAV)
)

router.get('/:contactId', redirectToFirstNavItem)
router.get('/:contactId/details', getDetails)

router.route('/:contactId/edit').get(editDetails).post(postDetails, editDetails)

router.post('/:id/archive', archiveContact)
router.get('/:id/unarchive', unarchiveContact)

router.get('/:contactId/audit', getAudit)

router.get('/:contactId/documents', renderDocuments)

router.use(
  urls.contacts.interactions.index.route,
  setInteractionsDetails,
  interactionsRouter
)

module.exports = router
