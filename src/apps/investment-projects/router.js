const router = require('express').Router()

const { ENTITIES } = require('../search/constants')
const { DEFAULT_COLLECTION_QUERY, APP_PERMISSIONS, QUERY_FIELDS, QUERY_DATE_FIELDS } = require('./constants')

const { getRequestBody } = require('../../middleware/collection')
const { detectUserAgent } = require('../../middleware/detect-useragent')
const { getCollection, exportCollection } = require('../../modules/search/middleware/collection')

const setInvestmentTabItems = require('./middleware/investments-tab-items')
const setLocalNavigation = require('./middleware/local-navigation')
const { setDefaultQuery, redirectToFirstNavItem, handleRoutePermissions } = require('../middleware')
const { shared } = require('./middleware')
const {
  getBriefInvestmentSummary,
  expandTeamMembers,
} = require('./middleware/team')

const {
  create,
  archive,
  audit,
  details,
  documents,
  edit,
  evaluation,
  team,
} = require('./controllers')

const {
  clientRelationshipManagementFormMiddleware,
  detailsFormMiddleware,
  investmentTypeFormMiddleware,
  projectManagementFormMiddleware,
  projectStageFormMiddleware,
  requirementsFormMiddleware,
  valueFormMiddleware,
} = require('./middleware/forms')

const { renderProjectsView } = require('./controllers/projects')
const { renderProfilesView } = require('./controllers/profiles')
const { renderOpportunitiesView } = require('./controllers/opportunities')

const { renderPropositionList } = require('./controllers/propositions')
const { renderEvidenceView } = require('./controllers/evidence')
const { renderAddEvidence } = require('./apps/evidence/controllers/create')
const { postUpload } = require('../documents/middleware/upload')

const { setInteractionsDetails, setCompanyDetails } = require('./middleware/interactions')
const { setPropositionsReturnUrl } = require('./middleware/propositions')
const { setEvidenceReturnUrl, setEvidenceDocumentsOptions, getDownloadLink, deleteEvidence } = require('./middleware/evidence')

const { renderTeamEdit } = require('./controllers/team/edit-team-members')
const { populateTeamEditForm, postTeamEdit } = require('./middleware/forms/team-members')

const {
  renderStatusPage,
  postStatus,
} = require('./controllers/status')

const {
  selectUKCompany,
  searchForUKCompany,
  renderCompanyResults,
  removeUKCompany,
} = require('./controllers/ukcompany')

const {
  selectAssociatedInvestmentProject,
  searchForAssociatedInvestmentProject,
  renderAssociatedInvestmentProjectResults,
  removeAssociatedInvestmentProject,
} = require('./controllers/associated')

const { transformInvestmentProjectToListItem } = require('./transformers')

const interactionsRouter = require('../interactions/router.sub-app')
const propositionsRouter = require('../propositions/router.sub-app')

const projectsMiddleware = [
  detectUserAgent,
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  getRequestBody(QUERY_FIELDS, QUERY_DATE_FIELDS),
  getCollection('investment_project', ENTITIES, transformInvestmentProjectToListItem),
]

router.use(handleRoutePermissions(APP_PERMISSIONS))

router.use('/:investmentId', setLocalNavigation)
router.param('investmentId', shared.getInvestmentDetails)
router.param('companyId', shared.getCompanyDetails)

router.get('/',
  projectsMiddleware,
  renderProjectsView('_layouts/collection'),
)

router.get('/projects',
  projectsMiddleware,
  setInvestmentTabItems,
  renderProjectsView('investment-projects/views/projects'),
)

router.get('/profiles',
  setInvestmentTabItems,
  renderProfilesView,
)

router.get('/opportunities',
  setInvestmentTabItems,
  renderOpportunitiesView,
)

router.get('/export',
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  getRequestBody(QUERY_FIELDS, QUERY_DATE_FIELDS),
  exportCollection('investment_project'),
)

router.post('/:investmentId/details', archive.archiveInvestmentProjectHandler, details.detailsGetHandler)
router.get('/:investmentId/unarchive', archive.unarchiveInvestmentProjectHandler)

router.get('/:investmentId/audit', audit.getInvestmentAudit)

router.get('/create/:companyId?', create.start.redirectHandler, create.start.renderCreatePage)

router.get('/create/investment-type/info', create.investmentType.renderInvestmentInfoPage)

router
  .route('/create/investment-type/:companyId')
  .get(investmentTypeFormMiddleware.populateForm, create.investmentType.renderInvestmentTypePage)
  .post(
    investmentTypeFormMiddleware.validateForm,
    create.investmentType.postHandler,
    investmentTypeFormMiddleware.populateForm,
    create.investmentType.renderInvestmentTypePage
  )

router
  .route('/create/equity-source/:companyId')
  .get(create.equitySource.getHandler, create.equitySource.renderEquitySourcePage)
  .post(
    create.equitySource.postHandler,
    create.equitySource.getHandler,
    create.equitySource.renderEquitySourcePage
  )

router
  .route('/create/project/:equityCompanyId')
  .get(
    detailsFormMiddleware.populateForm,
    create.project.getHandler,
    create.project.renderCreateProjectPage
  )
  .post(
    detailsFormMiddleware.populateForm,
    detailsFormMiddleware.handleFormPost,
    detailsFormMiddleware.validateForm,
    create.project.postHandler,
    create.project.getHandler,
    create.project.renderCreateProjectPage
  )

router.get('/:investmentId', redirectToFirstNavItem)
router.get('/:investmentId/details', details.detailsGetHandler)

router
  .route('/:investmentId/edit-details')
  .get(detailsFormMiddleware.populateForm, edit.editDetailsGet)
  .post(detailsFormMiddleware.populateForm, detailsFormMiddleware.handleFormPost, edit.editDetailsPost, edit.editDetailsGet)

router
  .route('/:investmentId/edit-value')
  .get(valueFormMiddleware.populateForm, edit.editValueGet)
  .post(valueFormMiddleware.populateForm, valueFormMiddleware.handleFormPost, edit.renderValueForm)

router
  .route('/:investmentId/edit-requirements')
  .get(requirementsFormMiddleware.populateForm, edit.renderRequirementsForm)
  .post(requirementsFormMiddleware.handleFormPost, requirementsFormMiddleware.populateForm, edit.renderRequirementsForm)

router.get('/:investmentId/team', expandTeamMembers, team.details.getDetailsHandler)

router
  .route('/:investmentId/edit-project-management')
  .get(getBriefInvestmentSummary, projectManagementFormMiddleware.populateForm, team.editProjectManagement.getHandler)
  .post(
    getBriefInvestmentSummary,
    projectManagementFormMiddleware.populateForm,
    projectManagementFormMiddleware.handleFormPost,
    team.editProjectManagement.postHandler,
    team.editProjectManagement.getHandler
  )

router
  .route('/:investmentId/edit-client-relationship-management')
  .get(
    clientRelationshipManagementFormMiddleware.populateForm,
    team.editClientRelationshipManagement.getHandler
  )
  .post(
    clientRelationshipManagementFormMiddleware.populateForm,
    clientRelationshipManagementFormMiddleware.handleFormPost,
    team.editClientRelationshipManagement.postHandler,
    team.editClientRelationshipManagement.getHandler
  )

router
  .route('/:investmentId/edit-team-members')
  .get(populateTeamEditForm, renderTeamEdit)
  .post(postTeamEdit, renderTeamEdit)

router.get('/:investmentId/propositions', setPropositionsReturnUrl, renderPropositionList)

router.get('/:investmentId/evaluation', evaluation.renderEvaluationPage)

router.get('/:investmentId/evidence', setEvidenceReturnUrl, renderEvidenceView)

router
  .route('/:investmentId/evidence/add-new')
  .get(
    setEvidenceReturnUrl,
    renderAddEvidence,
  )
  .post(
    setEvidenceReturnUrl,
    setEvidenceDocumentsOptions,
    postUpload,
  )

router
  .route('/:investmentId/evidence/:evidenceId/download')
  .get(
    getDownloadLink
  )

router
  .route('/:investmentId/evidence/:evidenceId/delete')
  .get(
    setEvidenceReturnUrl,
    deleteEvidence
  )

router.post('/:investmentId/change-project-stage', projectStageFormMiddleware.handleFormPost)

router.use('/:investmentId', setInteractionsDetails, setCompanyDetails, interactionsRouter)

router.use('/:investmentId', setPropositionsReturnUrl, propositionsRouter)

router
  .route('/:investmentId/status')
  .post(postStatus, renderStatusPage)
  .get(renderStatusPage)

router.get('/:investmentId/edit-ukcompany', selectUKCompany, searchForUKCompany, renderCompanyResults)
router.get('/:investmentId/remove-ukcompany', removeUKCompany)

// Todo - DH-1030
// Currently to associate the user you must click a link in the investment details page after
// indicating there is an association with a non-fdi r&d project
// Review the investment flow later to see if this can be improved.

router.get('/:investmentId/edit-associated',
  selectAssociatedInvestmentProject,
  searchForAssociatedInvestmentProject,
  renderAssociatedInvestmentProjectResults
)

router.get('/:investmentId/remove-associated', removeAssociatedInvestmentProject)

router.get('/:investmentId/documents', documents.renderDocuments)

module.exports = router
