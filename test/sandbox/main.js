var adviser = require('./routes/adviser.js')
var dashboard = require('./routes/dashboard.js')
var healthcheck = require('./routes/ping.js')
// TODO: `/metadata/*` endpoints are deprecated and should be removed or on after 17th October 2019
var metadata = require('./routes/metadata.js')
var user = require('./routes/whoami.js')
var v3Contact = require('./routes/v3/contact/contact.js')
var v3Event = require('./routes/v3/event/event.js')
var v3FeatureFlag = require('./routes/v3/feature-flag/feature-flag.js')
var v3Interaction = require('./routes/v3/interaction/interaction.js')
var v3Investment = require('./routes/v3/investment/investment-projects.js')
var v3SearchCompany = require('./routes/v3/search/company.js')
var v3SearchContact = require('./routes/v3/search/contact.js')
var v3SearchEvent = require('./routes/v3/search/event.js')
var v3SearchInvestmentProject = require('./routes/v3/search/investment-project.js')
var v3SearchOrder = require('./routes/v3/search/order.js')
var v3SearchInteraction = require('./routes/v3/search/interaction.js')
var helpCentre = require('./routes/helpCentre.js')
var zendesk = require('./routes/zendesk.js')

// V4
var v4ActivityFeed = require('./routes/v4/activity-feed/activity-feed.js')
var v4ChCompany = require('./routes/v4/ch-company/company.js')
var v4Company = require('./routes/v4/company/company.js')
var v4CompanyList = require('./routes/v4/company-list/companyList.js')
var v4Dnb = require('./routes/v4/dnb/index.js')
var v4Metadata = require('./routes/v4/metadata/index.js')
var v4SearchCompany = require('./routes/v4/search/company.js')
var v4SearchCompanyWithCountry = require('./routes/v4/search/company/autocomplete.js')
var v4SearchLargeInvestorProfiles = require('./routes/v4/search/large-investor-profile/results.js')
var v4ExportCountryHistory = require('./routes/v4/export-country-history.js')

// Adviser endpoint
Sandbox.define('/adviser/', 'GET', adviser.advisers)
Sandbox.define('/adviser/{id}/', 'GET', adviser.singleAdviser)

// Dashboard endpoint
Sandbox.define('/dashboard/homepage/', 'GET', dashboard.homePage)

// Metadata endpoint
// TODO: Metadata `/metadata/*` endpoints are deprecated and should be removed on or after 17th October 2019
Sandbox.define(
  '/metadata/likelihood-to-land/',
  'GET',
  metadata.likelihoodToLand
)
Sandbox.define(
  '/metadata/export-experience-category/',
  'GET',
  metadata.exportExperienceCategory
)
Sandbox.define(
  '/metadata/investment-investor-type/',
  'GET',
  metadata.investmentInvestorType
)
Sandbox.define(
  '/metadata/investment-involvement/',
  'GET',
  metadata.investmentInvolvement
)
Sandbox.define(
  '/metadata/investment-specific-programme/',
  'GET',
  metadata.investmentSpecificProgramme
)
Sandbox.define(
  '/metadata/investment-project-stage/',
  'GET',
  metadata.investmentProjectStage
)
Sandbox.define(
  '/metadata/investment-business-activity/',
  'GET',
  metadata.investmentBusinessActivity
)
Sandbox.define('/metadata/investment-type/', 'GET', metadata.investmentType)
Sandbox.define(
  '/metadata/investment-strategic-driver/',
  'GET',
  metadata.investmentStrategicDriver
)
Sandbox.define(
  '/metadata/order-service-type/',
  'GET',
  metadata.orderServiceType
)
Sandbox.define(
  '/metadata/order-cancellation-reason/',
  'GET',
  metadata.orderCancellationReason
)
Sandbox.define('/metadata/omis-market/', 'GET', metadata.omisMarket)
Sandbox.define('/metadata/salary-range/', 'GET', metadata.salaryRange)
Sandbox.define('/metadata/fdi-value/', 'GET', metadata.fdiValue)
Sandbox.define('/metadata/fdi-type/', 'GET', metadata.fdiType)
Sandbox.define('/metadata/turnover/', 'GET', metadata.turnover)
Sandbox.define('/metadata/sector/', 'GET', metadata.sector)
Sandbox.define('/metadata/location-type/', 'GET', metadata.locationType)
Sandbox.define('/metadata/event-type/', 'GET', metadata.eventType)
Sandbox.define('/metadata/programme/', 'GET', metadata.programme)
Sandbox.define('/metadata/business-type/', 'GET', metadata.businessType)
Sandbox.define('/metadata/evidence-tag/', 'GET', metadata.evidenceTag)
Sandbox.define('/metadata/employee-range/', 'GET', metadata.employeeRange)
Sandbox.define('/metadata/country/', 'GET', metadata.country)
Sandbox.define('/metadata/uk-region/', 'GET', metadata.ukRegion)
Sandbox.define(
  '/metadata/referral-source-website/',
  'GET',
  metadata.referralSourceWebsite
)
Sandbox.define(
  '/metadata/referral-source-marketing/',
  'GET',
  metadata.referralSourceMarketing
)
Sandbox.define(
  '/metadata/referral-source-activity/',
  'GET',
  metadata.referralSourceActivity
)
Sandbox.define('/metadata/headquarter-type/', 'GET', metadata.headquarterType)
Sandbox.define('/metadata/service/', 'GET', metadata.service)
Sandbox.define(
  '/metadata/communication-channel/',
  'GET',
  metadata.communicationChannel
)
Sandbox.define('/metadata/team/', 'GET', metadata.team)
Sandbox.define('/metadata/policy-area/', 'GET', metadata.policyArea)
Sandbox.define('/metadata/policy-issue-type/', 'GET', metadata.policyIssueType)
Sandbox.define(
  '/metadata/service-delivery-status/',
  'GET',
  metadata.serviceDeliveryStatus
)
Sandbox.define(
  '/metadata/capital-investment/investor-type/',
  'GET',
  metadata.capitalInvestmentInvestorType
)
Sandbox.define(
  '/metadata/capital-investment/required-checks-conducted/',
  'GET',
  metadata.capitalInvestmentRequiredChecks
)
Sandbox.define(
  '/metadata/capital-investment/deal-ticket-size/',
  'GET',
  metadata.capitalInvestmentDealTicketSize
)
Sandbox.define(
  '/metadata/capital-investment/large-capital-investment-type/',
  'GET',
  metadata.capitalInvestmentInvestmentTypes
)
Sandbox.define(
  '/metadata/capital-investment/return-rate/',
  'GET',
  metadata.capitalInvestmentMinimumReturnRate
)
Sandbox.define(
  '/metadata/capital-investment/time-horizon/',
  'GET',
  metadata.capitalInvestmentTimeHorizons
)
Sandbox.define(
  '/metadata/capital-investment/restriction/',
  'GET',
  metadata.capitalInvestmentRestrictions
)
Sandbox.define(
  '/metadata/capital-investment/construction-risk/',
  'GET',
  metadata.capitalInvestmentConstructionRisks
)
Sandbox.define(
  '/metadata/capital-investment/equity-percentage/',
  'GET',
  metadata.capitalInvestmentEquityPercentage
)
Sandbox.define(
  '/metadata/capital-investment/desired-deal-role/',
  'GET',
  metadata.capitalInvestmentDesiredDealRoles
)
Sandbox.define(
  '/metadata/capital-investment/asset-class-interest/',
  'GET',
  metadata.capitalInvestmentAssetClassInterest
)
Sandbox.define('/metadata/one-list-tier/', 'GET', metadata.oneListTier)

// V4 Metadata endpoints
Sandbox.define(
  '/v4/metadata/likelihood-to-land',
  'GET',
  v4Metadata.likelihoodToLand
)
Sandbox.define(
  '/v4/metadata/export-experience-category',
  'GET',
  v4Metadata.exportExperienceCategory
)
Sandbox.define(
  '/v4/metadata/investment-investor-type',
  'GET',
  v4Metadata.investmentInvestorType
)
Sandbox.define(
  '/v4/metadata/investment-involvement',
  'GET',
  v4Metadata.investmentInvolvement
)
Sandbox.define(
  '/v4/metadata/investment-specific-programme',
  'GET',
  v4Metadata.investmentSpecificProgramme
)
Sandbox.define(
  '/v4/metadata/investment-project-stage',
  'GET',
  v4Metadata.investmentProjectStage
)
Sandbox.define(
  '/v4/metadata/investment-business-activity',
  'GET',
  v4Metadata.investmentBusinessActivity
)
Sandbox.define('/v4/metadata/investment-type', 'GET', v4Metadata.investmentType)
Sandbox.define(
  '/v4/metadata/investment-strategic-driver',
  'GET',
  v4Metadata.investmentStrategicDriver
)
Sandbox.define(
  '/v4/metadata/order-service-type',
  'GET',
  v4Metadata.orderServiceType
)
Sandbox.define(
  '/v4/metadata/order-cancellation-reason',
  'GET',
  v4Metadata.orderCancellationReason
)
Sandbox.define('/v4/metadata/omis-market', 'GET', v4Metadata.omisMarket)
Sandbox.define('/v4/metadata/salary-range', 'GET', v4Metadata.salaryRange)
Sandbox.define('/v4/metadata/fdi-value', 'GET', v4Metadata.fdiValue)
Sandbox.define('/v4/metadata/fdi-type', 'GET', v4Metadata.fdiType)
Sandbox.define('/v4/metadata/turnover', 'GET', v4Metadata.turnover)
Sandbox.define('/v4/metadata/sector', 'GET', v4Metadata.sector)
Sandbox.define('/v4/metadata/location-type', 'GET', v4Metadata.locationType)
Sandbox.define('/v4/metadata/event-type', 'GET', v4Metadata.eventType)
Sandbox.define('/v4/metadata/programme', 'GET', v4Metadata.programme)
Sandbox.define('/v4/metadata/business-type', 'GET', v4Metadata.businessType)
Sandbox.define('/v4/metadata/evidence-tag', 'GET', v4Metadata.evidenceTag)
Sandbox.define('/v4/metadata/employee-range', 'GET', v4Metadata.employeeRange)
Sandbox.define('/v4/metadata/country', 'GET', v4Metadata.country)
Sandbox.define('/v4/metadata/uk-region', 'GET', v4Metadata.ukRegion)
Sandbox.define(
  '/v4/metadata/referral-source-website',
  'GET',
  v4Metadata.referralSourceWebsite
)
Sandbox.define(
  '/v4/metadata/referral-source-marketing',
  'GET',
  v4Metadata.referralSourceMarketing
)
Sandbox.define(
  '/v4/metadata/referral-source-activity',
  'GET',
  v4Metadata.referralSourceActivity
)
Sandbox.define(
  '/v4/metadata/headquarter-type',
  'GET',
  v4Metadata.headquarterType
)
Sandbox.define('/v4/metadata/service', 'GET', v4Metadata.service)
Sandbox.define(
  '/v4/metadata/communication-channel',
  'GET',
  v4Metadata.communicationChannel
)
Sandbox.define('/v4/metadata/team', 'GET', v4Metadata.team)
Sandbox.define('/v4/metadata/policy-area', 'GET', v4Metadata.policyArea)
Sandbox.define(
  '/v4/metadata/policy-issue-type',
  'GET',
  v4Metadata.policyIssueType
)
Sandbox.define(
  '/v4/metadata/service-delivery-status',
  'GET',
  v4Metadata.serviceDeliveryStatus
)
Sandbox.define(
  '/v4/metadata/capital-investment/investor-type',
  'GET',
  v4Metadata.capitalInvestmentInvestorType
)
Sandbox.define(
  '/v4/metadata/capital-investment/required-checks-conducted',
  'GET',
  v4Metadata.capitalInvestmentRequiredChecks
)
Sandbox.define(
  '/v4/metadata/capital-investment/deal-ticket-size',
  'GET',
  v4Metadata.capitalInvestmentDealTicketSize
)
Sandbox.define(
  '/v4/metadata/capital-investment/large-capital-investment-type',
  'GET',
  v4Metadata.capitalInvestmentInvestmentTypes
)
Sandbox.define(
  '/v4/metadata/capital-investment/return-rate',
  'GET',
  v4Metadata.capitalInvestmentMinimumReturnRate
)
Sandbox.define(
  '/v4/metadata/capital-investment/time-horizon',
  'GET',
  v4Metadata.capitalInvestmentTimeHorizons
)
Sandbox.define(
  '/v4/metadata/capital-investment/restriction',
  'GET',
  v4Metadata.capitalInvestmentRestrictions
)
Sandbox.define(
  '/v4/metadata/capital-investment/construction-risk',
  'GET',
  v4Metadata.capitalInvestmentConstructionRisks
)
Sandbox.define(
  '/v4/metadata/capital-investment/equity-percentage',
  'GET',
  v4Metadata.capitalInvestmentEquityPercentage
)
Sandbox.define(
  '/v4/metadata/capital-investment/desired-deal-role',
  'GET',
  v4Metadata.capitalInvestmentDesiredDealRoles
)
Sandbox.define(
  '/v4/metadata/capital-investment/asset-class-interest',
  'GET',
  v4Metadata.capitalInvestmentAssetClassInterest
)
Sandbox.define('/v4/metadata/one-list-tier', 'GET', v4Metadata.oneListTier)

// Ping
Sandbox.define('/ping.xml', 'GET', healthcheck.ping)

// V3 Contact
Sandbox.define('/v3/contact', 'GET', v3Contact.contact)
Sandbox.define('/v3/contact', 'POST', v3Contact.contactCreate)
Sandbox.define('/v3/contact/{contactId}', 'GET', v3Contact.contactById)

// V3 Event
Sandbox.define('/v3/event/{eventId}', 'GET', v3Event.eventById)

// V3 Feature Flag
Sandbox.define('/v3/feature-flag', 'GET', v3FeatureFlag.featureFlag)

// V3 Interaction
Sandbox.define('/v3/interaction', 'GET', v3Interaction.getInteractions)
Sandbox.define(
  '/v3/interaction/{interactionId}',
  'GET',
  v3Interaction.getInteractionById
)
Sandbox.define('/v3/interaction', 'POST', v3Interaction.createInteraction)
Sandbox.define(
  '/v3/interaction/{interactionId}/archive',
  'POST',
  v3Interaction.archiveInteraction
)
Sandbox.define(
  '/v3/interaction/{interactionId}',
  'PATCH',
  v3Interaction.archiveInteraction
)

// V3 Investment
Sandbox.define('/v3/investment', 'GET', v3Investment.investmentProjects)
Sandbox.define('/v3/investment/{id}', 'GET', v3Investment.investmentProjectById)

// V3 Search
Sandbox.define('/v3/search/company', 'POST', v3SearchCompany.companies)
Sandbox.define('/v3/search/contact', 'POST', v3SearchContact.contacts)
Sandbox.define('/v3/search/event', 'POST', v3SearchEvent.events)
Sandbox.define('/v3/search/order', 'POST', v3SearchOrder.order)
Sandbox.define(
  '/v3/search/investment_project',
  'POST',
  v3SearchInvestmentProject.investmentProjects
)
Sandbox.define(
  '/v3/search/interaction',
  'POST',
  v3SearchInteraction.interaction
)

// V4 activity feed
Sandbox.define('/v4/activity-feed', 'GET', v4ActivityFeed.activityFeed)

// V4 CH Company
Sandbox.define('/v4/ch-company/{companyId}', 'GET', v4ChCompany.company)

// V4 Company
Sandbox.define('/v4/company/{companyId}', 'GET', v4Company.company)
Sandbox.define('/v4/company/{companyId}', 'PATCH', v4Company.companyPatched)
Sandbox.define('/v4/company', 'GET', v4Company.companies)
Sandbox.define(
  '/v4/company/{companyId}/{action}-account-manager',
  'POST',
  v4Company.manageAdviser
)
Sandbox.define('/v4/company/{companyId}/audit', 'GET', v4Company.companyAudit)

// V4 DnB
Sandbox.define('/v4/dnb/company-create', 'POST', v4Dnb.companyCreate)
Sandbox.define(
  '/v4/dnb/company-create-investigation',
  'POST',
  v4Dnb.companyCreateInvestigation
)
Sandbox.define('/v4/dnb/company-search', 'POST', v4Dnb.companySearch)

// V4 legacy company list
Sandbox.define(
  '/v4/user/company-list/{companyId}',
  'GET',
  v4Company.getCompanyList
)
Sandbox.define('/v4/user/company-list', 'GET', v4Company.getCompanyList)

// V4 new company list endpoints (with multiple list support)
Sandbox.define('/v4/company-list', 'GET', v4CompanyList.getCompanyLists)
Sandbox.define('/v4/company-list/{listId}', 'GET', v4CompanyList.getCompanyList)
Sandbox.define(
  '/v4/company-list/{listId}/item',
  'GET',
  v4CompanyList.getCompanyListItems
)
Sandbox.define('/v4/company-list', 'POST', v4CompanyList.createCompanyList)
Sandbox.define(
  '/v4/company-list/{listId}',
  'DELETE',
  v4CompanyList.deleteCompanyList
)
Sandbox.define(
  '/v4/company-list/{listId}',
  'PATCH',
  v4CompanyList.editCompanyList
)

// V4 Investment
Sandbox.define(
  '/v4/large-investor-profile',
  'GET',
  v4Company.largeInvestorProfile
)
Sandbox.define(
  '/v4/large-investor-profile/{profileId}',
  'PATCH',
  v4Company.largeInvestorProfilePatched
)
Sandbox.define(
  '/v4/large-investor-profile',
  'POST',
  v4Company.largeInvestorProfilePostCreate
)

// V4 Search
Sandbox.define('/v4/search/company', 'POST', v4SearchCompany.companies)
Sandbox.define(
  '/v4/search/large-investor-profile',
  'POST',
  v4SearchLargeInvestorProfiles.largeInvestorProfile
)
Sandbox.define(
  '/v4/search/company/autocomplete',
  'GET',
  v4SearchCompanyWithCountry.companiesAutocomplete
)

// V4 Company export country history
Sandbox.define('/v4/export-country-history', 'GET', v4ExportCountryHistory)

// Whoami endpoint
Sandbox.define('/whoami/', 'GET', user.whoami)

// Help centre endpoint
Sandbox.define('/help-centre/announcement', 'GET', helpCentre.announcement)

// Zendesk tickets endpoint
Sandbox.define('/zendesk/tickets', 'POST', zendesk.tickets)
