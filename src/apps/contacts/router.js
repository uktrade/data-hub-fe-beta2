const router = require('express').Router()

const { ENTITIES } = require('../search/constants')
const { LOCAL_NAV, DEFAULT_COLLECTION_QUERY, QUERY_FIELDS } = require('./constants')

const { getRequestBody } = require('../../middleware/collection')
const { getCollection } = require('../../modules/search/middleware/collection')

const { setLocalNav, setDefaultQuery, redirectToFirstNavItem, handleRoutePermissions } = require('../middleware')
const { getCommon, getDetails } = require('./controllers/details')
const { renderContactList } = require('./controllers/list')
const { postDetails, editDetails } = require('./controllers/edit')
const { archiveContact, unarchiveContact } = require('./controllers/archive')
const { renderDocuments } = require('./controllers/documents')
const { getAudit } = require('./controllers/audit')

const { setInteractionsDetails, setCompanyDetails } = require('./middleware/interactions')

const { transformContactToListItem } = require('./transformers')

const interactionsRouter = require('../interactions/router.sub-app')

router.get('/',
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  getRequestBody(QUERY_FIELDS),
  getCollection('contact', ENTITIES, transformContactToListItem),
  renderContactList,
)

router
  .route('/create')
  .get(editDetails)
  .post(postDetails, editDetails)

router.use('/:contactId', handleRoutePermissions(LOCAL_NAV), getCommon, setLocalNav(LOCAL_NAV))

router.get('/:contactId', redirectToFirstNavItem)
router.get('/:contactId/details', getDetails)

router
  .route('/:contactId/edit')
  .get(editDetails)
  .post(postDetails, editDetails)

router.post('/:id/archive', archiveContact)
router.get('/:id/unarchive', unarchiveContact)

router.get('/:contactId/audit', getAudit)

router.get('/:contactId/documents', renderDocuments)

router.use('/:contactId', setInteractionsDetails, setCompanyDetails, interactionsRouter)

module.exports = router
