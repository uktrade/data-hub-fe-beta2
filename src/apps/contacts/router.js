const router = require('express').Router()
const urls = require('../../lib/urls')

const { ENTITIES } = require('../search/constants')
const {
  LOCAL_NAV,
  DEFAULT_COLLECTION_QUERY,
  QUERY_FIELDS,
} = require('./constants')

const { getRequestBody } = require('../../middleware/collection')
const {
  getCollection,
  exportCollection,
} = require('../../modules/search/middleware/collection')

const {
  setLocalNav,
  setDefaultQuery,
  redirectToFirstNavItem,
  handleRoutePermissions,
} = require('../middleware')
const { getCommon, getDetails } = require('./controllers/details')
const { renderContactList } = require('./controllers/list')
const { renderContactsView } = require('./controllers/contacts')
const createAndEdit = require('./controllers/create-and-edit')
const { archiveContact, unarchiveContact } = require('./controllers/archive')
const { renderDocuments } = require('./controllers/documents')
const { getAudit } = require('./controllers/audit')

const { setInteractionsDetails } = require('./middleware/interactions')

const { transformContactToListItem } = require('./transformers')

const interactionsRouter = require('../interactions/router.sub-app')

router.get(
  urls.contacts.index.route,
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  getRequestBody(QUERY_FIELDS),
  getCollection('contact', ENTITIES, transformContactToListItem),
  renderContactList
)

// New react route (to replace the old companies list route above when complete)
router.get(urls.contacts.react.index.route, renderContactsView)
router.get(['/create', '/:contactId/edit'], createAndEdit)

router.get(
  '/export',
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  getRequestBody(QUERY_FIELDS),
  exportCollection('contact')
)

router.use(
  '/:contactId',
  handleRoutePermissions(LOCAL_NAV),
  getCommon,
  setLocalNav(LOCAL_NAV)
)

router.get('/:contactId', redirectToFirstNavItem)
router.get('/:contactId/details', getDetails)

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
