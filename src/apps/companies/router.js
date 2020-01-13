const router = require('express').Router()

const urls = require('../../lib/urls')

const { ENTITIES } = require('../search/constants')
const {
  LOCAL_NAV,
  DEFAULT_COLLECTION_QUERY,
  APP_PERMISSIONS,
  QUERY_FIELDS,
} = require('./constants')

const setReturnUrl = require('./middleware/set-return-url')
const { getRequestBody } = require('../../middleware/collection')
const {
  getCollection,
  exportCollection,
} = require('../../modules/search/middleware/collection')

const { renderCompanyList } = require('./controllers/list')
const { renderDetails } = require('./controllers/details')

const { renderBusinessDetails } = require('./apps/business-details/controllers')

const { renderOrders } = require('./controllers/orders')
const { renderAuditLog } = require('./controllers/audit')
const { archiveCompany, unarchiveCompany } = require('./controllers/archive')
const { renderContacts } = require('./controllers/contacts')
const { renderDocuments } = require('./controllers/documents')
const { renderAddGlobalHQ } = require('./controllers/hierarchies')
const { renderSubsidiaries } = require('./controllers/subsidiaries')
const { renderLinkSubsidiary } = require('./controllers/subsidiary-link')

const {
  setDefaultQuery,
  redirectToFirstNavItem,
  handleRoutePermissions,
} = require('../middleware')

const {
  getGlobalHQCompaniesCollection,
  getSubsidiaryCompaniesCollection,
} = require('./middleware/collection')

const {
  setCompanyContactRequestBody,
  getCompanyContactCollection,
} = require('./middleware/contact-collection')
const {
  getCompany,
  setIsCompanyAlreadyAdded,
  addCompanyOrRemoveFromList,
} = require('./middleware/params')
const { setInteractionsDetails } = require('./middleware/interactions')
const {
  setGlobalHQ,
  removeGlobalHQ,
  addSubsidiary,
} = require('./middleware/hierarchies')
const setCompaniesLocalNav = require('./middleware/local-navigation')
const lastInteractionDate = require('./middleware/last-interaction-date')
const search = require('./middleware/search')

const { transformCompanyToListItem } = require('./transformers')

const addCompanyFormRouter = require('./apps/add-company/router')
const editCompanyFormRouter = require('./apps/edit-company/router')
const activityFeedRouter = require('./apps/activity-feed/router')
const dnbHierarchyRouter = require('./apps/dnb-hierarchy/router')
const businessDetailsRouter = require('./apps/business-details/router')
const editHistoryRouter = require('./apps/edit-history/router')
const matchCompanyRouter = require('./apps/match-company/router')
const exportsRouter = require('./apps/exports/router')
const investmentsRouter = require('./apps/investments/router')
const interactionsRouter = require('../interactions/router.sub-app')
const companyListsRouter = require('../company-lists/router')
const advisersRouter = require('./apps/advisers/router')

const {
  setCompanyHierarchyLocalNav,
  setDnbHierarchyDetails,
} = require('./apps/dnb-hierarchy/middleware')

router.use(handleRoutePermissions(APP_PERMISSIONS))

router.param('companyId', getCompany)
router.param('companyId', setIsCompanyAlreadyAdded)
router.param('companyId', setDnbHierarchyDetails)

router.get(
  urls.companies.index.route,
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  getRequestBody(QUERY_FIELDS),
  lastInteractionDate,
  search,
  getCollection('company', ENTITIES, transformCompanyToListItem),
  renderCompanyList
)

router.get(
  urls.companies.export.route,
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  getRequestBody(QUERY_FIELDS),
  lastInteractionDate,
  exportCollection('company')
)

router.use(urls.companies.create.route, addCompanyFormRouter)
router.use(urls.companies.lists.route, companyListsRouter)
router.use(urls.companies.edit.route, editCompanyFormRouter)
router.use(urls.companies.editHistory.index.route, editHistoryRouter)

router.post(urls.companies.archive.route, archiveCompany)
router.get(urls.companies.unarchive.route, unarchiveCompany)

router.use(
  urls.companies.detail.route,
  handleRoutePermissions(LOCAL_NAV),
  setCompaniesLocalNav
)
router.get(urls.companies.detail.route, redirectToFirstNavItem)
router.get(urls.companies.details.route, renderDetails)

router.get(urls.companies.businessDetails.route, renderBusinessDetails)

router.get(
  urls.companies.hierarchies.ghq.link.route,
  getGlobalHQCompaniesCollection,
  renderAddGlobalHQ
)
router.get(urls.companies.hierarchies.ghq.add.route, setGlobalHQ)
router.get(urls.companies.hierarchies.ghq.remove.route, removeGlobalHQ)

router.get(
  urls.companies.hierarchies.subsidiaries.search.route,
  getSubsidiaryCompaniesCollection,
  renderLinkSubsidiary
)
router.get(urls.companies.hierarchies.subsidiaries.add.route, addSubsidiary)

router.get(
  urls.companies.contacts.route,
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  setCompanyContactRequestBody,
  getCompanyContactCollection,
  setReturnUrl,
  renderContacts
)

router.get(urls.companies.orders.route, setReturnUrl, renderOrders)
router.get(urls.companies.audit.route, renderAuditLog)
router.get(urls.companies.documents.route, renderDocuments)
router.use(
  urls.companies.investments.companyInvestment.route,
  setReturnUrl,
  investmentsRouter
)
router.use(
  urls.companies.detail.route,
  setInteractionsDetails,
  interactionsRouter
)
router.use(urls.companies.advisers.index.route, setReturnUrl, advisersRouter)

router.post(urls.companies.manageCompanyList.route, addCompanyOrRemoveFromList)

router.use(urls.companies.subsidiaries.index.route, setCompanyHierarchyLocalNav)
router.get(urls.companies.subsidiaries.index.route, renderSubsidiaries)
router.get(urls.companies.subsidiaries.link.route, renderLinkSubsidiary)

router.use(activityFeedRouter)
router.use(dnbHierarchyRouter)
router.use(businessDetailsRouter)
router.use(matchCompanyRouter)
router.use(exportsRouter)

module.exports = router
