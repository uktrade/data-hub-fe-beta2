const router = require('express').Router()
const { ENTITIES } = require('../search/constants')
const { LOCAL_NAV, DEFAULT_COLLECTION_QUERY, APP_PERMISSIONS, QUERY_FIELDS } = require('./constants')

const { getRequestBody } = require('../../middleware/collection')
const { getCollection, exportCollection } = require('../../modules/search/middleware/collection')

const { renderCompanyList } = require('./controllers/list')
const { renderForm } = require('./controllers/edit')
const { renderDetails } = require('./controllers/details')

const {
  renderBusinessDetails,
} = require('./controllers/business-details')

const { renderRegion, updateRegion } = require('./controllers/business-details-region')
const { renderSector, updateSector } = require('./controllers/business-details-sector')

const { renderOrders } = require('./controllers/orders')
const { renderAuditLog } = require('./controllers/audit')
const { archiveCompany, unarchiveCompany } = require('./controllers/archive')
const { renderContacts } = require('./controllers/contacts')
const { renderDocuments } = require('./controllers/documents')
const { renderAddGlobalHQ } = require('./controllers/hierarchies')
const { renderSubsidiaries } = require('./controllers/subsidiaries')
const { renderLinkSubsidiary } = require('./controllers/subsidiary-link')
const { renderAdvisers } = require('./controllers/advisers')

const {
  renderExports,
  populateExportForm,
  renderExportEdit,
  handleEditFormPost,
} = require('./controllers/exports')

const { setDefaultQuery, redirectToFirstNavItem, handleRoutePermissions } = require('../middleware')

const {
  getGlobalHQCompaniesCollection,
  getSubsidiaryCompaniesCollection,
} = require('./middleware/collection')

const { setCompanyContactRequestBody, getCompanyContactCollection } = require('./middleware/contact-collection')
const { populateForm, handleFormPost } = require('./middleware/form')
const { getCompany, setIsCompanyAlreadyAdded, setDoAnyListsExist, addCompanyOrRemoveFromList } = require('./middleware/params')
const { setInteractionsDetails } = require('./middleware/interactions')
const { setGlobalHQ, removeGlobalHQ, addSubsidiary } = require('./middleware/hierarchies')
const setCompaniesLocalNav = require('./middleware/local-navigation')

const { transformCompanyToListItem } = require('./transformers')

const addCompanyFormRouter = require('./apps/add-company/router')
const editCompanyFormRouter = require('./apps/edit-company/router')

const investmentsRouter = require('./apps/investments/router')
const matchingRouter = require('./apps/matching/router')
const interactionsRouter = require('../interactions/router.sub-app')
const activityFeedRouter = require('./apps/activity-feed/router')
const companyListsRouter = require('../company-lists/router')

router.use(handleRoutePermissions(APP_PERMISSIONS))

router.param('companyId', getCompany)
router.param('companyId', setIsCompanyAlreadyAdded)
router.param('companyId', setDoAnyListsExist)

router.get('/',
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  getRequestBody(QUERY_FIELDS),
  getCollection('company', ENTITIES, transformCompanyToListItem),
  renderCompanyList,
)

router.get('/export',
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  getRequestBody(QUERY_FIELDS),
  exportCollection('company'),
)

router.use('/create', addCompanyFormRouter)
router.use('/:companyId/lists', companyListsRouter)
router.use('/:companyId/edit', editCompanyFormRouter)

router
  .route('/:companyId/exports/edit')
  .get(populateExportForm, renderExportEdit)
  .post(populateExportForm, handleEditFormPost, renderExportEdit)

// TODO: Remove in a separate PR
router
  .route('/:companyId/edit-old')
  .get(populateForm, renderForm)
  .post(handleFormPost, populateForm, renderForm)

router.post('/:companyId/archive', archiveCompany)
router.get('/:companyId/unarchive', unarchiveCompany)

router.use('/:companyId', handleRoutePermissions(LOCAL_NAV), setCompaniesLocalNav)
router.get('/:companyId', redirectToFirstNavItem)
router.get('/:companyId/details', renderDetails)

router.get('/:companyId/business-details', renderBusinessDetails)

router
  .route('/:companyId/business-details/region')
  .get(renderRegion)
  .post(updateRegion)

router
  .route('/:companyId/business-details/sector')
  .get(renderSector)
  .post(updateSector)

router.get('/:companyId/advisers', renderAdvisers)

router.get('/:companyId/hierarchies/ghq/search', getGlobalHQCompaniesCollection, renderAddGlobalHQ)
router.get('/:companyId/hierarchies/ghq/:globalHqId/add', setGlobalHQ)
router.get('/:companyId/hierarchies/ghq/remove', removeGlobalHQ)

router.get('/:companyId/hierarchies/subsidiaries/search', getSubsidiaryCompaniesCollection, renderLinkSubsidiary)
router.get('/:companyId/hierarchies/subsidiaries/:subsidiaryCompanyId/add', addSubsidiary)

router.get('/:companyId/contacts',
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  setCompanyContactRequestBody,
  getCompanyContactCollection,
  renderContacts
)

router.get('/:companyId/exports', renderExports)
router.get('/:companyId/subsidiaries', renderSubsidiaries)
router.get('/:companyId/subsidiaries/link', renderLinkSubsidiary)
router.get('/:companyId/orders', renderOrders)
router.get('/:companyId/audit', renderAuditLog)
router.get('/:companyId/documents', renderDocuments)
router.use('/:companyId/investments', investmentsRouter)
router.use('/:companyId/matching', matchingRouter)
router.use('/:companyId', setInteractionsDetails, interactionsRouter)
router.use('/:companyId/activity', activityFeedRouter)

router.post('/:companyId/manage-company-list', addCompanyOrRemoveFromList)

module.exports = router
