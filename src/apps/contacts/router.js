const router = require('express').Router()

const { LOCAL_NAV, DEFAULT_COLLECTION_QUERY } = require('./constants')

const { setLocalNav, setDefaultQuery, redirectToFirstNavItem, handleRoutePermissions } = require('../middleware')
const { getContactsCollection, getRequestBody } = require('./middleware/collection')
const { getCommon, getDetails } = require('./controllers/details')
const { renderContactList } = require('./controllers/list')
const { postDetails, editDetails } = require('./controllers/edit')
const { archiveContact, unarchiveContact } = require('./controllers/archive')
const { renderDocuments } = require('./controllers/documents')
const { renderInteractions } = require('./controllers/interactions')
const { renderPropositions } = require('./controllers/propositions')
const { getAudit } = require('./controllers/audit')

const { setInteractionsReturnUrl, setInteractionsEntityName, setCompanyDetails } = require('./middleware/interactions')
const { setPropositionsReturnUrl, setPropositionsEntityName, setCompanyDetailsWithProposition } = require('./middleware/propositions')
const {
  getInteractionCollection,
  getInteractionsRequestBody,
  getInteractionSortForm,
} = require('../interactions/middleware/collection')

const {
  getPropositionCollection,
  getPropositionsRequestBody,
  getPropositionSortForm,
} = require('../propositions/middleware/collection')

const interactionsRouter = require('../interactions/router.sub-app')
const propositionsRouter = require('../propositions/router.sub-app')

router.get('/', setDefaultQuery(DEFAULT_COLLECTION_QUERY), getRequestBody, getContactsCollection, renderContactList)

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

router.get('/:contactId/interactions',
  setInteractionsReturnUrl,
  getInteractionsRequestBody,
  getInteractionCollection,
  getInteractionSortForm,
  renderInteractions
)

router.get('/:contactId/propositions',
  setPropositionsReturnUrl,
  getPropositionsRequestBody,
  getPropositionCollection,
  getPropositionSortForm,
  renderPropositions
)

router.get('/:contactId/audit', getAudit)

router.get('/:contactId/documents', renderDocuments)

router.use('/:contactId', setInteractionsReturnUrl, setInteractionsEntityName, setCompanyDetails, interactionsRouter)
router.use('/:contactId', setPropositionsReturnUrl, setPropositionsEntityName, setCompanyDetailsWithProposition, propositionsRouter)

module.exports = router
