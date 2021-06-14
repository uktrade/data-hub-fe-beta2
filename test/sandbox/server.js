const express = require('express')
const bodyParser = require('body-parser')
const _ = require('lodash')

const config = {
  PORT: process.env.SANDBOX_PORT || 8000,
}

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// TODO: Remove these legacy Sandbox vars after all the mocks are refactored
global.state = {}
global._ = _

var adviser = require('./routes/adviser.js')
var dashboard = require('./routes/dashboard.js')
var healthcheck = require('./routes/ping.js')
// TODO: `/metadata/*` endpoints are deprecated and should be removed or on after 17th October 2019
var metadata = require('./routes/metadata.js')
var user = require('./routes/whoami.js')
var helpCentre = require('./routes/helpCentre.js')
var zendesk = require('./routes/zendesk.js')
var postcode = require('./routes/postcode.js')

// V3
var v3Contact = require('./routes/v3/contact/contact.js')
var v3Event = require('./routes/v3/event/event.js')
var v3OMIS = require('./routes/v3/omis/omis.js')
var v3FeatureFlag = require('./routes/v3/feature-flag/feature-flag.js')
var v3Interaction = require('./routes/v3/interaction/interaction.js')
var v3Investment = require('./routes/v3/investment/investment-projects.js')
var v3SearchCompany = require('./routes/v3/search/company.js')
var v3SearchContact = require('./routes/v3/search/contact.js')
var v3SearchEvent = require('./routes/v3/search/event.js')
var v3SearchInvestmentProject = require('./routes/v3/search/investment-project.js')

var v3SearchOrder = require('./routes/v3/search/order.js')
var v3SearchInteraction = require('./routes/v3/search/interaction.js')

// V4
var v4ActivityFeed = require('./routes/v4/activity-feed/activity-feed.js')
var v4ChCompany = require('./routes/v4/ch-company/company.js')
var v4Company = require('./routes/v4/company/company.js')
var v4CompanyList = require('./routes/v4/company-list/companyList.js')
var v4Dnb = require('./routes/v4/dnb/index.js')
var v4Investment = require('./routes/v4/investment/investment.js')
var v4Interaction = require('./routes/v4/interaction/interaction.js')
var v4Adviser = require('./routes/v4/adviser/adviser.js')
var v4Metadata = require('./routes/v4/metadata/index.js')
var v4SearchCompany = require('./routes/v4/search/company.js')
var v4SearchCompanyWithCountry = require('./routes/v4/search/company/autocomplete.js')
var v4SearchLargeInvestorProfiles = require('./routes/v4/search/large-investor-profile/results.js')
var v4SearchExports = require('./routes/v4/search/export')
var v4referralList = require('./routes/v4/referrals/list.js')
var v4pipelineItem = require('./routes/v4/pipeline-item/index.js')
var v4Proposition = require('./routes/v4/proposition/proposition.js')

// Datahub API 3rd party dependencies
var consentService = require('./routes/api/consentService.js')

// Data store service (github.com/uktrade/data-store-service)
app.get('/api/v1/get-postcode-data/', postcode.toRegion)
app.get('/api/v1/get-postcode-data/:postCode', postcode.toRegion)

// getaddress.io mock
app.get('/sandbox/postcodelookup/', postcode.lookup)

// Referral details
app.get('/v4/company-referral/:id', v4Company.referralDetails)
// Send a referral
app.post('/v4/company-referral', v4Company.referralDetails)

// Complete referral
app.post('/v4/company-referral/:id/complete', v3Interaction.createInteraction)
app.get('/v4/company-referral', v4referralList)

// Adviser endpoint
app.get('/adviser/', adviser.advisers)
app.get('/adviser/:id/', adviser.singleAdviser)

// Dashboard endpoint
app.get('/dashboard/homepage/', dashboard.homePage)

// Metadata endpoint
// TODO: Metadata `/metadata/*` endpoints are deprecated and should be removed on or after 17th October 2019
app.get('/metadata/likelihood-to-land/', metadata.likelihoodToLand)
app.get(
  '/metadata/export-experience-category/',
  metadata.exportExperienceCategory
)
app.get('/metadata/investment-investor-type/', metadata.investmentInvestorType)
app.get('/metadata/investment-involvement/', metadata.investmentInvolvement)
app.get(
  '/metadata/investment-specific-programme/',
  metadata.investmentSpecificProgramme
)
app.get('/metadata/investment-project-stage/', metadata.investmentProjectStage)
app.get(
  '/metadata/investment-business-activity/',
  metadata.investmentBusinessActivity
)
app.get('/metadata/investment-type/', metadata.investmentType)
app.get(
  '/metadata/investment-strategic-driver/',
  metadata.investmentStrategicDriver
)
app.get('/metadata/order-service-type/', metadata.orderServiceType)
app.get(
  '/metadata/order-cancellation-reason/',
  metadata.orderCancellationReason
)
app.get('/metadata/omis-market/', metadata.omisMarket)
app.get('/metadata/salary-range/', metadata.salaryRange)
app.get('/metadata/fdi-value/', metadata.fdiValue)
app.get('/metadata/fdi-type/', metadata.fdiType)
app.get('/metadata/turnover/', metadata.turnover)
app.get('/metadata/sector/', metadata.sector)
app.get('/metadata/location-type/', metadata.locationType)
app.get('/metadata/event-type/', metadata.eventType)
app.get('/metadata/programme/', metadata.programme)
app.get('/metadata/business-type/', metadata.businessType)
app.get('/metadata/evidence-tag/', metadata.evidenceTag)
app.get('/metadata/employee-range/', metadata.employeeRange)
app.get('/metadata/country/', metadata.country)
app.get('/metadata/uk-region/', metadata.ukRegion)
app.get('/metadata/referral-source-website/', metadata.referralSourceWebsite)
app.get(
  '/metadata/referral-source-marketing/',
  metadata.referralSourceMarketing
)
app.get('/metadata/referral-source-activity/', metadata.referralSourceActivity)
app.get('/metadata/headquarter-type/', metadata.headquarterType)
app.get('/metadata/service/', metadata.service)
app.get('/metadata/communication-channel/', metadata.communicationChannel)
app.get('/metadata/team/', metadata.team)
app.get('/metadata/policy-area/', metadata.policyArea)
app.get('/metadata/policy-issue-type/', metadata.policyIssueType)
app.get('/metadata/service-delivery-status/', metadata.serviceDeliveryStatus)
app.get(
  '/metadata/capital-investment/investor-type/',
  metadata.capitalInvestmentInvestorType
)
app.get(
  '/metadata/capital-investment/required-checks-conducted/',
  metadata.capitalInvestmentRequiredChecks
)
app.get(
  '/metadata/capital-investment/deal-ticket-size/',
  metadata.capitalInvestmentDealTicketSize
)
app.get(
  '/metadata/capital-investment/large-capital-investment-type/',
  metadata.capitalInvestmentInvestmentTypes
)
app.get(
  '/metadata/capital-investment/return-rate/',
  metadata.capitalInvestmentMinimumReturnRate
)
app.get(
  '/metadata/capital-investment/time-horizon/',
  metadata.capitalInvestmentTimeHorizons
)
app.get(
  '/metadata/capital-investment/restriction/',
  metadata.capitalInvestmentRestrictions
)
app.get(
  '/metadata/capital-investment/construction-risk/',
  metadata.capitalInvestmentConstructionRisks
)
app.get(
  '/metadata/capital-investment/equity-percentage/',
  metadata.capitalInvestmentEquityPercentage
)
app.get(
  '/metadata/capital-investment/desired-deal-role/',
  metadata.capitalInvestmentDesiredDealRoles
)
app.get(
  '/metadata/capital-investment/asset-class-interest/',
  metadata.capitalInvestmentAssetClassInterest
)
app.get('/metadata/one-list-tier/', metadata.oneListTier)

// V4 Metadata endpoints
app.get('/v4/metadata/likelihood-to-land', v4Metadata.likelihoodToLand)
app.get(
  '/v4/metadata/export-experience-category',
  v4Metadata.exportExperienceCategory
)
app.get(
  '/v4/metadata/investment-investor-type',
  v4Metadata.investmentInvestorType
)
app.get('/v4/metadata/investment-involvement', v4Metadata.investmentInvolvement)
app.get(
  '/v4/metadata/investment-specific-programme',
  v4Metadata.investmentSpecificProgramme
)
app.get(
  '/v4/metadata/investment-project-stage',
  v4Metadata.investmentProjectStage
)
app.get(
  '/v4/metadata/investment-business-activity',
  v4Metadata.investmentBusinessActivity
)
app.get('/v4/metadata/investment-type', v4Metadata.investmentType)
app.get(
  '/v4/metadata/investment-strategic-driver',
  v4Metadata.investmentStrategicDriver
)
app.get(
  '/v4/metadata/investment-delivery-partner',
  v4Metadata.investmentDeliveryPartner
)
app.get('/v4/metadata/order-service-type', v4Metadata.orderServiceType)
app.get(
  '/v4/metadata/order-cancellation-reason',
  v4Metadata.orderCancellationReason
)
app.get('/v4/metadata/omis-market', v4Metadata.omisMarket)
app.get('/v4/metadata/salary-range', v4Metadata.salaryRange)
app.get('/v4/metadata/fdi-value', v4Metadata.fdiValue)
app.get('/v4/metadata/fdi-type', v4Metadata.fdiType)
app.get('/v4/metadata/turnover', v4Metadata.turnover)
app.get('/v4/metadata/sector', v4Metadata.sector)
app.get('/v4/metadata/location-type', v4Metadata.locationType)
app.get('/v4/metadata/event-type', v4Metadata.eventType)
app.get('/v4/metadata/programme', v4Metadata.programme)
app.get('/v4/metadata/business-type', v4Metadata.businessType)
app.get('/v4/metadata/evidence-tag', v4Metadata.evidenceTag)
app.get('/v4/metadata/employee-range', v4Metadata.employeeRange)
app.get('/v4/metadata/country', v4Metadata.country)
app.get('/v4/metadata/uk-region', v4Metadata.ukRegion)
app.get('/v4/metadata/administrative-area', v4Metadata.administrativeArea)
app.get(
  '/v4/metadata/referral-source-website',
  v4Metadata.referralSourceWebsite
)
app.get(
  '/v4/metadata/referral-source-marketing',
  v4Metadata.referralSourceMarketing
)
app.get(
  '/v4/metadata/referral-source-activity',
  v4Metadata.referralSourceActivity
)
app.get('/v4/metadata/headquarter-type', v4Metadata.headquarterType)
app.get('/v4/metadata/service', v4Metadata.service)
app.get('/v4/metadata/communication-channel', v4Metadata.communicationChannel)
app.get('/v4/metadata/team', v4Metadata.team)
app.get('/v4/metadata/policy-area', v4Metadata.policyArea)
app.get('/v4/metadata/policy-issue-type', v4Metadata.policyIssueType)
app.get(
  '/v4/metadata/service-delivery-status',
  v4Metadata.serviceDeliveryStatus
)
app.get(
  '/v4/metadata/capital-investment/investor-type',
  v4Metadata.capitalInvestmentInvestorType
)
app.get(
  '/v4/metadata/capital-investment/required-checks-conducted',
  v4Metadata.capitalInvestmentRequiredChecks
)
app.get(
  '/v4/metadata/capital-investment/deal-ticket-size',
  v4Metadata.capitalInvestmentDealTicketSize
)
app.get(
  '/v4/metadata/capital-investment/large-capital-investment-type',
  v4Metadata.capitalInvestmentInvestmentTypes
)
app.get(
  '/v4/metadata/capital-investment/return-rate',
  v4Metadata.capitalInvestmentMinimumReturnRate
)
app.get(
  '/v4/metadata/capital-investment/time-horizon',
  v4Metadata.capitalInvestmentTimeHorizons
)
app.get(
  '/v4/metadata/capital-investment/restriction',
  v4Metadata.capitalInvestmentRestrictions
)
app.get(
  '/v4/metadata/capital-investment/construction-risk',
  v4Metadata.capitalInvestmentConstructionRisks
)
app.get(
  '/v4/metadata/capital-investment/equity-percentage',
  v4Metadata.capitalInvestmentEquityPercentage
)
app.get(
  '/v4/metadata/capital-investment/desired-deal-role',
  v4Metadata.capitalInvestmentDesiredDealRoles
)
app.get(
  '/v4/metadata/capital-investment/asset-class-interest',
  v4Metadata.capitalInvestmentAssetClassInterest
)
app.get('/v4/metadata/one-list-tier', v4Metadata.oneListTier)
app.get('/v4/metadata/trade-agreement', v4Metadata.tradeAgreement)

// Ping
app.get('/ping.xml', healthcheck.ping)

// V3 Contact
app.get('/v3/contact', v3Contact.contact)
app.post('/v3/contact', v3Contact.contactCreate)
app.get('/v3/contact/:contactId', v3Contact.contactById)
app.patch('/v3/contact/:contactId', v3Contact.updateContactById)

// V3 Event
app.get('/v3/event/:eventId', v3Event.eventById)

// V3 Feature Flag
app.get('/v3/feature-flag', v3FeatureFlag.featureFlag)
app.put('/sandbox/feature-flag', v3FeatureFlag.setSandboxFlag)
app.post('/sandbox/reset-feature-flag', v3FeatureFlag.resetSandboxFlags)

// V3 Interaction
app.get('/v3/interaction', v3Interaction.getInteractions)
app.get('/v3/interaction/:interactionId', v3Interaction.getInteractionById)
app.post('/v3/interaction', v3Interaction.createInteraction)
app.post(
  '/v3/interaction/:interactionId/archive',
  v3Interaction.archiveInteraction
)
app.patch('/v3/interaction/:interactionId', v3Interaction.archiveInteraction)

// V3 Investment
app.get('/v3/investment', v3Investment.investmentProjects)
app.get('/v3/investment/:id', v3Investment.investmentProjectById)
app.patch('/v3/investment/:id', v3Investment.patchInvestmentProject)
app.get(
  '/v3/investment/:investmentId/audit',
  v3Investment.investmentProjectAudit
)
app.post('/v3/investment/:id/update-stage', v3Investment.investmentProjectById)

// V3 Omis
app.get('/v3/omis/order/:id', v3OMIS.getOrderById)
app.patch('/v3/omis/order/:id', v3OMIS.getOrderById)
app.get('/v3/omis/order/:id/assignee', v3OMIS.assignees)
app.get('/v3/omis/order/:id/invoice', v3OMIS.invoice)
app.get('/v3/omis/order/:id/subscriber-list', v3OMIS.subscriberList)
app.get('/v3/omis/order/:id/payment', v3OMIS.payments)

// V3 Search
app.get('/v3/search', v3SearchCompany.companies)
app.post('/v3/search/company', v3SearchCompany.companies)
app.post('/v3/search/contact', v3SearchContact.contacts)
app.post('/v3/search/event', v3SearchEvent.events)
app.post('/v3/search/order', v3SearchOrder.order)
app.post(
  '/v3/search/investment_project',
  v3SearchInvestmentProject.investmentProjects
)
app.post(
  '/v3/search/investment_project/export',
  v3SearchInvestmentProject.export
)
app.post(
  '/v4/search/large-investor-profile/export',
  v3SearchInvestmentProject.export
)
app.post(
  '/v4/search/large-capital-opportunity/export',
  v3SearchInvestmentProject.export
)
app.post('/v3/search/interaction', v3SearchInteraction.interaction)

// V4 activity feed
app.get('/v4/activity-feed', v4ActivityFeed.activityFeed)

// V4 Adviser
app.get(
  '/v4/adviser/:adviserId/investment-summary',
  v4Adviser.investmentSummary
)

// V4 CH Company
app.get('/v4/ch-company/:companyId', v4ChCompany.company)

// V4 Company
app.get('/v4/company/:companyId', v4Company.company)
app.patch('/v4/company/:companyId', v4Company.companyPatched)
app.post('/v4/company', v4Company.company)
app.get('/v4/company', v4Company.companies)
app.post(
  '/v4/company/:companyId/:action-account-manager',
  v4Company.manageAdviser
)
app.get('/v4/company/:companyId/audit', v4Company.companyAudit)
app.get('/v4/company/:companyId/export-win', v4Company.exportWins)
app.patch('/v4/company/:companyId/export-detail', v4Company.exportDetail)
app.get(
  '/v4/company/:companyId/one-list-group-core-team',
  v4Company.getOneListGroupCoreTeam
)
app.post(
  '/v4/company/:companyId/assign-one-list-tier-and-global-account-manager',
  v4Company.postOneListTierAndGlobalAccountManager
)
app.post(
  '/v4/company/:companyId/remove-from-one-list',
  v4Company.postRemoveFromOneList
)
app.patch(
  '/v4/company/:companyId/update-one-list-core-team',
  v4Company.patchOneListCoreTeam
)

// V4 interactions
app.get('/v4/interaction', v4Interaction.getInteractions)
app.get('/v4/interaction/:interactionId', v4Interaction.getInteractionById)
app.post('/v4/interaction', v4Interaction.createInteraction)
app.post(
  '/v4/interaction/:interactionId/archive',
  v4Interaction.archiveInteraction
)
app.patch('/v4/interaction/:interactionId', v4Interaction.archiveInteraction)

// V4 DnB
app.post('/v4/dnb/company-create', v4Dnb.companyCreate)
app.post('/v4/dnb/company-investigation', v4Dnb.companyInvestigation)
app.post('/v4/dnb/company-search', v4Dnb.companySearch)
app.post('/v4/dnb/company-link', v4Dnb.companyLink)
app.post('/v4/dnb/company-change-request', v4Dnb.companyChangeRequest)
app.get('/v4/dnb/company-change-request', v4Dnb.companyChangeRequest)

// V4 legacy company list
app.get('/v4/user/company-list/:companyId', v4Company.getCompanyList)
app.get('/v4/user/company-list', v4Company.getCompanyList)

// V4 new company list endpoints (with multiple list support)
app.get('/v4/company-list', v4CompanyList.getCompanyLists)
app.get('/v4/company-list/:listId', v4CompanyList.getCompanyList)
app.get('/v4/company-list/:listId/item', v4CompanyList.getCompanyListItems)
app.post('/v4/company-list', v4CompanyList.createCompanyList)
app.delete('/v4/company-list/:listId', v4CompanyList.deleteCompanyList)
app.patch('/v4/company-list/:listId', v4CompanyList.editCompanyList)
app.put(
  '/v4/company-list/:listId/item/:companyId',
  v4CompanyList.addCompanyToList
)
app.delete(
  '/v4/company-list/:listId/item/:companyId',
  v4CompanyList.removeCompanyFromList
)

// V4 Investment
app.get('/v4/large-investor-profile', v4Company.largeInvestorProfile)
app.patch(
  '/v4/large-investor-profile/:profileId',
  v4Company.largeInvestorProfilePatched
)
app.post('/v4/large-investor-profile', v4Company.largeInvestorProfilePostCreate)
app.get(
  '/v4/large-capital-opportunity/:opportunityId',
  v4Investment.getLargeCapitalOpportunity
)
app.patch(
  '/v4/large-capital-opportunity/:opportunityId',
  v4Investment.saveOpportunityDetails
)
app.get(
  '/v4/large-capital-opportunity',
  v4Investment.getLargeCapitalOpportunityList
)
app.post(
  '/v4/search/large-capital-opportunity',
  v4Investment.getLargeCapitalOpportunityList
)

// V4 Proposition
app.get('/v4/proposition', v4Proposition.propositions)

// V4 Search
app.post('/v4/search/company', v4SearchCompany.companies)
app.post(
  '/v4/search/large-investor-profile',
  v4SearchLargeInvestorProfiles.largeInvestorProfile
)
app.get(
  '/v4/search/company/autocomplete',
  v4SearchCompanyWithCountry.companiesAutocomplete
)
app.post(
  '/v4/search/export-country-history',
  v4SearchExports.fetchExportHistory
)

// Whoami endpoint
app.get('/whoami', user.whoami)
app.put('/whoami', user.setWhoami)
app.post('/whoami', user.resetWhoami)

// Help centre endpoint
app.get('/help-centre/announcement', helpCentre.announcement)

// Zendesk tickets endpoint
app.post('/zendesk/tickets', zendesk.tickets)

// Pipeline endpoint
app.get('/v4/pipeline-item', v4pipelineItem.getPipelineItems)
app.post('/v4/pipeline-item', v4pipelineItem.createUpdatePipelineItem)
app.patch(
  '/v4/pipeline-item/:pipelineItemId',
  v4pipelineItem.createUpdatePipelineItem
)
app.get('/v4/pipeline-item/:pipelineItemId', v4pipelineItem.getPipelineItem)
app.post(
  '/v4/pipeline-item/:pipelineItemId/archive',
  v4pipelineItem.archivePipelineItem
)
app.post(
  '/v4/pipeline-item/:pipelineItemId/unarchive',
  v4pipelineItem.unarchivePipelineItem
)
app.delete(
  '/v4/pipeline-item/:pipelineItemId',
  v4pipelineItem.deletePipelineItem
)

app.post('/api/v1/person', consentService.person)
app.get('/api/v1/person/bulk_lookup', consentService.bulkPerson)

app.post('/v4/large-capital-opportunity', (req, res) =>
  res.json({ id: 'new-large-capital-uk-opportunity-id' })
)

app.use((req, res) =>
  res.status(404).json({ message: 'Route' + req.url + ' Not found.' })
)

app.use((error, req, res) =>
  res.status(500).json({ message: error.toString() })
)

const server = app.listen(config.PORT, () => {
  const port = server.address().port
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${port}`)
})
